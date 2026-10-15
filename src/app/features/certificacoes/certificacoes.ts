import { Component } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { CONTEUDO_CERTIFICACOES } from './certificacoes.conteudo';

// O h1 da página vem da casca.
@Component({
  selector: 'app-certificacoes',
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
export class Certificacoes {
  protected readonly conteudo = CONTEUDO_CERTIFICACOES;
}
