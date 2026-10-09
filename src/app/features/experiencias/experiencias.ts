import { Component, computed, input } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { PaginasDaSecao } from '../../shared/paginas-da-secao/paginas-da-secao';
import { CONTEUDOS_EXPERIENCIAS } from './experiencias.conteudo';

// O h1 da página vem da casca. A página chega pelo `data` da rota (withComponentInputBinding).
@Component({
  selector: 'app-experiencias',
  imports: [EditorDeCodigo, PaginasDaSecao],
  template: `
    <app-editor-de-codigo [conteudo]="conteudo()" />
    <app-paginas-da-secao slug="experiencias" [pagina]="pagina()" [total]="totalDePaginas()" />
  `,
})
export class Experiencias {
  readonly pagina = input(1);
  readonly totalDePaginas = input(CONTEUDOS_EXPERIENCIAS.length);

  protected readonly conteudo = computed(() => CONTEUDOS_EXPERIENCIAS[this.pagina() - 1]);
}
