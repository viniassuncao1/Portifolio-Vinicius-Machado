import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';

export const NOMES_DE_ICONE = [
  'projeto',
  'commit',
  'estrutura',
  'ramo',
  'executar',
  'depurar',
  'buscar',
  'configuracoes',
  'seta-para-baixo',
  'fechar',
  'pasta',
  'pacote',
  'classe',
  'interface',
  'registro',
  'enumeracao',
  'java',
] as const;

export type NomeDoIcone = (typeof NOMES_DE_ICONE)[number];

/** Ícone da New UI da IntelliJ Platform (créditos em `public/icones/new-ui/CREDITOS.md`), decorativo: o nome da seção ou do controle ao lado já é o rótulo. */
@Component({
  selector: 'app-icone',
  imports: [NgOptimizedImage],
  template: `<img [ngSrc]="'icones/new-ui/' + pasta() + nome() + '.svg'" alt="" fill />`,
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
  /** A clara serve sobre fundos claros, como o degradê da barra de ferramentas. */
  readonly variante = input<'escura' | 'clara'>('escura');
  protected readonly pasta = computed(() => (this.variante() === 'clara' ? 'claro/' : ''));
}
