import { Component, computed, input } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { PaginasDaSecao } from '../../shared/paginas-da-secao/paginas-da-secao';
import { CONTEUDOS_SKILLS } from './skills.conteudo';

// O h1 da página vem da casca. A página chega pelo `data` da rota (withComponentInputBinding).
@Component({
  selector: 'app-skills',
  imports: [EditorDeCodigo, PaginasDaSecao],
  template: `
    <app-editor-de-codigo [conteudo]="conteudo()" />
    <app-paginas-da-secao slug="skills" [pagina]="pagina()" [total]="totalDePaginas()" />
  `,
})
export class Skills {
  readonly pagina = input(1);
  readonly totalDePaginas = input(CONTEUDOS_SKILLS.length);

  protected readonly conteudo = computed(() => CONTEUDOS_SKILLS[this.pagina() - 1]);
}
