import { Component } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { CONTEUDO_EVENTOS } from './eventos.conteudo';

// O h1 da página vem da casca.
@Component({
  selector: 'app-eventos',
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
export class Eventos {
  protected readonly conteudo = CONTEUDO_EVENTOS;
}
