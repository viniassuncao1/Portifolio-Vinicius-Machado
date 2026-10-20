import { TestBed } from '@angular/core/testing';

import { Projeto2 } from './projeto-2';

const PALAVRAS_DE_TEXTO_GERADO =
  /\b(robusto|robusta|crucial|fundamental|mergulh\w+|ecossistema)\b/i;

describe('Projeto2', () => {
  async function renderizar(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Projeto2);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  const codigo = (raiz: HTMLElement) => raiz.querySelector('code')?.textContent ?? '';
  const links = (raiz: HTMLElement) =>
    Array.from(raiz.querySelectorAll<HTMLAnchorElement>('code a'), (a) => a.getAttribute('href'));

  it('mostra os quatro temas no mesmo arquivo, sem controle de páginas', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelectorAll('app-editor-de-codigo')).toHaveLength(1);
    expect(raiz.querySelector('app-paginas-da-secao')).toBeNull();
    expect(raiz.querySelectorAll('.javadoc')).toHaveLength(4);
  });

  it('mostra o texto de cada tema', async () => {
    const texto = codigo(await renderizar());

    for (const trecho of [
      'Este portfólio é o meu estudo de desenvolvimento com IA',
      'Spec-Driven Development (SDD)',
      'hackathon Anthropic x Forum Ventures em setembro de 2025',
      'desenvolvedor brasileiro Evert Junior',
    ]) {
      expect(texto).toContain(trecho);
    }
  });

  it('declara o pacote, a classe EstudoComIA e o record Ferramenta uma vez só', async () => {
    const texto = codigo(await renderizar());

    expect(texto.match(/package /g)).toHaveLength(1);
    expect(texto.match(/public class EstudoComIA \{/g)).toHaveLength(1);
    expect(
      texto.match(/record Ferramenta\(String nome, String papel, String link\) \{\}/g),
    ).toHaveLength(1);
    expect(texto).toContain('package dev.vinicius.portfolio.projetos;');
    expect(texto).not.toContain('static final');
  });

  it('abre cada tema com um comentário de título, na ordem', async () => {
    const texto = codigo(await renderizar());
    const posicoes = ['// O estudo', '// SDD com OpenSpec', '// ECC', '// Maestri'].map((c) =>
      texto.indexOf(c),
    );

    expect(posicoes.every((p) => p > 0)).toBe(true);
    expect([...posicoes].sort((a, b) => a - b)).toEqual(posicoes);
  });

  it('liga o repositório, /repositorio, o OpenSpec, o ECC e o Maestri', async () => {
    expect(links(await renderizar())).toEqual([
      'https://github.com/viniassuncao1/Portifolio-Vinicius-Machado',
      '/repositorio',
      'https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/tree/main/openspec',
      'https://github.com/affaan-m/ECC',
      'https://www.producthunt.com/products/maestri',
    ]);
  });

  it('abre os links externos em nova aba com rel seguro', async () => {
    const externos = (await renderizar()).querySelectorAll<HTMLAnchorElement>(
      'code a[href^="http"]',
    );

    expect(externos).toHaveLength(4);
    externos.forEach((a) => {
      expect(a.getAttribute('target')).toBe('_blank');
      expect(a.getAttribute('rel')).toBe('noopener noreferrer');
    });
  });

  it('lista as skills do ECC usadas', async () => {
    const texto = codigo(await renderizar());

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

  it('lista a equipe de agentes do Maestri', async () => {
    const texto = codigo(await renderizar());

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
    for (const bloco of (await renderizar()).querySelectorAll('.javadoc')) {
      const texto = bloco.textContent ?? '';

      expect(texto).not.toMatch(/[—–]/);
      expect(texto).not.toMatch(new RegExp('[\\u200b-\\u200f\\u2060\\ufeff\\u00ad\\u00a0\\u202f]'));
      expect(texto).not.toMatch(PALAVRAS_DE_TEXTO_GERADO);
      expect(texto.trim().split(/\s+/).length).toBeLessThanOrEqual(90);
    }
  });

  it('tem o ▶ Executar só na linha da classe (code vision para o GitHub)', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelectorAll('app-botao-executar')).toHaveLength(1);
    expect(raiz.querySelector('.linha:has(app-botao-executar)')?.textContent).toContain(
      'public class EstudoComIA',
    );
  });

  it('não tem h1 próprio', async () => {
    expect((await renderizar()).querySelector('h1')).toBeNull();
  });
});
