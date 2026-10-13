import { Component } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { CONTEUDO_PROJETO_1 } from './projeto-1.conteudo';

// O h1 da página vem da casca.
@Component({
  selector: 'app-projeto-1',
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
export class Projeto1 {
  protected readonly conteudo = CONTEUDO_PROJETO_1;
}
