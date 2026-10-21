import {
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { MovimentoConfig } from '../../core/movimento/movimento-config';
import type { Projeto } from '../../core/projetos';
import { CartaoDeProjeto } from './cartao-de-projeto';

/** Deslocamento do ponteiro, em px, a partir do qual um clique vira arrasto. */
const LIMIAR_DE_ARRASTO = 6;

/**
 * Carrossel de cartões. A pista é uma rolagem horizontal nativa com `scroll-snap`, então toque,
 * trackpad, teclado e leitores de tela funcionam sem código; por cima disso o mouse arrasta, os
 * botões e os pontos levam a um cartão e as setas do teclado andam de cartão em cartão. Não anda
 * sozinho (o recrutador decide quando mudar de projeto) e não clona cartões: cada projeto existe
 * uma vez no DOM. No modo "grade" a mesma lista vira uma grade, sem rolagem.
 */
@Component({
  selector: 'app-carrossel-de-projetos',
  imports: [CartaoDeProjeto],
  templateUrl: './carrossel-de-projetos.html',
  styleUrl: './carrossel-de-projetos.scss',
})
export class CarrosselDeProjetos {
  private readonly movimento = inject(MovimentoConfig);
  private readonly pista = viewChild.required<ElementRef<HTMLElement>>('pista');

  readonly projetos = input.required<readonly Projeto[]>();
  readonly modo = input<'carrossel' | 'grade'>('carrossel');
  readonly abrir = output<{ projeto: Projeto; origem: HTMLElement }>();

  /** `true` depois da hidratação: só então arrasto, setas e botões respondem (os testes esperam por isto). */
  protected readonly pronto = signal(false);
  protected readonly ativo = signal(0);
  protected readonly primeiro = computed(() => this.ativo() === 0);
  protected readonly ultimo = computed(() => this.ativo() === this.projetos().length - 1);

  private quadro = 0;
  /** Cartão pedido por botão, ponto ou seta: vale como ativo mesmo quando a rolagem não o centraliza (os últimos). */
  private alvo: number | null = null;
  private arrastando = false;
  private houveArrasto = false;
  private inicioX = 0;
  private inicioRolagem = 0;

  constructor() {
    afterNextRender(() => {
      this.atualizarAtivo();
      this.pronto.set(true);
    });
  }

  /** Leva o cartão `indice` ao centro, pelo caminho mais curto. */
  protected irPara(indice: number): void {
    const cartoes = this.cartoes();
    const limitado = Math.max(0, Math.min(indice, cartoes.length - 1));
    const alvo = cartoes[limitado];
    if (!alvo) return;
    this.alvo = limitado;
    this.ativo.set(limitado);
    const pista = this.pista().nativeElement;
    if (typeof pista.scrollTo !== 'function') return;
    pista.scrollTo({
      left: alvo.offsetLeft - (pista.clientWidth - alvo.offsetWidth) / 2,
      behavior: this.movimento.reduzido() ? 'auto' : 'smooth',
    });
  }

  protected andar(passo: number): void {
    this.irPara(this.ativo() + passo);
  }

  protected aoRolar(): void {
    cancelAnimationFrame(this.quadro);
    this.quadro = requestAnimationFrame(() => this.atualizarAtivo());
  }

  protected aoTeclar(evento: KeyboardEvent): void {
    if (this.modo() === 'grade') return;
    const passo = evento.key === 'ArrowRight' ? 1 : evento.key === 'ArrowLeft' ? -1 : 0;
    if (!passo) return;
    const cartoes = this.cartoes();
    const atual = cartoes.findIndex((cartao) => cartao.contains(document.activeElement));
    const proximo = Math.max(
      0,
      Math.min((atual === -1 ? this.ativo() : atual) + passo, cartoes.length - 1),
    );
    evento.preventDefault();
    cartoes[proximo]?.focus({ preventScroll: true });
    this.irPara(proximo);
  }

  /** Rolagem do visitante (roda, toque, arrasto) volta a mandar no cartão ativo. */
  protected soltarAlvo(): void {
    this.alvo = null;
  }

  protected aoApertar(evento: PointerEvent): void {
    this.soltarAlvo();
    // Toque já rola nativamente; só o mouse precisa de arrasto.
    if (evento.pointerType !== 'mouse' || evento.button !== 0 || this.modo() === 'grade') return;
    const pista = this.pista().nativeElement;
    this.arrastando = true;
    this.houveArrasto = false;
    this.inicioX = evento.clientX;
    this.inicioRolagem = pista.scrollLeft;
  }

  protected aoMover(evento: PointerEvent): void {
    if (!this.arrastando) return;
    const pista = this.pista().nativeElement;
    const deslocamento = evento.clientX - this.inicioX;
    if (!this.houveArrasto && Math.abs(deslocamento) > LIMIAR_DE_ARRASTO) {
      this.houveArrasto = true;
      pista.classList.add('arrastando');
      pista.setPointerCapture(evento.pointerId);
    }
    if (this.houveArrasto) pista.scrollLeft = this.inicioRolagem - deslocamento;
  }

  protected aoSoltar(): void {
    if (!this.arrastando) return;
    this.arrastando = false;
    const pista = this.pista().nativeElement;
    pista.classList.remove('arrastando');
    if (this.houveArrasto) this.irPara(this.indiceMaisProximo());
  }

  /** Um arrasto não pode abrir o cartão em que o ponteiro foi solto. */
  protected aoClicarNaPista(evento: MouseEvent): void {
    if (!this.houveArrasto) return;
    evento.preventDefault();
    evento.stopPropagation();
    this.houveArrasto = false;
  }

  private cartoes(): HTMLElement[] {
    return Array.from(this.pista().nativeElement.querySelectorAll<HTMLElement>('a.cartao'));
  }

  private indiceMaisProximo(): number {
    const pista = this.pista().nativeElement;
    // Nas pontas a rolagem não consegue centralizar o primeiro e o último: eles valem como ativos.
    if (pista.scrollLeft <= 1) return 0;
    if (pista.scrollLeft >= pista.scrollWidth - pista.clientWidth - 1) {
      return this.cartoes().length - 1;
    }
    const centro = pista.scrollLeft + pista.clientWidth / 2;
    let melhor = 0;
    let menor = Number.POSITIVE_INFINITY;
    this.cartoes().forEach((cartao, indice) => {
      const distancia = Math.abs(cartao.offsetLeft + cartao.offsetWidth / 2 - centro);
      if (distancia < menor) {
        menor = distancia;
        melhor = indice;
      }
    });
    return melhor;
  }

  private atualizarAtivo(): void {
    this.ativo.set(this.alvo ?? this.indiceMaisProximo());
  }
}
