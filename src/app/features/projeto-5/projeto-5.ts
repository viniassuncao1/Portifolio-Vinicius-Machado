import { Component, computed, input } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { PaginasDaSecao } from '../../shared/paginas-da-secao/paginas-da-secao';
import { CONTEUDOS_PROJETO_5 } from './projeto-5.conteudo';

// O h1 da página vem da casca. A página chega pelo `data` da rota (withComponentInputBinding).
@Component({
  selector: 'app-projeto-5',
  imports: [EditorDeCodigo, PaginasDaSecao],
  template: `
    <app-editor-de-codigo [conteudo]="conteudo()" />
    <app-paginas-da-secao slug="projeto-5" [pagina]="pagina()" [total]="totalDePaginas()" />
  `,
})
export class Projeto5 {
  readonly pagina = input(1);
  readonly totalDePaginas = input(CONTEUDOS_PROJETO_5.length);

  protected readonly conteudo = computed(() => CONTEUDOS_PROJETO_5[this.pagina() - 1]);
}
