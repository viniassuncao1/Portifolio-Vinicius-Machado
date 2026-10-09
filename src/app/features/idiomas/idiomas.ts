import { Component } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { CONTEUDO_IDIOMAS } from './idiomas.conteudo';

// O h1 da página vem da casca.
@Component({
  selector: 'app-idiomas',
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
export class Idiomas {
  protected readonly conteudo = CONTEUDO_IDIOMAS;
}
