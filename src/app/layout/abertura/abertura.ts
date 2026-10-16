import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { Abertura } from '../../core/abertura';

/** Nome compartilhado entre a janela de Run e o item da barra de status (View Transition). */
const NOME_DO_CONSOLE = 'console-de-run';
/** Destino do recolher por CSS: o aviso ainda está vazio (sem tamanho), então vale o caminho do arquivo. */
const DESTINO_DO_RECOLHER_POR_CSS = 'footer .caminho';

type DocumentoComTransicao = Document & {
  startViewTransition?: (atualizar: () => Promise<void> | void) => ViewTransition;
};

/**
 * Camada da abertura: o DOM, o foco, o `inert` e a coreografia de recolher. O estado e o relógio
 * são do serviço `Abertura`; o movimento está no CSS. É um diálogo modal com o resto da casca
 * `inert`; o foco vai para o ▶ quando o projeto fica pronto, para a janela ao executar e para o
 * `<main>` ao fim. Esc não faz nada e não há botão de pular.
 */
@Component({
  selector: 'app-abertura',
  imports: [NgOptimizedImage],
  templateUrl: './abertura.html',
  styleUrls: ['./abertura.scss', './widget-de-run.scss', './janela-de-build.scss'],
  host: {
    '[hidden]': 'abertura.dispensada()',
    '[attr.data-recolher-fallback]': "recolherPorClasses() ? '' : null",
    '(document:keydown)': 'aoTeclar($event)',
  },
})
export class AberturaComponente {
  private readonly documento = inject(DOCUMENT) as DocumentoComTransicao;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly injector = inject(Injector);
  private readonly router = inject(Router);
  private readonly botaoRun = viewChild<ElementRef<HTMLElement>>('botaoRun');
  private readonly janela = viewChild<ElementRef<HTMLElement>>('janela');
  private bloqueados: Element[] = [];
  private faseAnterior: string | null = null;

  protected readonly abertura = inject(Abertura);
  protected readonly recolherPorClasses = signal(false);

