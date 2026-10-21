import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

import { MOLAS } from '../../core/movimento/movimento.tokens';
import { MovimentoConfig } from '../../core/movimento/movimento-config';

/**
 * O elemento se desloca devagar, no sentido oposto ao do ponteiro, enquanto ele passa pela janela:
 * profundidade sem tocar no layout (só `transform`). `appParallax` é a distância máxima em px.
 * Só com mouse ou trackpad e sem movimento reduzido.
 */
@Directive({ selector: '[appParallax]' })
export class Parallax {
  readonly intensidade = input(12, { alias: 'appParallax', transform: numeroOuPadrao });

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
      const mover = (evento: PointerEvent) => {
        const x = (evento.clientX / globalThis.innerWidth - 0.5) * 2;
        const y = (evento.clientY / globalThis.innerHeight - 0.5) * 2;
        const forca = this.intensidade();
        animate(elemento, { x: -x * forca, y: -y * forca }, MOLAS.suave);
      };
      globalThis.addEventListener('pointermove', mover, { passive: true });
      destruir.onDestroy(() => globalThis.removeEventListener('pointermove', mover));
    });
  }
}

function numeroOuPadrao(valor: number | string | null | undefined): number {
  const numero = Number(valor);
  return Number.isFinite(numero) && numero > 0 ? numero : 12;
}
