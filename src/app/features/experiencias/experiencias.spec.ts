import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CONTEUDOS_EXPERIENCIAS } from './experiencias.conteudo';
import { Experiencias } from './experiencias';

describe('Experiencias', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  async function renderizar(pagina?: number): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Experiencias);
    if (pagina) fixture.componentRef.setInput('pagina', pagina);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  const codigo = (raiz: HTMLElement) => raiz.querySelector('code')?.textContent ?? '';

  it('tem uma página de conteúdo para cada experiência', () => {
    expect(CONTEUDOS_EXPERIENCIAS).toHaveLength(3);
  });

  it('página 1 mostra a Memora em andamento e o controle 1/3', async () => {
    const raiz = await renderizar();

    expect(codigo(raiz)).toContain('record Experience(');
    expect(codigo(raiz)).toContain('"Desenvolvedor Full Stack Júnior"');
    expect(codigo(raiz)).toContain('YearMonth.of(2026, 8)');
    expect(codigo(raiz)).toContain('Optional.empty()');
    expect(raiz.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('1/3');
  });

  it('página 2 mostra o estágio com período fechado e os projetos', async () => {
    const texto = codigo(await renderizar(2));

    expect(texto).toContain('"Estagiário de Desenvolvimento"');
    expect(texto).toContain('YearMonth.of(2025, 8)');
    expect(texto).toContain('Optional.of(YearMonth.of(2026, 7))');
    expect(texto).toContain('Oracle para PostgreSQL');
    expect(texto).toContain('Playwright');
    expect(texto).toContain('AyoForms');
  });

  it('página 3 mostra a Watts Company', async () => {
    const texto = codigo(await renderizar(3));

    expect(texto).toContain('"Watts Company"');
    expect(texto).toContain('"Co-fundador & Desenvolvedor Full Stack"');
    expect(texto).toContain('YearMonth.of(2025, 2)');
  });

  it('declara o record só na página 1', async () => {
    expect(codigo(await renderizar(2))).not.toContain('record Experience(');
  });

  it('não tem h1 próprio', async () => {
    expect((await renderizar()).querySelector('h1')).toBeNull();
  });
});
