import { Component } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { CONTEUDO_PROJETO_2 } from './projeto-2.conteudo';

// O h1 da página vem da casca; o ▶ da calha (no editor) e a janela de preview são da casca.
@Component({
  selector: 'app-projeto-2',
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
export class Projeto2 {
  protected readonly conteudo = CONTEUDO_PROJETO_2;
}
