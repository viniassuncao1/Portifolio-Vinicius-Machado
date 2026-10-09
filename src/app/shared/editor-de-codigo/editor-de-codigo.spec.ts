import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  anotacao,
  comum,
  declaracao,
  linha,
  literal,
  palavraChave,
  paragrafo,
  vazia,
} from './conteudo';
import type { ConteudoDoEditor } from './conteudo';
import { EditorDeCodigo } from './editor-de-codigo';

const CONTEUDO: ConteudoDoEditor = [
  vazia(),
  linha(1, declaracao('String cargo'), comum(' = '), literal('"Full Stack"'), comum(';')),
  paragrafo(0, 'Texto de um parágrafo.'),
];

@Component({
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo()" />`,
})
class Hospedeiro {
  readonly conteudo = signal<ConteudoDoEditor>(CONTEUDO);
}

describe('EditorDeCodigo', () => {
  function renderizar(conteudo: ConteudoDoEditor = CONTEUDO): HTMLElement {
    const fixture = TestBed.createComponent(Hospedeiro);
    fixture.componentInstance.conteudo.set(conteudo);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  function estilosDoComponente(): string {
    return Array.from(document.head.querySelectorAll('style'))
      .map((estilo) => estilo.textContent ?? '')
      .join('\n');
  }

  describe('estrutura das linhas', () => {
    it('renderiza uma linha por item do conteúdo', () => {
      const raiz = renderizar();

      expect(raiz.querySelectorAll('code > span')).toHaveLength(3);
    });

    it('renderiza um trecho por papel dentro da linha de código', () => {
      const raiz = renderizar();

      expect(raiz.querySelector('.papel-declaracao')?.textContent).toBe('String cargo');
      expect(raiz.querySelector('.papel-literal')?.textContent).toBe('"Full Stack"');
    });

    it('aplica o recuo da linha de código como variável de estilo', () => {
      const raiz = renderizar([linha(2, comum('x'))]);

      const elemento = raiz.querySelector<HTMLElement>('.linha');

      expect(elemento?.style.getPropertyValue('--recuo')).toBe('2');
    });

    it('aplica o recuo do parágrafo como variável de estilo', () => {
      const raiz = renderizar([paragrafo(3, 'Texto')]);

      const elemento = raiz.querySelector<HTMLElement>('.paragrafo');

      expect(elemento?.style.getPropertyValue('--recuo')).toBe('3');
    });

    it('exibe o parágrafo em bloco de comentário', () => {
      const raiz = renderizar();

      expect(raiz.querySelector('.paragrafo')?.textContent).toBe('Texto de um parágrafo.');
    });

    it('exibe a linha vazia sem texto e sem trechos', () => {
      const raiz = renderizar([vazia()]);

      const elemento = raiz.querySelector('code > span');

      expect(elemento?.classList.contains('vazia')).toBe(true);
      expect(elemento?.textContent).toBe('');
      expect(elemento?.children).toHaveLength(0);
    });

    it('atualiza as linhas quando o conteúdo muda', () => {
      const fixture = TestBed.createComponent(Hospedeiro);
      fixture.detectChanges();

      fixture.componentInstance.conteudo.set([linha(0, comum('novo'))]);
      fixture.detectChanges();

      const raiz = fixture.nativeElement as HTMLElement;
      expect(raiz.querySelectorAll('code > span')).toHaveLength(1);
      expect(raiz.querySelector('code')?.textContent).toBe('novo');
    });
  });

  describe('cores de sintaxe por papel', () => {
    it.each([
      ['palavra-chave', palavraChave('public')],
      ['declaracao', declaracao('String cargo')],
      ['literal', literal('"Spring Boot"')],
      ['anotacao', anotacao('@Override')],
      ['comum', comum(' = ')],
    ])('aplica a classe papel-%s ao trecho', (papel, trecho) => {
      const raiz = renderizar([linha(0, trecho)]);

      const elemento = raiz.querySelector(`.linha > .papel-${papel}`);

      expect(elemento?.textContent).toBe(trecho.texto);
    });

    it('usa uma classe de papel diferente para cada trecho da linha', () => {
      const raiz = renderizar([linha(0, anotacao('@Override'), comum(' '), palavraChave('void'))]);

      const classes = Array.from(raiz.querySelectorAll('.linha > span')).map((s) => s.className);

      expect(classes).toEqual(['papel-anotacao', 'papel-comum', 'papel-palavra-chave']);
    });

    it.each([
      ['papel-palavra-chave', '--cor-sintaxe-palavra-chave'],
      ['papel-declaracao', '--cor-sintaxe-campo'],
      ['papel-literal', '--cor-sintaxe-literal'],
      ['papel-anotacao', '--cor-sintaxe-anotacao'],
      ['papel-comum', '--cor-sintaxe-texto'],
    ])('a classe %s usa o token %s', (classe, token) => {
      renderizar();

      const regra = new RegExp(`\\.${classe}[^{]*\\{[^}]*color:\\s*var\\(${token}\\)`);

      expect(estilosDoComponente()).toMatch(regra);
    });
  });

  describe('numeração de linhas', () => {
    it('esconde a coluna de números das tecnologias assistivas', () => {
      const numeros = renderizar().querySelector('.numeros');

      expect(numeros?.getAttribute('aria-hidden')).toBe('true');
    });

    it('exibe os números de 1 a 99 em ordem', () => {
      const numeros = renderizar().querySelectorAll('.numeros > span');

      expect(numeros).toHaveLength(99);
      expect(numeros[0].textContent).toBe('1');
      expect(numeros[14].textContent).toBe('15');
      expect(numeros[98].textContent).toBe('99');
    });

    it('mantém os 99 números mesmo com conteúdo curto', () => {
      const numeros = renderizar([vazia()]).querySelectorAll('.numeros > span');

      expect(numeros).toHaveLength(99);
    });

    it('reserva a área mínima de 15 linhas pelo estilo do host', () => {
      renderizar();

      expect(estilosDoComponente()).toMatch(
        /min-height:\s*calc\(\s*var\(--linhas-minimas-editor\)\s*\*\s*var\(--altura-linha-codigo\)\s*\)/,
      );
    });

    it('recorta a coluna de números pela altura do código', () => {
      renderizar();

      expect(estilosDoComponente()).toMatch(/\.numeros[^{]*\{[^}]*overflow:\s*hidden/);
    });
  });

  describe('leitura e seleção', () => {
    it('mantém o texto do código sem os números', () => {
      const texto = renderizar().querySelector('code')?.textContent;

      expect(texto).toBe('String cargo = "Full Stack";Texto de um parágrafo.');
      expect(texto).not.toMatch(/\d/);
    });

    it('mantém os marcadores "*" fora do texto do código', () => {
      const raiz = renderizar([paragrafo(0, 'Primeira frase longa do parágrafo.')]);

      expect(raiz.querySelector('code')?.textContent).not.toContain('*');
    });

    it('gera os marcadores "*" por pseudo-elemento com texto alternativo vazio', () => {
      renderizar();

      expect(estilosDoComponente()).toMatch(/content:\s*["'][^;]*\*[^;]*["']\s*\/\s*["']{2}/);
    });

    it('exibe o texto de um trecho como texto comum selecionável dentro do code', () => {
      const raiz = renderizar([linha(0, literal('"Spring Boot"'))]);

      const trecho = raiz.querySelector('code .papel-literal');

      expect(trecho?.firstChild?.nodeType).toBe(Node.TEXT_NODE);
      expect(trecho?.textContent).toBe('"Spring Boot"');
      expect(trecho?.closest('code')).not.toBeNull();
    });

    it('não desliga a seleção do texto do código', () => {
      renderizar();

      const regras = Array.from(estilosDoComponente().matchAll(/([^{}]+)\{([^}]*)\}/g));
      const desligam = regras
        .filter(
          ([, seletor, corpo]) => !seletor.includes('::') && /user-select:\s*none/.test(corpo),
        )
        .map(([, seletor]) => seletor.trim());

      expect(desligam.every((seletor) => seletor.startsWith('.numeros'))).toBe(true);
    });
  });
});
