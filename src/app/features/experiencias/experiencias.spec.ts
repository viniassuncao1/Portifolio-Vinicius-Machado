import { TestBed } from '@angular/core/testing';

import { Experiencias } from './experiencias';
import { VisaoDoConteudoEscolhida } from '../../core/visao-do-conteudo';

describe('Experiencias', () => {
  // Estes testes cobrem a visão em código; o cartão tem os seus em `shared/cartoes` e nos E2E.
  beforeEach(() => TestBed.inject(VisaoDoConteudoEscolhida).escolher('codigo'));
  afterEach(() => localStorage.clear());

  async function renderizar(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Experiencias);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  const codigo = (raiz: HTMLElement) => raiz.querySelector('code')?.textContent ?? '';

  it('mostra as três experiências no mesmo arquivo, sem controle de páginas', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelectorAll('app-editor-de-codigo')).toHaveLength(1);
    expect(raiz.querySelector('app-paginas-da-secao')).toBeNull();
    expect(raiz.querySelector('[aria-current="page"]')).toBeNull();
    expect(raiz.querySelectorAll('.javadoc')).toHaveLength(3);
  });

  it('mostra a Memora em andamento', async () => {
    const texto = codigo(await renderizar());

    expect(texto).toContain('"Desenvolvedor Full Stack Júnior"');
    expect(texto).toContain('"08/2026 - Presente"');
    expect(texto).not.toContain('Optional');
  });

  it('mostra o estágio com período fechado e os projetos', async () => {
    const texto = codigo(await renderizar());

    expect(texto).toContain('"Estagiário de Desenvolvimento"');
    expect(texto).toContain('"08/2025 - 07/2026"');
    expect(texto).toContain('Oracle para PostgreSQL');
    expect(texto).toContain('Playwright');
    expect(texto).toContain('AyoForms');
  });

  it('mostra a Watts Company', async () => {
    const texto = codigo(await renderizar());

    expect(texto).toContain('"Watts Company"');
    expect(texto).toContain('"Co-fundador & Desenvolvedor Full Stack"');
    expect(texto).toContain('"02/2025 - Presente"');
  });

  it('declara o package, o record e a classe uma vez só, com um comentário por bloco', async () => {
    const texto = codigo(await renderizar());

    expect(texto.match(/package /g)).toHaveLength(1);
    expect(texto.match(/record Experiencia\(/g)).toHaveLength(1);
    expect(texto.match(/public class Experiencias \{/g)).toHaveLength(1);
    for (const titulo of ['// Memora', '// Estágio na Memora', '// Watts Company']) {
      expect(texto).toContain(titulo);
    }
  });

  it('usa variáveis em português, sem static final, na ordem da mais recente à mais antiga', async () => {
    const texto = codigo(await renderizar());
    const ordem = ['memora', 'estagioNaMemora', 'wattsCompany'].map((nome) =>
      texto.indexOf(`Experiencia ${nome} = new Experiencia(`),
    );

    expect(ordem.every((posicao) => posicao > 0)).toBe(true);
    expect([...ordem].sort((a, b) => a - b)).toEqual(ordem);
    expect(texto).not.toContain('static final');
  });

  it('não tem h1 próprio', async () => {
    expect((await renderizar()).querySelector('h1')).toBeNull();
  });
});
