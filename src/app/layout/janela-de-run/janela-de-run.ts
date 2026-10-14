import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { JanelaDeRun } from '../../core/janela-de-run';
import { GlifoFechar } from '../../shared/glifo-fechar/glifo-fechar';
import { montarLog } from './log';

/**
 * Janela de Run na parte de baixo da IDE, dividindo a área com o painel do Git. Mostra o log de
 * inicialização (texto, nunca imagem); por enquanto o log aparece completo e o Compasso o revela
 * linha a linha: cada `.linha` tem `--indice` e a seção tem `data-execucao` e `data-terminado`. A
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

  constructor() {
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

  private rolarParaOFim(): void {
    const log = this.log()?.nativeElement;
    if (log) log.scrollTop = log.scrollHeight;
  }

  protected fechar(evento?: Event): void {
    evento?.stopPropagation();
    this.run.fechar();
  }
}
