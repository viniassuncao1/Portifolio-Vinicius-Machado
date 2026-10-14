import { TestBed } from '@angular/core/testing';

import { paragrafosDoJavadoc } from '../../shared/editor-de-codigo/conteudo';
import { Depoimentos } from './depoimentos';
import { CONTEUDO_DEPOIMENTOS } from './depoimentos.conteudo';

/** Texto da recomendação de Luana Porto, um item por parágrafo, como foi escrito no LinkedIn. */
const PARAGRAFOS = [
  'Tive a oportunidade de trabalhar com o Vinícius e acompanhar de perto seu trabalho no dia a dia. É um profissional muito comprometido, responsável e colaborativo, sempre disposto a ajudar o time e contribuir para que as entregas aconteçam da melhor forma possível.',
  'Além da parte técnica, se destaca pela facilidade de comunicação, organização e pela forma como lida com desafios e aprende novas tecnologias. É uma pessoa em quem o time pode confiar e que agrega muito ao ambiente de trabalho.',
  'Recomendo o Vinícius com muita tranquilidade e tenho certeza de que será uma ótima adição a qualquer equipe.',
];

describe('Depoimentos', () => {
  async function renderizar(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Depoimentos);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  const codigo = async (): Promise<string> =>
    (await renderizar()).querySelector('code')?.textContent ?? '';

  const normalizar = (texto: string | null | undefined): string =>
    (texto ?? '').replace(/\s+/g, ' ').trim();

  it('mostra a recomendação real de Luana Porto', async () => {
    const texto = await codigo();

    expect(texto).toContain('Luana Porto');
    expect(texto).toContain('Desenvolvedor Backend Java');
    expect(texto).toContain('LocalDate.of(2026, 9, 22)');
    expect(texto).toContain('Recomendo o Vinícius com muita tranquilidade');
  });

  it('mostra autora, cargo e relação como textos entre aspas, na ordem do record', async () => {
    const raiz = await renderizar();
    const literais = Array.from(raiz.querySelectorAll('.papel-literal'), (l) => l.textContent);

    expect(literais).toEqual([
      '"Luana Porto"',
      '"Desenvolvedor Backend Java"',
      '"Trabalhou na mesma equipe"',
    ]);
  });

  it('mostra a data 22/09/2026 como LocalDate.of(2026, 9, 22), com os números em cor de valor', async () => {
    const raiz = await renderizar();
    const valores = Array.from(raiz.querySelectorAll('.papel-valor'), (v) => v.textContent);

    expect(valores).toEqual(['2026', '9', '22']);
  });

  it('declara o record com autor, cargo, relação e data', async () => {
    const texto = await codigo();

    expect(texto).toContain(
      'record Recomendacao(String autora, String cargo, String relacao, LocalDate data)',
    );
  });

  it('mostra os três parágrafos completos num único Javadoc', async () => {
    const raiz = await renderizar();
    const blocos = raiz.querySelectorAll('.javadoc');
    const paragrafos = Array.from(blocos[0].querySelectorAll('.javadoc-paragrafo'), (p) =>
      normalizar(p.textContent),
    );

    expect(blocos).toHaveLength(1);
    expect(paragrafos).toEqual(PARAGRAFOS);
  });

  it('o conteúdo tem um só item de Javadoc, com os três parágrafos', () => {
    const javadocs = CONTEUDO_DEPOIMENTOS.filter((item) => item.tipo === 'javadoc');

    expect(javadocs).toHaveLength(1);
    expect(paragrafosDoJavadoc(javadocs[0].texto)).toEqual(PARAGRAFOS);
  });

  it('não mostra conteúdo de exemplo', async () => {
    const raiz = await renderizar();

    expect(raiz.textContent).not.toMatch(/lorem|ipsum|dolor sit amet/i);
  });

  it('lista as recomendações em todas e não usa static final', async () => {
    const texto = await codigo();

    expect(texto).toContain('package dev.vinicius.portfolio.recomendacoes;');
    expect(texto).toContain('List<Recomendacao> todas = List.of(luana);');
    expect(texto).not.toContain('static final');
  });

  it('acrescentar uma recomendação é só uma entrada: cada `new Recomendacao` entra em todas', async () => {
    const texto = await codigo();
    const criadas = texto.match(/new Recomendacao\(/g) ?? [];
    const lista = /todas = List\.of\(([^)]*)\)/.exec(texto)?.[1] ?? '';
    const itens = lista.split(',').filter((item) => item.trim());

    expect(criadas.length).toBeGreaterThan(0);
    expect(itens).toHaveLength(criadas.length);
  });

  it('não tem h1 próprio (vem da casca)', async () => {
    expect((await renderizar()).querySelector('h1')).toBeNull();
  });
});
