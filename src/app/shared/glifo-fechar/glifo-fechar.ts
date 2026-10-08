import { Component } from '@angular/core';

/** "×" fino do Eclipse, decorativo. Herda a cor do texto e o tamanho vem do token. */
@Component({
  selector: 'app-glifo-fechar',
  host: { 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 16 16" focusable="false">
      <path d="M2 2l12 12M14 2L2 14" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-block;
      flex: none;
      width: var(--tamanho-glifo);
      height: var(--tamanho-glifo);
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.1;
    }
  `,
})
export class GlifoFechar {}
