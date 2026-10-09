import { Component } from '@angular/core';

import { GlifoFechar } from '../../shared/glifo-fechar/glifo-fechar';
import { Icone } from '../../shared/icone/icone';

/** Aba "Portfolio_Vinicius" sobre o editor. Decorativa: o título da página é o h1 da casca. */
@Component({
  selector: 'app-aba-do-editor',
  imports: [Icone, GlifoFechar],
  host: { 'aria-hidden': 'true' },
  template: `
    <div class="aba">
      <app-icone nome="executar" />
      <span class="titulo">Portfolio_Vinicius</span>
      <app-glifo-fechar class="fechar" />
    </div>
  `,
  styleUrl: './aba-do-editor.scss',
})
export class AbaDoEditor {}
