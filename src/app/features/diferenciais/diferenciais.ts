import { Component } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { CONTEUDO_DIFERENCIAIS } from './diferenciais.conteudo';

// O h1 da página vem da casca.
@Component({
  selector: 'app-diferenciais',
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
export class Diferenciais {
  protected readonly conteudo = CONTEUDO_DIFERENCIAIS;
}
