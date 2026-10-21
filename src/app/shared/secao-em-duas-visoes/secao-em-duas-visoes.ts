import { NgTemplateOutlet } from '@angular/common';
import { Component, TemplateRef, contentChild, inject, input } from '@angular/core';

import { VisaoDoConteudoEscolhida } from '../../core/visao-do-conteudo';
import type { ConteudoDoEditor } from '../editor-de-codigo/conteudo';
import { EditorDeCodigo } from '../editor-de-codigo/editor-de-codigo';
import { AlternarVisao } from '../alternar-visao/alternar-visao';
import { TemaDeSecao } from '../movimento/tema-de-secao';
import type { NomeDaSecaoTematica } from '../movimento/tema-de-secao';

/**
 * Uma seção em duas visões do mesmo conteúdo (ADR-0019): o cartão (padrão, que se lê em segundos,
 * com o tema de cor da seção) e o arquivo Java no editor. O cartão vem como `<ng-template #cartao>`,
 * para só ser criado quando a visão em cartão está ativa. O h1 da página vem da casca.
 */
@Component({
  selector: 'app-secao-em-duas-visoes',
  imports: [AlternarVisao, EditorDeCodigo, NgTemplateOutlet, TemaDeSecao],
  template: `
    @if (visao.visao() === 'cartao') {
      <div class="cartao-da-secao" [appTemaDeSecao]="tema()">
        <div class="barra"><app-alternar-visao /></div>
        <div class="coluna">
          <ng-container [ngTemplateOutlet]="cartao()" />
        </div>
      </div>
    } @else {
      <div class="troca"><app-alternar-visao /></div>
      <app-editor-de-codigo [conteudo]="conteudo()" />
      @if (extraDoCodigo(); as extra) {
        <ng-container [ngTemplateOutlet]="extra" />
      }
    }
  `,
  styleUrl: './secao-em-duas-visoes.scss',
})
export class SecaoEmDuasVisoes {
  protected readonly visao = inject(VisaoDoConteudoEscolhida);
  readonly conteudo = input.required<ConteudoDoEditor>();
  readonly tema = input.required<NomeDaSecaoTematica>();
  protected readonly cartao = contentChild.required<TemplateRef<unknown>>('cartao');
  /** Algo que só a visão em código mostra depois do editor (por exemplo, o botão de copiar). */
  protected readonly extraDoCodigo = contentChild<TemplateRef<unknown>>('extraDoCodigo');
}
