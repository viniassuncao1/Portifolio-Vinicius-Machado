import { Component, input } from '@angular/core';

import type { ConteudoDoEditor } from './conteudo';

const QUANTIDADE_DE_NUMEROS = 99;

@Component({
  selector: 'app-editor-de-codigo',
  templateUrl: './editor-de-codigo.html',
  styleUrl: './editor-de-codigo.scss',
})
export class EditorDeCodigo {
  readonly conteudo = input.required<ConteudoDoEditor>();

  protected readonly numeros = Array.from({ length: QUANTIDADE_DE_NUMEROS }, (_, i) => i + 1);
}
