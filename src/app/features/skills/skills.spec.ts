import { TestBed } from '@angular/core/testing';

import { Skills } from './skills';
import { VisaoDoConteudoEscolhida } from '../../core/visao-do-conteudo';

describe('Skills', () => {
  // Estes testes cobrem a visão em código; o cartão tem os seus em `shared/cartoes` e nos E2E.
  beforeEach(() => TestBed.inject(VisaoDoConteudoEscolhida).escolher('codigo'));
  afterEach(() => localStorage.clear());

  async function renderizar(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Skills);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  const literais = (raiz: HTMLElement) =>
    Array.from(raiz.querySelectorAll('.papel-literal')).map((l) => l.textContent);

  const linhas = (raiz: HTMLElement) =>
    Array.from(raiz.querySelectorAll('code > span'))
      .map((linha) => linha.textContent?.replace(/\s+/g, ' ').trim())
      .filter((texto) => texto);

  it('mostra tudo num arquivo só, sem controle de páginas', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelectorAll('app-editor-de-codigo')).toHaveLength(1);
    expect(raiz.querySelector('app-paginas-da-secao')).toBeNull();
    expect(raiz.querySelector('[aria-current="page"]')).toBeNull();
  });

  it('declara o package, o import e a classe uma vez só', async () => {
    const texto = (await renderizar()).querySelector('code')?.textContent ?? '';

    expect(texto.match(/package /g)).toHaveLength(1);
    expect(texto.match(/import java\.util\.List;/g)).toHaveLength(1);
    expect(texto.match(/public class Skills \{/g)).toHaveLength(1);
    expect(texto).toContain('package dev.vinicius.portfolio.skills;');
    expect(texto).not.toContain('static final');
  });

  it('mostra linguagens, frameworks e bancos, cada coleção numa linha', async () => {
    const todas = linhas(await renderizar());

    expect(todas).toEqual(
      expect.arrayContaining([
        'record Tecnologias(',
        'List<String> linguagens,',
        'List<String> frameworks,',
        'List<String> bancosDeDados) {}',
        'Tecnologias principais = new Tecnologias(',
        'List.of("Java", "TypeScript", "JavaScript", "PHP", "SQL"),',
        'List.of("Spring Boot", "Spring Data JPA", "Spring Security", "Angular", "JUnit"),',
        'List.of("Oracle", "PostgreSQL", "MySQL")',
      ]),
    );
  });

  it('mostra nuvem, infraestrutura e ferramentas, sem repetir os campos das tecnologias', async () => {
    const todas = linhas(await renderizar());

    expect(todas).toEqual(
      expect.arrayContaining([
        'record Ferramentas(',
        'List<String> nuvemEInfra,',
        'List<String> ferramentas) {}',
        'Ferramentas doDiaADia = new Ferramentas(',
        'List.of("Docker", "Kubernetes", "Nginx", "AWS", "Azure"),',
        'List.of("Git", "GitLab CI/CD", "Grafana", "Scrum")',
      ]),
    );
  });

  it('mostra as 22 tecnologias das duas primeiras partes, em ordem', async () => {
    const raiz = await renderizar();

    expect(literais(raiz).slice(0, 22)).toEqual(
      [
        'Java',
        'TypeScript',
        'JavaScript',
        'PHP',
        'SQL',
        'Spring Boot',
        'Spring Data JPA',
        'Spring Security',
        'Angular',
        'JUnit',
        'Oracle',
        'PostgreSQL',
        'MySQL',
        'Docker',
        'Kubernetes',
        'Nginx',
        'AWS',
        'Azure',
        'Git',
        'GitLab CI/CD',
        'Grafana',
        'Scrum',
      ].map((nome) => `"${nome}"`),
    );
  });

  it('cada bloco começa com um comentário curto em pt-BR', async () => {
    const texto = (await renderizar()).querySelector('code')?.textContent ?? '';

    for (const comentario of [
      '// Linguagens, frameworks e bancos de dados que uso',
      '// Nuvem, infraestrutura e ferramentas do dia a dia',
      '// Quanto conheço cada tecnologia',
      '// Tecnologias de cada nível',
    ]) {
      expect(texto).toContain(comentario);
    }
  });

  it('indenta as listas e os componentes três níveis e a classe zero', async () => {
    const raiz = await renderizar();
    const linha = (texto: string) =>
      Array.from(raiz.querySelectorAll<HTMLElement>('code > span')).find(
        (l) => l.textContent?.trim() === texto,
      );

    expect(
      linha('List.of("Oracle", "PostgreSQL", "MySQL")')?.style.getPropertyValue('--recuo'),
    ).toBe('3');
    expect(linha('List<String> linguagens,')?.style.getPropertyValue('--recuo')).toBe('3');
    expect(linha('public class Skills {')?.style.getPropertyValue('--recuo')).toBe('0');
  });

  it('não usa o papel valor: só textos entre aspas', async () => {
    expect((await renderizar()).querySelector('.papel-valor')).toBeNull();
  });

  it('declara o enum NivelDeConhecimento com os quatro níveis explicados', async () => {
    const raiz = await renderizar();
    const texto = raiz.querySelector('code')?.textContent ?? '';

    expect(linhas(raiz)).toContain('enum NivelDeConhecimento {');
    for (const nivel of ['DominioDiario', 'ProjetoCompleto', 'UsoPontual', 'ConhecimentoTeorico']) {
      expect(texto).toContain(`${nivel}(`);
    }
    expect(texto).toContain('Domínio diário: uso todo dia no trabalho');
    expect(texto).toContain('Projeto completo: já entreguei um projeto inteiro com ela');
  });

  it('liga cada nível às tecnologias da spec', async () => {
    const texto = linhas(await renderizar()).join(' ');

    expect(texto).toContain(
      'NivelDeConhecimento.DominioDiario, List.of("Java", "Spring Boot", "Spring Security", "Angular", "PostgreSQL", "Oracle", "TypeScript", "Git")),',
    );
    expect(texto).toContain('NivelDeConhecimento.ProjetoCompleto, List.of("PHP")),');
    expect(texto).toContain(
      'NivelDeConhecimento.UsoPontual, List.of("React Native", "CI/CD", "JUnit")),',
    );
    expect(texto).toContain(
      'NivelDeConhecimento.ConhecimentoTeorico, List.of("Python", "AWS", "Azure", "Docker", "Kubernetes")));',
    );
  });

  it('não tem h1 próprio', async () => {
    expect((await renderizar()).querySelector('h1')).toBeNull();
  });
});
