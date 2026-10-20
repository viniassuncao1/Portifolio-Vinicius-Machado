import { Component } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { CONTEUDO_PROJETO_3 } from './projeto-3.conteudo';

// O h1 da página vem da casca; o ▶ da calha (no editor) leva ao repositório no GitHub.
@Component({
  selector: 'app-projeto-3',
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
export class Projeto3 {
  protected readonly conteudo = CONTEUDO_PROJETO_3;
}
