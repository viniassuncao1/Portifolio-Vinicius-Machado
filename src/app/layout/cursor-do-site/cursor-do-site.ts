import {
  DestroyRef,
  DOCUMENT,
  Component,
  ElementRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';

import { MovimentoConfig } from '../../core/movimento/movimento-config';

/** Elementos sobre os quais o anel cresce: os que respondem a clique. */
const ALVOS = 'a[href], button, [role="button"], [role="tab"], summary, input, label';

/**
 * Anel que acompanha o ponteiro e cresce sobre links e botões. É um complemento: o cursor do
 * sistema continua visível, o anel não recebe eventos, é escondido de leitores de tela e só existe
 * com mouse ou trackpad e sem movimento reduzido (nunca em toque).
 */
@Component({
  selector: 'app-cursor-do-site',
  host: {
    'aria-hidden': 'true',
    '[attr.data-ativo]': 'ativo()',
    '[attr.data-sobre-alvo]': 'sobreAlvo()',
  },
  template: `<span class="anel"></span>`,
  styleUrl: './cursor-do-site.scss',
})
export class CursorDoSite {
  private readonly movimento = inject(MovimentoConfig);
  private readonly documento = inject(DOCUMENT);
  private readonly destruir = inject(DestroyRef);
  private readonly anel = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly ativo = signal(false);
  protected readonly sobreAlvo = signal(false);

  constructor() {
    afterNextRender(() => {
      if (!this.movimento.ponteiroFino || !this.movimento.deveAnimar()) return;
      const anel = this.anel;
      let quadro = 0;
      const mover = (evento: PointerEvent) => {
        cancelAnimationFrame(quadro);
        quadro = requestAnimationFrame(() => {
          anel.style.setProperty('--x', `${evento.clientX}px`);
          anel.style.setProperty('--y', `${evento.clientY}px`);
        });
        this.ativo.set(true);
        this.sobreAlvo.set((evento.target as Element | null)?.closest?.(ALVOS) != null);
      };
      const sair = () => this.ativo.set(false);
      this.documento.addEventListener('pointermove', mover, { passive: true });
      this.documento.addEventListener('pointerleave', sair);
      this.destruir.onDestroy(() => {
        cancelAnimationFrame(quadro);
        this.documento.removeEventListener('pointermove', mover);
        this.documento.removeEventListener('pointerleave', sair);
      });
    });
  }
}
