import { Component } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { CONTEUDO_INICIO } from './inicio.conteudo';

// O h1 da página vem da casca.
@Component({
  selector: 'app-inicio',
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
export class Inicio {
  protected readonly conteudo = CONTEUDO_INICIO;
}
