import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CONTEUDOS_SKILLS } from './skills.conteudo';
import { Skills } from './skills';

describe('Skills', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  async function renderizar(pagina?: number): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Skills);
    if (pagina) fixture.componentRef.setInput('pagina', pagina);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  const literais = (raiz: HTMLElement) =>
    Array.from(raiz.querySelectorAll('.papel-literal')).map((l) => l.textContent);

  const linhas = (raiz: HTMLElement) =>
    Array.from(raiz.querySelectorAll('code > span'))
      .map((linha) => linha.textContent?.replace(/\s+/g, ' ').trim())
      .filter((texto) => texto);

  it('tem uma página de conteúdo para cada página da seção', () => {
    expect(CONTEUDOS_SKILLS).toHaveLength(3);
  });

  it('página 1 mostra linguagens, frameworks e databases e o controle 1/3', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelector('code')?.textContent).toContain('List<String> languages,');
    expect(raiz.querySelector('code')?.textContent).toContain('List<String> databases');
    expect(literais(raiz)).toHaveLength(11);
    expect(raiz.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('1/3');
  });

  it('página 1 declara o record TechSkills e lista cada coleção numa linha', async () => {
    const raiz = await renderizar();

    expect(linhas(raiz)).toEqual([
      'import java.util.List;',
      '// Linguagens, frameworks e bancos de dados que uso',
      'public record TechSkills(',
      'List<String> languages,',
      'List<String> frameworks,',
      'List<String> databases',
      ') {',
      'public static final TechSkills MY_SKILLS = new TechSkills(',
      'List.of("Java", "TypeScript", "JavaScript", "PHP", "SQL"),',
      'List.of("Spring Boot", "Spring Data JPA", "Angular"),',
      'List.of("Oracle", "PostgreSQL", "MySQL")',
      ');',
      '}',
    ]);
  });

  it('página 2 mostra cloudAndInfra e ferramentas e o controle 2/3', async () => {
    const raiz = await renderizar(2);

    expect(raiz.querySelector('code')?.textContent).toContain('List<String> cloudAndInfra,');
    expect(literais(raiz)).toEqual([
      '"Docker"',
      '"Kubernetes"',
      '"Nginx"',
      '"AWS"',
      '"Azure"',
      '"Git"',
      '"GitLab CI/CD"',
      '"Grafana"',
      '"Scrum"',
    ]);
    expect(raiz.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('2/3');
  });

  it('página 2 declara o record InfraSkills e não repete os da página 1', async () => {
    const raiz = await renderizar(2);
    const texto = raiz.querySelector('code')?.textContent ?? '';

    expect(linhas(raiz).filter((l) => l?.startsWith('List<String>'))).toEqual([
      'List<String> cloudAndInfra,',
      'List<String> tools',
    ]);
    expect(linhas(raiz)).toContain('public record InfraSkills(');
    expect(texto).not.toContain('languages');
    expect(texto).not.toContain('databases');
  });

  it('páginas 1 e 2 importam java.util.List e declaram um record', async () => {
    expect(linhas(await renderizar())[0]).toBe('import java.util.List;');
    expect(linhas(await renderizar(2))[0]).toBe('import java.util.List;');
    expect(linhas(await renderizar())[2]).toBe('public record TechSkills(');
    expect(linhas(await renderizar(2))[2]).toBe('public record InfraSkills(');
  });

  it('cada bloco começa com um comentário curto em pt-BR', async () => {
    for (const pagina of [1, 2, 3]) {
      expect((await renderizar(pagina)).querySelector('.papel-comentario')).not.toBeNull();
    }
  });

  it('indenta as listas três níveis e os componentes dois', async () => {
    const raiz = await renderizar();
    const linha = (texto: string) =>
      Array.from(raiz.querySelectorAll<HTMLElement>('code > span')).find(
        (l) => l.textContent?.trim() === texto,
      );

    expect(
      linha('List.of("Oracle", "PostgreSQL", "MySQL")')?.style.getPropertyValue('--recuo'),
    ).toBe('3');
    expect(linha('List<String> languages,')?.style.getPropertyValue('--recuo')).toBe('2');
    expect(linha('public record TechSkills(')?.style.getPropertyValue('--recuo')).toBe('0');
  });

  it('não usa o papel valor: só textos entre aspas', async () => {
    expect((await renderizar()).querySelector('.papel-valor')).toBeNull();
  });

  it('página 3 declara o enum KnowledgeLevel com os quatro níveis explicados', async () => {
    const raiz = await renderizar(3);
    const texto = raiz.querySelector('code')?.textContent ?? '';

    expect(linhas(raiz)).toContain('public enum KnowledgeLevel {');
    for (const nivel of ['DAILY_MASTERY', 'FULL_PROJECT', 'OCCASIONAL_USE', 'THEORETICAL']) {
      expect(texto).toContain(`${nivel}(`);
    }
    expect(texto).toContain('Domínio diário: uso todo dia no trabalho');
    expect(texto).toContain('Projeto completo: já entreguei um projeto inteiro com ela');
    expect(raiz.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('3/3');
  });

  it('página 3 liga cada nível às tecnologias da spec', async () => {
    const texto = linhas(await renderizar(3)).join(' ');

    expect(texto).toContain(
      'KnowledgeLevel.DAILY_MASTERY, List.of("Java", "Spring Boot", "Angular", "PostgreSQL", "Oracle", "TypeScript", "Git")),',
    );
    expect(texto).toContain('KnowledgeLevel.FULL_PROJECT, List.of("PHP")),');
    expect(texto).toContain('KnowledgeLevel.OCCASIONAL_USE, List.of("React Native", "CI/CD")),');
    expect(texto).toContain(
      'KnowledgeLevel.THEORETICAL, List.of("Python", "AWS", "Azure", "Docker", "Kubernetes")));',
    );
  });

  it('aponta o controle para /skills/2 na página 1 e para /skills na página 2', async () => {
    const primeira = await renderizar();
    const segunda = await renderizar(2);

    expect(primeira.querySelector('[aria-label="Próxima página"]')?.getAttribute('href')).toBe(
      '/skills/2',
    );
    expect(segunda.querySelector('[aria-label="Página anterior"]')?.getAttribute('href')).toBe(
      '/skills',
    );
  });

  it('troca o conteúdo quando a página muda', async () => {
    const fixture = TestBed.createComponent(Skills);
    await fixture.whenStable();

    fixture.componentRef.setInput('pagina', 2);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).querySelector('code')?.textContent).toContain(
      'cloudAndInfra',
    );
  });

  it('não tem h1 próprio', async () => {
    expect((await renderizar()).querySelector('h1')).toBeNull();
  });
});
