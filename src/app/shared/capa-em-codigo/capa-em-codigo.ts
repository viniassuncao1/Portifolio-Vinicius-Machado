import { Component, input } from '@angular/core';

import type { CapaEmCodigo } from '../../core/projetos';

/**
 * Capa dos projetos sem captura de tela: a classe e um trecho em Java no estilo do editor, em vez
 * de uma imagem. É decorativa (o cartão já tem o nome do projeto), então some para leitores de tela.
 */
@Component({
  selector: 'app-capa-em-codigo',
  host: { 'aria-hidden': 'true' },
  template: `
    <p class="linha"><span class="palavra">public class</span> {{ capa().classe }} {{ '{' }}</p>
    @for (linha of capa().linhas; track $index) {
      <p class="linha recuo">{{ linha }}</p>
    }
    <p class="linha">{{ '}' }}</p>
  `,
  styleUrl: './capa-em-codigo.scss',
})
export class CapaEmCodigoDoProjeto {
  readonly capa = input.required<CapaEmCodigo>();
}
