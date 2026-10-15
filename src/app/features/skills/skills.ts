import { Component } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { CONTEUDO_SKILLS } from './skills.conteudo';

// O h1 da página vem da casca.
@Component({
  selector: 'app-skills',
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
export class Skills {
  protected readonly conteudo = CONTEUDO_SKILLS;
}
