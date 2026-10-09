import { Component } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { CONTEUDO_FORMACAO } from './formacao.conteudo';

// O h1 da página vem da casca.
@Component({
  selector: 'app-formacao',
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
export class Formacao {
  protected readonly conteudo = CONTEUDO_FORMACAO;
}
