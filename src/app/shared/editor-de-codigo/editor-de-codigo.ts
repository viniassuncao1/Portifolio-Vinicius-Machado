import {
  Component,
  DOCUMENT,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  DestroyRef,
  Injector,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { EstadoDoEditor } from '../../core/estado-do-editor';
import { ProximoArquivo } from '../proximo-arquivo/proximo-arquivo';
import { VisaoDeCodigo } from '../visao-de-codigo/visao-de-codigo';
import { BotaoExecutar } from '../botao-executar/botao-executar';
import { JavadocDoEditor } from './javadoc-do-editor';
import { FAIXAS_PADRAO, faixasDeNumeracao } from './numeracao';
import type { Faixa, Numeracao } from './numeracao';
import { ModoDeLeitura } from './modo-de-leitura';
import type { ConteudoDoEditor, Linha } from './conteudo';
import { HistoricoDeDigitacao } from './historico-de-digitacao';

const DURACAO_MAXIMA_DA_DIGITACAO_MS = 1500;
const DURACAO_POR_ITEM_MS = 40;
/** Folga do fallback por tempo sobre a duração da digitação. */
const FOLGA_DO_FALLBACK_MS = 100;
const MOVIMENTO_REDUZIDO = '(prefers-reduced-motion: reduce)';

/**
 * Editor de código da IDE. O texto fica sempre completo no DOM: a digitação só revela o texto por
 * máscara de CSS (`--digitado` conta quantos itens já foram revelados), então leitores de tela e o
 * HTML pré-renderizado recebem o código inteiro. Clique ou tecla completam a digitação.
 */
@Component({
  selector: 'app-editor-de-codigo',
  imports: [BotaoExecutar, JavadocDoEditor, ProximoArquivo, VisaoDeCodigo],
  templateUrl: './editor-de-codigo.html',
  styleUrl: './editor-de-codigo.scss',
  host: {
    '[class.digitando]': 'digitando()',
    '[class.pronto]': 'pronto()',
    '[class.com-calha]': 'temCalha()',
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
  private readonly injector = inject(Injector);
  private readonly leitura = inject(ModoDeLeitura);
  private observador: ResizeObserver | undefined;
  private quadro = 0;
  private temporizador: ReturnType<typeof setTimeout> | undefined;

  readonly conteudo = input.required<ConteudoDoEditor>();

  /** A coluna de números: por linha lógica, medida no navegador (1 a 99 até a primeira medição). */
  protected readonly faixas = signal<readonly Faixa[]>(FAIXAS_PADRAO);
  /** Reserva a calha à esquerda dos números só quando alguma linha tem o ▶ de executar. */
  protected readonly temCalha = computed(() =>
    this.conteudo().some(
      (item) => item.tipo === 'javadoc' || (item.tipo === 'codigo' && item.executavel),
    ),
  );
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
    // A numeração acompanha o conteúdo, o modo de leitura e o tamanho da tela (o texto quebra).
    effect(() => {
      void this.conteudo();
      void this.leitura.ativo();
      afterNextRender(() => this.medirNumeracao(), { injector: this.injector });
    });
    inject(DestroyRef).onDestroy(() => this.cancelarAgendamentos());
  }

  protected readonly ehJavadoc = (item: Linha | undefined): boolean => item?.tipo === 'javadoc';

  protected ehExterno(href: string): boolean {
    return href.startsWith('http');
  }

  protected aoClicar(evento: MouseEvent): void {
    if (this.navegarPorLinkInterno(evento)) return;
    if (this.digitando()) {
      this.completarDigitacao();
      return;
    }
    const alvo = evento.target instanceof Element ? evento.target.closest('[data-indice]') : null;
    const indice = Number(alvo?.getAttribute('data-indice'));
    if (!alvo || Number.isNaN(indice)) return;
    this.itemAtual.set(indice);
    this.estado.posicionar(this.numeroDoItem(indice), 1);
  }

  /**
   * Links internos (`href` que começa com `/`) navegam pelo roteador, sem recarregar a página. Clique
   * com Ctrl, Cmd, Shift ou Alt e o botão do meio seguem o comportamento do navegador.
   */
  private navegarPorLinkInterno(evento: MouseEvent): boolean {
    const link = evento.target instanceof Element ? evento.target.closest('a') : null;
    const href = link?.getAttribute('href');
    const modificado = evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey;
    if (!href?.startsWith('/') || href.startsWith('//')) return false;
    if (evento.button !== 0 || modificado || evento.defaultPrevented) return false;
    evento.preventDefault();
    void this.router.navigateByUrl(href);
    return true;
  }

  protected completarDigitacao(): void {
    if (!this.digitando()) return;
    this.concluir();
  }

  /** Mede de novo quando o texto quebra diferente: a tela mudou de tamanho ou as fontes chegaram. */
  private observarTamanho(): void {
    const Observador = this.documento.defaultView?.ResizeObserver;
    const codigo = this.host.querySelector('.codigo');
    if (!Observador || !codigo) return;
    this.observador = new Observador(() => this.medirNumeracao());
    this.observador.observe(codigo);
  }

  private cancelarAgendamentos(): void {
    this.observador?.disconnect();
    this.documento.defaultView?.cancelAnimationFrame?.(this.quadro);
    clearTimeout(this.temporizador);
  }

  private iniciar(): void {
    this.observarTamanho();
    const janela = this.documento.defaultView;
    const reduzido = janela?.matchMedia?.(MOVIMENTO_REDUZIDO).matches ?? false;
    const primeiraVez = this.historico.registrarPrimeiraVista(this.router.url.split(/[?#]/)[0]);
    const total = this.conteudo().length;

    if (!janela || reduzido || !primeiraVez || total === 0) {
      this.pronto.set(true);
      this.estado.posicionar(this.numeroDoItem(this.itemAtual()), 1);
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
    // Em aba oculta o requestAnimationFrame pausa; o tempo garante que o código nunca fique escondido.
    this.temporizador = setTimeout(() => this.completarDigitacao(), duracao + FOLGA_DO_FALLBACK_MS);
  }

  private concluir(): void {
    this.cancelarAgendamentos();
    this.host.style.removeProperty('--digitado');
    this.digitando.set(false);
    this.pronto.set(true);
    this.estado.posicionar(this.numeroDoItem(this.itemAtual()), 1);
  }

  private elementoDoItem(indice: number): Element | null {
    return this.host.querySelector(`[data-indice="${indice}"]`);
  }

  /** Número da linha (base 1) em que o item começa, igual ao da coluna de números. */
  private numeroDoItem(indice: number): number {
    return this.calcularNumeracao()?.numeroDoItem[indice] ?? indice + 1;
  }

  private medirNumeracao(): void {
    const numeracao = this.calcularNumeracao();
    if (numeracao) this.faixas.set(numeracao.faixas);
  }

  /** Mede os itens no navegador; `null` sem layout (servidor) ou com o conteúdo ainda por renderizar. */
  private calcularNumeracao(): Numeracao | null {
    const itens = this.conteudo();
    const porIndice = new Map(
      Array.from(this.host.querySelectorAll('[data-indice]'), (el) => [
        Number(el.getAttribute('data-indice')),
        el,
      ]),
    );
    const elementos = itens.map((_, i) => porIndice.get(i));
    if (itens.length === 0 || elementos.some((elemento) => !elemento)) return null;
    const alturas = elementos.map((elemento) => elemento!.getBoundingClientRect().height);
    if (alturas.every((altura) => altura === 0)) return null;

    const javadoc = elementos.find((_, i) => itens[i].tipo === 'javadoc');
    const alturaDaLinhaDoJavadoc = javadoc
      ? parseFloat(getComputedStyle(javadoc).lineHeight) || 0
      : 0;
    const lente = this.host.querySelector<HTMLElement>('.visao-de-codigo');
    const antesDoItem = itens.findIndex((item) => item.tipo === 'codigo' && item.executavel);
    const comLente = lente?.querySelector('button, a') && antesDoItem !== -1;
    return faixasDeNumeracao(itens, {
      alturas,
      alturaDaLinhaDoJavadoc: alturaDaLinhaDoJavadoc || alturas[0],
      leitura: this.leitura.ativo(),
      visao:
        comLente && lente ? { antesDoItem, altura: lente.getBoundingClientRect().height } : null,
    });
  }
}
