import { Component } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { CONTEUDO_COMO_USO_IA } from './como-uso-ia.conteudo';

// O h1 da página vem da casca.
@Component({
  selector: 'app-como-uso-ia',
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
export class ComoUsoIa {
  protected readonly conteudo = CONTEUDO_COMO_USO_IA;
}
