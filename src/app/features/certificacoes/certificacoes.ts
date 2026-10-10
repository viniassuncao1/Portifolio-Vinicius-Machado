import { Component, computed, input } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { PaginasDaSecao } from '../../shared/paginas-da-secao/paginas-da-secao';
import { CONTEUDOS_CERTIFICACOES } from './certificacoes.conteudo';

// O h1 da página vem da casca. A página chega pelo `data` da rota (withComponentInputBinding).
@Component({
  selector: 'app-certificacoes',
  imports: [EditorDeCodigo, PaginasDaSecao],
  template: `
    <app-editor-de-codigo [conteudo]="conteudo()" />
    <app-paginas-da-secao slug="certificacoes" [pagina]="pagina()" [total]="totalDePaginas()" />
  `,
})
export class Certificacoes {
  readonly pagina = input(1);
  readonly totalDePaginas = input(CONTEUDOS_CERTIFICACOES.length);

  protected readonly conteudo = computed(() => CONTEUDOS_CERTIFICACOES[this.pagina() - 1]);
}
