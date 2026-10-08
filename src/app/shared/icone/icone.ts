import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';

export const NOMES_DE_ICONE = [
  'arquivo',
  'pasta',
  'projeto',
  'executar',
  'ferramenta',
  'ia',
  'globo',
  'relogio',
  'monitor',
] as const;

export type NomeDoIcone = (typeof NOMES_DE_ICONE)[number];

/** Ícone decorativo: o nome da seção ou do controle ao lado já é o rótulo. */
@Component({
  selector: 'app-icone',
  imports: [NgOptimizedImage],
  template: `<img [ngSrc]="'icones/' + nome() + '.svg'" alt="" fill />`,
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
}
