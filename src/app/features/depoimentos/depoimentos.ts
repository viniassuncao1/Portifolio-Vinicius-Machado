import { Component } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { CONTEUDO_DEPOIMENTOS } from './depoimentos.conteudo';

// O h1 da página vem da casca.
@Component({
  selector: 'app-depoimentos',
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
export class Depoimentos {
  protected readonly conteudo = CONTEUDO_DEPOIMENTOS;
}
