import { Component, inject } from '@angular/core';

import { VisaoDoConteudoEscolhida } from '../../core/visao-do-conteudo';
import { AlternarVisao } from '../../shared/alternar-visao/alternar-visao';
import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { CONTEUDO_INICIO } from './inicio.conteudo';
import { VisaoGeral } from './visao-geral';

/**
 * Início em duas visões do mesmo conteúdo: o cartão (padrão, para quem recruta) e o código Java da
 * IDE. O h1 da página vem da casca.
 */
@Component({
  selector: 'app-inicio',
  imports: [AlternarVisao, EditorDeCodigo, VisaoGeral],
  template: `
    @if (visao.visao() === 'cartao') {
      <app-visao-geral />
    } @else {
      <div class="troca"><app-alternar-visao /></div>
      <app-editor-de-codigo [conteudo]="conteudo" />
    }
  `,
  styles: `
    .troca {
      padding: 0 1rem 0.75rem;
    }
  `,
})
export class Inicio {
  protected readonly visao = inject(VisaoDoConteudoEscolhida);
  protected readonly conteudo = CONTEUDO_INICIO;
}
