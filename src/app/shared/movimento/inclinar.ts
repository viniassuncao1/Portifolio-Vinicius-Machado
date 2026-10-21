import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';

import { MOLAS } from '../../core/movimento/movimento.tokens';
import { MovimentoConfig } from '../../core/movimento/movimento-config';

/** Inclinação máxima, em graus, quando o ponteiro está na borda do elemento. */
const INCLINACAO_MAXIMA = 5;
const PERSPECTIVA_PX = 900;

/**
 * O elemento se inclina de leve, em 3D, na direção do ponteiro e volta ao lugar com uma mola quando
 * ele sai. Só com mouse ou trackpad e sem movimento reduzido; em toque não faz nada. É acabamento:
 * nenhuma tarefa depende dele.
 */
@Directive({ selector: '[appInclinar]' })
export class Inclinar {
  constructor() {
    const elemento = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const movimento = inject(MovimentoConfig);
    const destruir = inject(DestroyRef);
    let destruido = false;
    destruir.onDestroy(() => (destruido = true));

    afterNextRender(async () => {
      if (!movimento.ponteiroFino) return;
      const biblioteca = await movimento.carregar();
      if (!biblioteca || destruido) return;

      const { animate } = biblioteca;
      const inclinar = (evento: PointerEvent) => {
        const caixa = elemento.getBoundingClientRect();
        const x = (evento.clientX - caixa.left) / caixa.width - 0.5;
        const y = (evento.clientY - caixa.top) / caixa.height - 0.5;
        animate(
          elemento,
          {
            transform: `perspective(${PERSPECTIVA_PX}px) rotateX(${-y * 2 * INCLINACAO_MAXIMA}deg) rotateY(${x * 2 * INCLINACAO_MAXIMA}deg)`,
          },
          MOLAS.agil,
        );
      };
      const soltar = () =>
        animate(
          elemento,
          { transform: `perspective(${PERSPECTIVA_PX}px) rotateX(0deg) rotateY(0deg)` },
          MOLAS.suave,
        );

      elemento.addEventListener('pointermove', inclinar);
      elemento.addEventListener('pointerleave', soltar);
      destruir.onDestroy(() => {
        elemento.removeEventListener('pointermove', inclinar);
        elemento.removeEventListener('pointerleave', soltar);
      });
    });
  }
}
