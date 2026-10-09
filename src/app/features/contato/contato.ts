import { Component } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { CONTEUDO_CONTATO } from './contato.conteudo';

// O h1 da página vem da casca.
@Component({
  selector: 'app-contato',
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
export class Contato {
  protected readonly conteudo = CONTEUDO_CONTATO;
}
