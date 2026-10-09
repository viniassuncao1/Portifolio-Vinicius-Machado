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
    expect(CONTEUDOS_SKILLS).toHaveLength(2);
  });

  it('página 1 mostra linguagens, frameworks e databases e o controle 1/2', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelector('code')?.textContent).toContain('String[] linguagens = {');
    expect(raiz.querySelector('code')?.textContent).toContain('String[] databases = {');
    expect(literais(raiz)).toHaveLength(11);
    expect(raiz.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('1/2');
  });

  it('página 1 lista os três arrays da tela 05, com as vírgulas e sem a última', async () => {
    const raiz = await renderizar();

    expect(linhas(raiz)).toEqual([
      'public class TechSkills {',
      'String[] linguagens = {',
      '“Java”,',
      '“TypeScript”,',
      '“JavaScript”,',
      '“PHP”,',
      '“SQL”',
      '};',
      'String[] frameworks = {',
      '“Spring Boot”,',
      '“Spring Data JPA”,',
      '“Angular”',
      '};',
      'String[] databases = {',
      '“Oracle”,',
      '“PostgreSQL”,',
      '“MySQL”',
      '};',
    ]);
  });

  it('página 2 mostra cloudAndInfra e ferramentas e o controle 2/2', async () => {
    const raiz = await renderizar(2);

    expect(raiz.querySelector('code')?.textContent).toContain('String[] cloudAndInfra = {');
    expect(literais(raiz)).toEqual([
      '“Docker”',
      '“Kubernetes”',
      '“Nginx”',
      '“AWS”',
      '“Azure”',
      '“Git”',
      '“GitLab CI/CD”',
      '“Grafana”',
      '“Scrum”',
    ]);
    expect(raiz.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('2/2');
  });

  it('página 2 lista os dois arrays da tela 06 e não repete os da página 1', async () => {
    const raiz = await renderizar(2);
    const texto = raiz.querySelector('code')?.textContent ?? '';

    expect(linhas(raiz).filter((l) => l?.startsWith('String[]'))).toEqual([
      'String[] cloudAndInfra = {',
      'String[] ferramentas = {',
    ]);
    expect(texto).not.toContain('linguagens');
    expect(texto).not.toContain('databases');
  });

  it('repete o cabeçalho da classe TechSkills nas duas páginas', async () => {
    expect(linhas(await renderizar())[0]).toBe('public class TechSkills {');
    expect(linhas(await renderizar(2))[0]).toBe('public class TechSkills {');
  });

  it('põe as listas em linhas apertadas, com itens dois níveis e arrays um nível', async () => {
    const raiz = await renderizar();
    const linha = (texto: string) =>
      Array.from(raiz.querySelectorAll<HTMLElement>('code > span')).find(
        (l) => l.textContent?.trim() === texto,
      );

    expect(linha('“Java”,')?.classList.contains('apertada')).toBe(true);
    expect(linha('“Java”,')?.style.getPropertyValue('--recuo')).toBe('2');
    expect(linha('String[] linguagens = {')?.style.getPropertyValue('--recuo')).toBe('1');
    expect(linha('};')?.style.getPropertyValue('--recuo')).toBe('0');
  });

  it('não usa o papel valor: só textos entre aspas', async () => {
    expect((await renderizar()).querySelector('.papel-valor')).toBeNull();
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
