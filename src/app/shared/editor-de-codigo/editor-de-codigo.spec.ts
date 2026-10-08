import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { comum, declaracao, linha, literal, paragrafo, vazia } from './conteudo';
import type { ConteudoDoEditor } from './conteudo';
import { EditorDeCodigo } from './editor-de-codigo';

const CONTEUDO: ConteudoDoEditor = [
  vazia(),
  linha(1, declaracao('String cargo'), comum(' = '), literal('"Full Stack"'), comum(';')),
  paragrafo(0, 'Texto de um parágrafo.'),
];

@Component({
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
class Hospedeiro {
  conteudo = CONTEUDO;
}

describe('EditorDeCodigo', () => {
  function renderizar(): HTMLElement {
    const fixture = TestBed.createComponent(Hospedeiro);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renderiza uma linha por item e um trecho por papel', () => {
    const raiz = renderizar();

    expect(raiz.querySelectorAll('code > span')).toHaveLength(3);
    expect(raiz.querySelector('.papel-declaracao')?.textContent).toBe('String cargo');
    expect(raiz.querySelector('.papel-literal')?.textContent).toBe('"Full Stack"');
  });

  it('exibe o parágrafo em bloco de comentário', () => {
    expect(renderizar().querySelector('.paragrafo')?.textContent).toBe('Texto de um parágrafo.');
  });

  it('esconde a coluna de números das tecnologias assistivas', () => {
    const numeros = renderizar().querySelector('.numeros');

    expect(numeros?.getAttribute('aria-hidden')).toBe('true');
    expect(numeros?.children).toHaveLength(99);
    expect(numeros?.firstElementChild?.textContent).toBe('1');
  });

  it('mantém o texto do código sem os números', () => {
    expect(renderizar().querySelector('code')?.textContent).toBe(
      'String cargo = "Full Stack";Texto de um parágrafo.',
    );
  });
});
