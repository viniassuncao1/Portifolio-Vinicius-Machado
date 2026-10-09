import { Component } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { CONTEUDO_SOBRE_MIM } from './sobre-mim.conteudo';

// O h1 da página vem da casca.
@Component({
  selector: 'app-sobre-mim',
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
export class SobreMim {
  protected readonly conteudo = CONTEUDO_SOBRE_MIM;
}
