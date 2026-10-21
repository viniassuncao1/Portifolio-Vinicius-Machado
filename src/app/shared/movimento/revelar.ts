import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

import { MOLAS, MOVIMENTO } from '../../core/movimento/movimento.tokens';
import { MovimentoConfig } from '../../core/movimento/movimento-config';

/**
 * Revela o elemento uma única vez, com leve deslocamento e esmaecimento, quando ele chega perto do
 * fim da janela. O HTML pré-renderizado já é o estado final: o estado inicial só é aplicado depois
 * da hidratação, e só em elementos que ainda estão fora da janela, então o conteúdo da primeira
 * dobra (e o LCP) nunca espera por animação. Sem movimento a biblioteca nem é baixada.
 */
@Directive({ selector: '[appRevelar]' })
export class Revelar {
  /** Atraso em segundos, para escalonar blocos vizinhos. */
  readonly atraso = input(0, { alias: 'appRevelar', transform: numeroOuZero });

  constructor() {
    const elemento = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const movimento = inject(MovimentoConfig);
    const destruir = inject(DestroyRef);

    // A biblioteca chega depois de um `import()`: se a vista já saiu de cena, não registra nada.
    let destruido = false;
    destruir.onDestroy(() => (destruido = true));

    afterNextRender(async () => {
      if (jaVisivel(elemento)) return;
      const biblioteca = await movimento.carregar();
      if (!biblioteca || destruido) return;

      const { animate, inView } = biblioteca;
      elemento.style.opacity = '0';
      const parar = inView(
        elemento,
        () => {
          animate(
            elemento,
            { opacity: 1, transform: [`translateY(${MOVIMENTO.distancia.md}px)`, 'none'] },
            { ...MOLAS.suave, delay: this.atraso() },
          );
        },
        { margin: '0px 0px -10% 0px' },
      );
      destruir.onDestroy(() => {
        parar();
        elemento.style.removeProperty('opacity');
      });
    });
  }
}

function numeroOuZero(valor: number | string | null | undefined): number {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : 0;
}

function jaVisivel(elemento: HTMLElement): boolean {
  return elemento.getBoundingClientRect().top < globalThis.innerHeight;
}
