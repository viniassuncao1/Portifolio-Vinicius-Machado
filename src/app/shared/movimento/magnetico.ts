import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';

import { MOLAS } from '../../core/movimento/movimento.tokens';
import { MovimentoConfig } from '../../core/movimento/movimento-config';

/** Fração da distância ao centro que o elemento acompanha do ponteiro. */
const FORCA = 0.3;

/**
 * O elemento segue de leve o ponteiro quando ele está perto e volta ao lugar com uma mola quando
 * sai. Só com mouse ou trackpad e sem movimento reduzido; em toque não faz nada. Efeito de
 * acabamento: nenhuma tarefa depende dele.
 */
@Directive({ selector: '[appMagnetico]' })
export class Magnetico {
  constructor() {
    const elemento = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const movimento = inject(MovimentoConfig);
    const destruir = inject(DestroyRef);

    // A biblioteca chega depois de um `import()`: se a vista já saiu de cena, não registra nada.
    let destruido = false;
    destruir.onDestroy(() => (destruido = true));

    afterNextRender(async () => {
      if (!movimento.ponteiroFino) return;
      const biblioteca = await movimento.carregar();
      if (!biblioteca || destruido) return;

      const { animate } = biblioteca;
      const seguir = (evento: PointerEvent) => {
        const caixa = elemento.getBoundingClientRect();
        const x = (evento.clientX - caixa.left - caixa.width / 2) * FORCA;
        const y = (evento.clientY - caixa.top - caixa.height / 2) * FORCA;
        animate(elemento, { x, y }, MOLAS.agil);
      };
      const soltar = () => animate(elemento, { x: 0, y: 0 }, MOLAS.suave);

      elemento.addEventListener('pointermove', seguir);
      elemento.addEventListener('pointerleave', soltar);
      destruir.onDestroy(() => {
        elemento.removeEventListener('pointermove', seguir);
        elemento.removeEventListener('pointerleave', soltar);
      });
    });
  }
}
