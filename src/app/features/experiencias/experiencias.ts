import { Component } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { CONTEUDO_EXPERIENCIAS } from './experiencias.conteudo';

// O h1 da página vem da casca.
@Component({
  selector: 'app-experiencias',
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
export class Experiencias {
  protected readonly conteudo = CONTEUDO_EXPERIENCIAS;
}
