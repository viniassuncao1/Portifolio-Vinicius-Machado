import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CONTEUDOS_PROJETO_5 } from './projeto-5.conteudo';
import { Projeto5 } from './projeto-5';

const PALAVRAS_DE_TEXTO_GERADO =
  /\b(robusto|robusta|crucial|fundamental|mergulh\w+|ecossistema)\b/i;

describe('Projeto5', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  async function renderizar(pagina?: number): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Projeto5);
    if (pagina) fixture.componentRef.setInput('pagina', pagina);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  const codigo = (raiz: HTMLElement) => raiz.querySelector('code')?.textContent ?? '';
  const links = (raiz: HTMLElement) =>
    Array.from(raiz.querySelectorAll<HTMLAnchorElement>('code a'), (a) => a.getAttribute('href'));

  it('tem uma página de conteúdo para cada tema', () => {
    expect(CONTEUDOS_PROJETO_5).toHaveLength(4);
  });

  it.each([
    [1, '1/4', 'Este portfólio é o meu estudo de desenvolvimento com IA'],
    [2, '2/4', 'Spec-Driven Development (SDD)'],
    [3, '3/4', 'hackathon Anthropic x Forum Ventures em setembro de 2025'],
    [4, '4/4', 'desenvolvedor brasileiro Evert Junior'],
  ])('página %i mostra o texto e o controle %s', async (pagina, controle, trecho) => {
    const raiz = await renderizar(pagina);

    expect(raiz.querySelector('.javadoc')?.textContent).toContain(trecho);
    expect(raiz.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe(controle);
  });

  it('declara o pacote, a classe EstudoComIA e o record Ferramenta em toda página', async () => {
    for (const pagina of [1, 2, 3, 4]) {
      const texto = codigo(await renderizar(pagina));

      expect(texto).toContain('package dev.vinicius.portfolio.projetos;');
      expect(texto).toContain('public class EstudoComIA {');
      expect(texto).toContain('record Ferramenta(String nome, String papel, String link) {}');
      expect(texto).not.toContain('static final');
    }
  });

  it('liga o repositório, o OpenSpec, o ECC e o Maestri, e a página 1 liga /repositorio', async () => {
    expect(links(await renderizar(1))).toEqual([
      'https://github.com/viniassuncao1/Portifolio-Vinicius-Machado',
      '/repositorio',
    ]);
    expect(links(await renderizar(2))).toEqual([
      'https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/tree/main/openspec',
    ]);
    expect(links(await renderizar(3))).toEqual(['https://github.com/affaan-m/ECC']);
    expect(links(await renderizar(4))).toEqual(['https://www.producthunt.com/products/maestri']);
  });

  it('abre os links externos em nova aba com rel seguro', async () => {
    const externos = (await renderizar(4)).querySelectorAll<HTMLAnchorElement>(
      'code a[href^="http"]',
    );

    expect(externos).toHaveLength(1);
    externos.forEach((a) => {
      expect(a.getAttribute('target')).toBe('_blank');
      expect(a.getAttribute('rel')).toBe('noopener noreferrer');
    });
  });

  it('página 3 lista as skills do ECC usadas, uma por linha', async () => {
    const texto = codigo(await renderizar(3));

    for (const skill of [
      'web-design-guidelines',
      'make-interfaces-feel-better',
      'redesign-existing-projects',
      'accessibility',
      'motion-foundations',
      'motion-patterns',
      'li-human',
    ]) {
      expect(texto).toContain(`"${skill}"`);
    }
  });

  it('página 4 lista a equipe de agentes do Maestri', async () => {
    const texto = codigo(await renderizar(4));

    for (const agente of [
      'Regente',
      'Pincel',
      'Compasso',
      'Sentinela',
      'Escriba',
      'Grafite',
      'Nanquim',
    ]) {
      expect(texto).toContain(`"${agente}"`);
    }
  });

  it('escreve os textos sem travessão, sem caractere invisível e com até 90 palavras', async () => {
    for (const pagina of [1, 2, 3, 4]) {
      const texto = (await renderizar(pagina)).querySelector('.javadoc')?.textContent ?? '';

      expect(texto).not.toMatch(/[—–]/);
      expect(texto).not.toMatch(new RegExp('[\\u200b-\\u200f\\u2060\\ufeff\\u00ad\\u00a0\\u202f]'));
      expect(texto).not.toMatch(PALAVRAS_DE_TEXTO_GERADO);
      expect(texto.trim().split(/\s+/).length).toBeLessThanOrEqual(90);
    }
  });

  it('só a página 1 tem o ▶ Executar na linha da classe (code vision para o GitHub)', async () => {
    expect((await renderizar(1)).querySelectorAll('app-botao-executar')).toHaveLength(1);
    for (const pagina of [2, 3, 4]) {
      expect((await renderizar(pagina)).querySelector('app-botao-executar')).toBeNull();
    }
  });

  it('não tem h1 próprio', async () => {
    expect((await renderizar()).querySelector('h1')).toBeNull();
  });
});
