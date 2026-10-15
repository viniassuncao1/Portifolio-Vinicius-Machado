import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';

import { Icone } from '../icone/icone';
import { LADO_DO_RETRATO, paragrafosDoJavadoc } from './conteudo';
import type { LinhaDeJavadoc } from './conteudo';
import { ModoDeLeitura } from './modo-de-leitura';

/**
 * Um bloco de Javadoc do editor, no modo cru (abertura, coluna de asteriscos e fechamento) ou no de leitura (a
 * "Rendered View" do IntelliJ). O DOM é o mesmo nos dois modos, então o texto copiado e lido é igual.
 * Tem o retrato opcional, o `@author` com link externo e, no primeiro bloco de cada sequência, o botão
 * da calha que alterna o modo. O `data-indice`, a digitação e a linha atual são do editor.
 */
@Component({
  selector: 'app-javadoc-do-editor',
  imports: [Icone, NgOptimizedImage],
  templateUrl: './javadoc-do-editor.html',
  styleUrl: './javadoc-do-editor.scss',
  host: { '[attr.data-modo]': "leitura.ativo() ? 'leitura' : 'cru'" },
})
export class JavadocDoEditor {
  protected readonly leitura = inject(ModoDeLeitura);
  protected readonly ladoDoRetrato = LADO_DO_RETRATO;

  readonly item = input.required<LinhaDeJavadoc>();
  /** Mostra o botão da calha que alterna o modo de leitura. */
  readonly comBotao = input(false);

  protected readonly paragrafos = computed(() => paragrafosDoJavadoc(this.item().texto));
}