  protected readonly fase = this.abertura.fase;
  protected readonly etapaTexto = this.abertura.etapaTexto;
  protected readonly progresso = this.abertura.progresso;
  protected readonly dicaEmDestaque = this.abertura.dicaEmDestaque;
  protected readonly pulso = this.abertura.pulso;
  protected readonly tarefas = this.abertura.tarefas;
  protected readonly arquivosCompilados = this.abertura.arquivosCompilados;
  protected readonly totalDeClasses = this.abertura.totalDeClasses;
  protected readonly progressoDoBuild = this.abertura.progressoDoBuild;
  protected readonly buildConcluido = this.abertura.buildConcluido;
  protected readonly abaAtiva = this.abertura.abaAtiva;
  protected readonly linhasDoLog = this.abertura.linhasDoLog;
  protected readonly anuncio = this.abertura.anuncio;
  protected readonly reduzido = this.abertura.reduzido;
  protected readonly atalho = () => this.abertura.atalho;
  protected readonly teclasDoAtalho = () => this.abertura.teclasDoAtalho;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.abertura.cancelar();
      this.liberarOResto();
    });
    this.abertura.transicaoDeRevelacao.set((entrar) => this.revelar(entrar));
    afterNextRender(() => this.abertura.iniciar());
    effect(() => this.aoMudarDeFase(this.abertura.fase()));
  }

  protected executar(): void {
    this.abertura.executar();
  }

  /** O atalho de executar do IntelliJ: ⌃R no Mac, ⇧F10 nos outros sistemas. Esc não faz nada. */
  protected aoTeclar(evento: KeyboardEvent): void {
    if (this.abertura.fase() !== 'pronto') return;
    const mac = this.abertura.ehMac && evento.ctrlKey && !evento.metaKey && evento.key === 'r';
    const outros = !this.abertura.ehMac && evento.shiftKey && evento.key === 'F10';
    if (!mac && !outros) return;
    evento.preventDefault();
    this.abertura.executar();
  }

  private aoMudarDeFase(fase: string): void {
    const anterior = this.faseAnterior;
    this.faseAnterior = fase;
    untracked(() => {
      if (fase === 'splash') this.bloquearOResto();
      if (fase === 'pronto') this.focarDepoisDeRenderizar(() => this.botaoRun());
      if (fase === 'compilando') this.focarDepoisDeRenderizar(() => this.janela());
      // Libera também ao encerrar: com a aba oculta a revelação pode ser pulada pelo relógio.
      if (fase === 'revelando' || fase === 'encerrada') this.liberarOResto();
      // O foco só vai para o editor quando a abertura realmente rodou: nunca no estado inicial.
      if (fase === 'encerrada' && anterior === 'revelando') this.focarOEditor();
    });
  }

  // ---------- inert e foco ----------

  /** O resto da casca fica inerte só enquanto a abertura dura; ela mesma e o conteúdo seguem no DOM. */
  private bloquearOResto(): void {
    const irmaos = Array.from(this.host.parentElement?.children ?? []).filter(
      (el) => el !== this.host,
    );
    this.bloqueados = irmaos.filter((el) => !el.hasAttribute('inert'));
    this.bloqueados.forEach((el) => el.setAttribute('inert', ''));
  }

  private liberarOResto(): void {
    this.bloqueados.forEach((el) => el.removeAttribute('inert'));
    this.bloqueados = [];
  }

  private focarDepoisDeRenderizar(alvo: () => ElementRef<HTMLElement> | undefined): void {
    afterNextRender(() => alvo()?.nativeElement.focus({ preventScroll: true }), {
      injector: this.injector,
    });
  }

  private focarOEditor(): void {
    const editor = this.documento.querySelector<HTMLElement>('main');
    editor?.focus({ preventScroll: true });
  }

  // ---------- revelação ----------

  /**
   * Recolhe a janela de Run até o item da barra de status. Com View Transitions, a janela e o item
   * dividem o nome `console-de-run`; sem a API, o host recebe `data-recolher-fallback` e a mesma
   * coreografia sai por CSS, com o deslocamento e a escala nas variáveis `--recolher-*`.
   */
  private revelar(entrar: () => void): void {
    const janela = this.janela()?.nativeElement;
    const item = this.documento.querySelector<HTMLElement>(DESTINO_DO_RECOLHER_POR_CSS);
    const podeTransitar =
      typeof this.documento.startViewTransition === 'function' &&
      this.router.currentNavigation() === null;

    if (janela && item) this.medirRecolhimento(janela, item);
    if (!janela || !podeTransitar) {
      this.recolherPorClasses.set(true);
      entrar();
      return;
    }

    janela.style.viewTransitionName = NOME_DO_CONSOLE;
    const transicao = this.documento.startViewTransition!(() => {
      janela.style.viewTransitionName = '';
      entrar();
      return new Promise<void>((resolver) =>
        afterNextRender(() => resolver(), { injector: this.injector }),
      );
    });
    // Pular ou abortar a transição não é erro: a revelação já foi feita pelo callback.
    transicao.ready.catch(() => undefined);
    transicao.finished.catch(() => undefined);
  }

  /** Deslocamento e escala que levam a janela ao retângulo do item da barra de status. */
  private medirRecolhimento(janela: HTMLElement, item: HTMLElement): void {
    const de = janela.getBoundingClientRect();
    const para = item.getBoundingClientRect();
    if (!de.width || !de.height) return;
    const estilo = this.host.style;
    estilo.setProperty('--recolher-x', `${para.left - de.left}px`);
    estilo.setProperty('--recolher-y', `${para.top - de.top}px`);
    estilo.setProperty('--recolher-sx', String(para.width / de.width));
    estilo.setProperty('--recolher-sy', String(para.height / de.height));
  }
}
