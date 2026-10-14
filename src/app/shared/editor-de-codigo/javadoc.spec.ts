import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { comum, javadoc, linha, paragrafo, paragrafosDoJavadoc } from './conteudo';
import type { ConteudoDoEditor } from './conteudo';
import { EditorDeCodigo } from './editor-de-codigo';

const TEXTO = 'Mora em Brasília há 20 anos e gosta de testar, aprender e encarar o que aparecer.';

@Component({
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
class Hospedeiro {
  readonly conteudo: ConteudoDoEditor = [
    javadoc(1, TEXTO),
    linha(1, comum('record Dados() {}')),
    paragrafo(0, 'Parágrafo antigo.'),
  ];
}

describe('javadoc', () => {
  it('cria uma linha do tipo javadoc com recuo e texto', () => {
    expect(javadoc(2, 'Texto')).toEqual({ tipo: 'javadoc', recuo: 2, texto: 'Texto' });
  });

  describe('no editor', () => {
    function renderizar(): HTMLElement {
      const fixture = TestBed.createComponent(Hospedeiro);
      document.body.append(fixture.nativeElement);
      fixture.detectChanges();
      TestBed.tick();
      return fixture.nativeElement as HTMLElement;
    }

    const bloco = (raiz: HTMLElement) => raiz.querySelector<HTMLElement>('.javadoc')!;

    it('expõe só o texto: `/**`, `*` e `*/` não entram no DOM', () => {
      const raiz = renderizar();

      expect(bloco(raiz).textContent).toBe(TEXTO);
      expect(bloco(raiz).textContent).not.toContain('*');
    });

    // O navegador de teste não calcula pseudo-elementos: confere-se o CSS do componente.
    function estilos(): string {
      return Array.from(document.head.querySelectorAll('style'))
        .map((estilo) => estilo.textContent ?? '')
        .join('\n');
    }

    function regra(seletor: string): string {
      const [base, pseudo = ''] = seletor.split('::');
      const molde = `${base.replaceAll('.', '\\.')}\\[[^\\]]*\\]${pseudo ? `::${pseudo}` : ''}\\s*\\{([^}]*)\\}`;
      return Array.from(estilos().matchAll(new RegExp(molde, 'g')), (achada) => achada[1]).join(
        '\n',
      );
    }

    it('desenha `/**` e `*/` por pseudo-elementos sem texto alternativo', () => {
      renderizar();

      expect(regra('.javadoc::before')).toMatch(/content:\s*"\/"\s+"\*"\s+"\*"\s*\/\s*""/);
      expect(regra('.javadoc::after')).toMatch(/content:\s*"\*"\s+"\/"\s*\/\s*""/);
    });

    it('põe a coluna de `*` fora do texto, uma coluna à direita do `/`', () => {
      renderizar();
      const marcadores = regra('.javadoc-texto::before');

      expect(marcadores).toContain('position: absolute');
      expect(marcadores).toMatch(/inset-inline-start:\s*var\(--avanco\)/);
      expect(regra('.javadoc::after')).toMatch(/padding-inline-start:\s*var\(--avanco\)/);
    });

    it('começa o texto três colunas depois do recuo, alinhado sob o ` * `', () => {
      renderizar();

      expect(regra('.javadoc-texto')).toMatch(
        /padding-inline-start:\s*calc\(3 \* var\(--avanco\)\)/,
      );
    });

    it('usa a cor de comentário e a mesma largura de 72 colunas do parágrafo', () => {
      renderizar();
      const corpo = regra('.javadoc');

      expect(corpo).toContain('var(--cor-sintaxe-comentario)');
      expect(regra('.javadoc-corpo')).toMatch(
        /max-inline-size:\s*calc\(var\(--colunas-paragrafo\) \* var\(--avanco\)\)/,
      );
    });

    it('permite destacar o bloco como linha atual ao clicar', () => {
      const raiz = renderizar();

      // O primeiro clique completa a digitação da primeira visita; o segundo move o destaque.
      bloco(raiz).click();
      bloco(raiz).click();
      TestBed.tick();

      expect(bloco(raiz).classList).toContain('atual');
    });

    it('mantém o parágrafo antigo funcionando', () => {
      const raiz = renderizar();

      expect(raiz.querySelector('.paragrafo')?.textContent).toBe('Parágrafo antigo.');
    });
  });

  describe('com parágrafos', () => {
    const DOIS = 'Primeiro parágrafo.\n\nSegundo parágrafo.';

    it('mantém um único bloco javadoc e um trecho por parágrafo', () => {
      const fixture = TestBed.createComponent(EditorDeCodigo);
      fixture.componentRef.setInput('conteudo', [javadoc(0, DOIS), linha(0, comum('int x;'))]);
      fixture.detectChanges();
      const raiz = fixture.nativeElement as HTMLElement;

      const paragrafos = raiz.querySelectorAll('.javadoc .javadoc-paragrafo');

      expect(raiz.querySelectorAll('.javadoc')).toHaveLength(1);
      expect(Array.from(paragrafos, (p) => p.textContent?.trim())).toEqual([
        'Primeiro parágrafo.',
        'Segundo parágrafo.',
      ]);
    });

    it('preserva a quebra no texto copiável com um espaço entre os parágrafos', () => {
      const fixture = TestBed.createComponent(EditorDeCodigo);
      fixture.componentRef.setInput('conteudo', [javadoc(0, DOIS)]);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.javadoc').textContent).toBe(
        'Primeiro parágrafo. Segundo parágrafo.',
      );
    });

    it('separa parágrafos por uma linha de altura inteira', () => {
      const fixture = TestBed.createComponent(EditorDeCodigo);
      fixture.componentRef.setInput('conteudo', [javadoc(0, DOIS)]);
      fixture.detectChanges();
      const css = Array.from(document.head.querySelectorAll('style'))
        .map((estilo) => estilo.textContent ?? '')
        .join('\n');

      expect(css).toMatch(
        /\.javadoc-paragrafo[^{]*\+[^{]*\{[^}]*margin-block-start:\s*var\(--altura-linha-comentario\)/,
      );
    });

    it('ignora linhas em branco sobrando e texto sem parágrafos continua igual', () => {
      expect(paragrafosDoJavadoc('\n\nA\n\n\n\nB\n\n')).toEqual(['A', 'B']);
      expect(paragrafosDoJavadoc(TEXTO)).toEqual([TEXTO]);
    });
  });
});
