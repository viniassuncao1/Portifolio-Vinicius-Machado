import { Component } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { CONTEUDO_PROJETO_5 } from './projeto-5.conteudo';

// O h1 da página vem da casca; o ▶ da calha (no editor) e a janela de preview são da casca.
@Component({
  selector: 'app-projeto-5',
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
export class Projeto5 {
  protected readonly conteudo = CONTEUDO_PROJETO_5;
}
