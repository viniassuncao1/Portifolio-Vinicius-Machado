import { Component } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { CONTEUDO_PROJETO_4 } from './projeto-4.conteudo';

// O h1 da página vem da casca.
@Component({
  selector: 'app-projeto-4',
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
export class Projeto4 {
  protected readonly conteudo = CONTEUDO_PROJETO_4;
}
