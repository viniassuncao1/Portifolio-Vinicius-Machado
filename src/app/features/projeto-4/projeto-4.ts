import { Component, computed, input } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { PaginasDaSecao } from '../../shared/paginas-da-secao/paginas-da-secao';
import { CONTEUDOS_PROJETO_4 } from './projeto-4.conteudo';

// O h1 da página vem da casca. A página chega pelo `data` da rota (withComponentInputBinding).
@Component({
  selector: 'app-projeto-4',
  imports: [EditorDeCodigo, PaginasDaSecao],
  template: `
    <app-editor-de-codigo [conteudo]="conteudo()" />
    <app-paginas-da-secao slug="projeto-4" [pagina]="pagina()" [total]="totalDePaginas()" />
  `,
})
export class Projeto4 {
  readonly pagina = input(1);
  readonly totalDePaginas = input(CONTEUDOS_PROJETO_4.length);

  protected readonly conteudo = computed(() => CONTEUDOS_PROJETO_4[this.pagina() - 1]);
}
