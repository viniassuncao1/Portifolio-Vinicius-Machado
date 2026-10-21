import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
  numberAttribute,
} from '@angular/core';

import { MOVIMENTO } from '../../core/movimento/movimento.tokens';
import { MovimentoConfig } from '../../core/movimento/movimento-config';

/**
 * Conta de 0 até o valor quando o número entra na janela. O texto do HTML já é o valor final; a
 * contagem só roda com movimento e só em números ainda fora da janela, de modo que sem JavaScript,
 * com movimento reduzido e para leitores de tela o número certo está sempre ali.
 */
@Directive({ selector: '[appContador]' })
export class Contador {
  /** Valor final. */
  readonly valor = input.required<number, unknown>({
    alias: 'appContador',
    transform: numberAttribute,
  });

  constructor() {
    const elemento = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const movimento = inject(MovimentoConfig);
    const destruir = inject(DestroyRef);

    // A biblioteca chega depois de um `import()`: se a vista já saiu de cena, não registra nada.
    let destruido = false;
    destruir.onDestroy(() => (destruido = true));

    afterNextRender(async () => {
      if (elemento.getBoundingClientRect().top < globalThis.innerHeight) return;
      const biblioteca = await movimento.carregar();
      if (!biblioteca || destruido) return;

      const { animate, inView } = biblioteca;
      const final: number = this.valor();
      const texto = elemento.textContent;
      const parar = inView(elemento, () => {
        animate<number>(0, final, {
          duration: MOVIMENTO.duracao.longa,
          ease: [...MOVIMENTO.curva.suave],
          onUpdate: (atual: number) => {
            elemento.textContent = String(Math.round(atual));
          },
          onComplete: () => {
            elemento.textContent = texto;
          },
        });
      });
      destruir.onDestroy(parar);
    });
  }
}
