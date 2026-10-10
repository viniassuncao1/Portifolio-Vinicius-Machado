import {
  Component,
  DOCUMENT,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { EstadoDoEditor } from '../../core/estado-do-editor';
import type { ConteudoDoEditor } from './conteudo';
import { HistoricoDeDigitacao } from './historico-de-digitacao';

const QUANTIDADE_DE_NUMEROS = 99;
const DURACAO_MAXIMA_DA_DIGITACAO_MS = 1500;
const DURACAO_POR_ITEM_MS = 40;
const MOVIMENTO_REDUZIDO = '(prefers-reduced-motion: reduce)';

/**
 * Editor de código da IDE. O texto fica sempre completo no DOM: a digitação só revela o texto por
 * máscara de CSS (`--digitado` conta quantos itens já foram revelados), então leitores de tela e o
 * HTML pré-renderizado recebem o código inteiro. Clique ou tecla completam a digitação.
 */
@Component({
  selector: 'app-editor-de-codigo',
  templateUrl: './editor-de-codigo.html',
  styleUrl: './editor-de-codigo.scss',
  host: {
    '[class.digitando]': 'digitando()',
    '[class.pronto]': 'pronto()',
    '(click)': 'aoClicar($event)',
    '(document:keydown)': 'completarDigitacao()',
  },
})
export class EditorDeCodigo {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly documento = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly historico = inject(HistoricoDeDigitacao);
  private readonly estado = inject(EstadoDoEditor);
  private quadro = 0;

  readonly conteudo = input.required<ConteudoDoEditor>();

  protected readonly numeros = Array.from({ length: QUANTIDADE_DE_NUMEROS }, (_, i) => i + 1);
  protected readonly digitando = signal(false);
  protected readonly pronto = signal(false);

  /** Índice (base 0) da última linha de código: onde o cursor começa. */
  private readonly ultimoItem = computed(() => {
    const codigos = this.conteudo().flatMap((item, indice) =>
      item.tipo === 'codigo' ? [indice] : [],
    );
    return codigos.at(-1) ?? 0;
  });

  /** Item destacado como linha atual; volta ao fim do código quando o conteúdo muda. */
  protected readonly itemAtual = linkedSignal(() => this.ultimoItem());

  constructor() {
    afterNextRender(() => this.iniciar());
  }

  protected ehExterno(href: string): boolean {
    return href.startsWith('http');
  }

  protected aoClicar(evento: MouseEvent): void {
    if (this.digitando()) {
      this.completarDigitacao();
      return;
    }
    const alvo = evento.target instanceof Element ? evento.target.closest('[data-indice]') : null;
    const indice = Number(alvo?.getAttribute('data-indice'));
    if (!alvo || Number.isNaN(indice)) return;
    this.itemAtual.set(indice);
    this.estado.posicionar(this.linhaVisual(alvo), 1);
  }

  protected completarDigitacao(): void {
    if (!this.digitando()) return;
    this.documento.defaultView?.cancelAnimationFrame(this.quadro);
    this.concluir();
  }

  private iniciar(): void {
    const janela = this.documento.defaultView;
    const reduzido = janela?.matchMedia?.(MOVIMENTO_REDUZIDO).matches ?? false;
    const primeiraVez = this.historico.registrarPrimeiraVista(this.router.url.split(/[?#]/)[0]);
    const total = this.conteudo().length;

    if (!janela || reduzido || !primeiraVez || total === 0) {
      this.pronto.set(true);
      this.estado.posicionar(this.linhaVisual(this.elementoDoItem(this.itemAtual())), 1);
      return;
    }

    const duracao = Math.min(DURACAO_MAXIMA_DA_DIGITACAO_MS, total * DURACAO_POR_ITEM_MS);
    this.host.style.setProperty('--digitado', '0');
    this.digitando.set(true);

    let inicio: number | null = null;
    const passo = (agora: number): void => {
      inicio ??= agora;
      const progresso = Math.min((agora - inicio) / duracao, 1);
      this.host.style.setProperty('--digitado', String(progresso * total));
      if (progresso < 1) {
        this.quadro = janela.requestAnimationFrame(passo);
      } else {
        this.concluir();
      }
    };
    this.quadro = janela.requestAnimationFrame(passo);
  }

  private concluir(): void {
    this.host.style.removeProperty('--digitado');
    this.digitando.set(false);
    this.pronto.set(true);
    this.estado.posicionar(this.linhaVisual(this.elementoDoItem(this.itemAtual())), 1);
  }

  private elementoDoItem(indice: number): Element | null {
    return this.host.querySelector(`[data-indice="${indice}"]`);
  }

  /**
   * Número da linha visual (base 1) em que o item começa, igual ao da coluna de números. Um javadoc
   * ou parágrafo ocupa várias linhas na tela, então o índice do item não serve. Sem layout (por
   * exemplo, fora do navegador), cai no índice do item.
   */
  private linhaVisual(item: Element | null): number {
    const indice = Number(item?.getAttribute('data-indice') ?? this.itemAtual());
    const alturaDaLinha = this.host.querySelector('.numeros span')?.getBoundingClientRect().height;
    const topoDoCodigo = this.host.querySelector('.numeros')?.getBoundingClientRect().top;
    if (!item || !alturaDaLinha || topoDoCodigo === undefined) return indice + 1;
    const distancia = item.getBoundingClientRect().top - topoDoCodigo;
    return Math.max(1, Math.floor((distancia + alturaDaLinha / 2) / alturaDaLinha) + 1);
  }
}
