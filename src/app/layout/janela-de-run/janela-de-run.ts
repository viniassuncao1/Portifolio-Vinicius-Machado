import {
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';

import { JanelaDeRun } from '../../core/janela-de-run';
import { GlifoFechar } from '../../shared/glifo-fechar/glifo-fechar';
import { montarLog } from './log';

/** Linhas reveladas de uma vez: o banner do Spring, a versão e a linha em branco. */
const LINHAS_DO_BANNER = 8;
const INTERVALO_ENTRE_LINHAS_MS = 200;
/** Teto da revelação: o log completo aparece em até 2,5 s, mesmo se os intervalos atrasarem. */
const DURACAO_MAXIMA_MS = 2500;

/**
 * Janela de Run na parte de baixo da IDE, dividindo a área com o painel do Git. Mostra o log de
 * inicialização (texto, nunca imagem); o log é revelado em até 2,5 s (banner de uma vez, depois uma linha a cada
 * ~200 ms) e "Pular" o completa na hora. O texto fica sempre no DOM; as linhas ainda não reveladas
 * só ficam escondidas, e um teto de tempo garante o log completo mesmo sem os intervalos. A
 * linha final é anunciada uma vez, por uma região `aria-live="polite"`, quando o log termina. Pular
 * e fechar ficam no cabeçalho; Esc fecha com o foco dentro da janela. Abre sem roubar o foco, a
 * não ser que o visitante tenha pedido pelo Executar.
 */
@Component({
  selector: 'app-janela-de-run',
  imports: [GlifoFechar],
  templateUrl: './janela-de-run.html',
  styleUrl: './janela-de-run.scss',
  host: {
    '[attr.data-aberto]': 'run.aberto()',
    '(keydown.escape)': 'fechar($event)',
  },
})
export class JanelaDeRunComponente {
  private readonly injector = inject(Injector);
  private readonly secao = viewChild<ElementRef<HTMLElement>>('secao');
  private readonly log = viewChild<ElementRef<HTMLElement>>('log');

  protected readonly run = inject(JanelaDeRun);
  /** O log desta execução: a data e a hora vêm do relógio do navegador, na abertura. */
  protected readonly linhas = computed(() => {
    const inicio = this.run.inicio();
    return inicio ? montarLog(inicio) : [];
  });
  protected readonly anuncio = signal('');
  /** Quantas linhas já foram reveladas nesta execução. */
  protected readonly reveladas = signal(0);
  private temporizadores: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    inject(DestroyRef).onDestroy(() => this.cancelarRevelacao());
    // Cada execução recomeça a revelação; terminado (pular, movimento reduzido) mostra tudo.
    effect(() => {
      void this.run.execucao();
      const terminado = this.run.terminado();
      untracked(() => (terminado ? this.cancelarRevelacao() : this.revelar()));
    });
    effect(() => {
      if (!this.run.aberto() || !this.run.focarAoAbrir()) return;
      void this.run.execucao();
      afterNextRender(() => this.secao()?.nativeElement.focus(), { injector: this.injector });
    });
    // Como num console de verdade, o log rola até a linha mais recente.
    effect(() => {
      void this.linhas();
      afterNextRender(() => this.rolarParaOFim(), { injector: this.injector });
    });
    // A linha final é lida uma vez, só depois que o log termina.
    effect(() => {
      const final = this.linhas().at(-1)?.texto ?? '';
      const terminou = this.run.aberto() && this.run.terminado();
      this.anuncio.set('');
      if (terminou && final) {
        afterNextRender(() => this.anuncio.set(final.replace(/^\S+\s+/, '')), {
          injector: this.injector,
        });
      }
    });
  }

  protected visivel(indice: number): boolean {
    return this.run.terminado() || indice < this.reveladas();
  }

  private revelar(): void {
    this.cancelarRevelacao();
    const total = this.linhas().length;
    this.reveladas.set(Math.min(LINHAS_DO_BANNER, total));
    const restantes = Math.max(total - LINHAS_DO_BANNER, 0);
    for (let i = 1; i <= restantes; i++) {
      this.temporizadores.push(
        setTimeout(() => this.reveladas.set(LINHAS_DO_BANNER + i), i * INTERVALO_ENTRE_LINHAS_MS),
      );
    }
    const fim = Math.min(restantes * INTERVALO_ENTRE_LINHAS_MS, DURACAO_MAXIMA_MS);
    this.temporizadores.push(setTimeout(() => this.run.concluir(), fim));
    // Rede de segurança: nada depende de os intervalos acima rodarem em dia.
    this.temporizadores.push(setTimeout(() => this.run.concluir(), DURACAO_MAXIMA_MS));
  }

  private cancelarRevelacao(): void {
    this.temporizadores.forEach(clearTimeout);
    this.temporizadores = [];
  }

  private rolarParaOFim(): void {
    const log = this.log()?.nativeElement;
    if (log) log.scrollTop = log.scrollHeight;
  }

  protected fechar(evento?: Event): void {
    evento?.stopPropagation();
    this.run.fechar();
  }
}
