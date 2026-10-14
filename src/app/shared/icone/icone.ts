import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';

/** Ícones do design (`public/icones/*.svg`, no estilo das telas): árvore, abas e barra de ferramentas. */
export const NOMES_DE_ICONE_DO_DESIGN = [
  'design-arquivo',
  'design-pasta',
  'design-projeto',
  'design-executar',
  'design-ferramenta',
  'design-ia',
  'design-globo',
  'design-relogio',
  'design-monitor',
] as const;

/**
 * Ícones da IntelliJ Platform (`public/icones/new-ui/`, créditos em `CREDITOS.md`), só onde o design
 * não tem equivalente: o ▶ da calha, a branch, a busca e a faixa de ferramentas.
 */
export const NOMES_DE_ICONE_DA_INTELLIJ = [
  'projeto',
  'commit',
  'estrutura',
  'ramo',
  'executar',
  'buscar',
] as const;

export const NOMES_DE_ICONE = [...NOMES_DE_ICONE_DO_DESIGN, ...NOMES_DE_ICONE_DA_INTELLIJ] as const;

export type NomeDoIcone = (typeof NOMES_DE_ICONE)[number];

const PREFIXO_DO_DESIGN = 'design-';

/** Caminho do SVG: `design-pasta` é `icones/pasta.svg`; os demais são da IntelliJ Platform. */
export const caminhoDoIcone = (nome: NomeDoIcone): string =>
  nome.startsWith(PREFIXO_DO_DESIGN)
    ? `icones/${nome.slice(PREFIXO_DO_DESIGN.length)}.svg`
    : `icones/new-ui/${nome}.svg`;

/** Ícone decorativo: o nome da seção ou do controle ao lado já é o rótulo. */
@Component({
  selector: 'app-icone',
  imports: [NgOptimizedImage],
  template: `<img [ngSrc]="caminho()" alt="" fill />`,
  styles: `
    :host {
      position: relative;
      display: inline-block;
      flex: none;
      width: var(--tamanho-icone);
      height: var(--tamanho-icone);
    }
  `,
})
export class Icone {
  readonly nome = input.required<NomeDoIcone>();
  protected readonly caminho = computed(() => caminhoDoIcone(this.nome()));
}
