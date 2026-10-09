import { TestBed } from '@angular/core/testing';

import { ComoUsoIa } from './como-uso-ia';

const INICIO_DO_PARAGRAFO = 'Não vejo IA como modismo';
const FIM_DO_PARAGRAFO = 'parte de como eu planejo e entrego código.';

describe('ComoUsoIa', () => {
  async function renderizar(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(ComoUsoIa);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  const linhaDe = (raiz: HTMLElement, texto: string) =>
    Array.from(raiz.querySelectorAll('code > span')).find((linha) =>
      linha.textContent?.includes(texto),
    ) as HTMLElement | undefined;

  it('mostra a classe ArtificialIntelligence e os booleanos no papel de valor', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelector('code')?.textContent).toContain('ArtificialIntelligence {');
    expect(Array.from(raiz.querySelectorAll('.papel-valor')).map((v) => v.textContent)).toEqual([
      'false',
      'true',
    ]);
    expect(raiz.querySelector('h1')).toBeNull();
  });

  it('usa a grafia corrigida, sem o erro de digitação do design', async () => {
    const texto = (await renderizar()).querySelector('code')?.textContent ?? '';

    expect(texto).toContain('ArtificialIntelligence');
    expect(texto).not.toContain('ArtificialItenligence');
  });

  it('exibe as linhas de código na ordem da tela 04', async () => {
    const raiz = await renderizar();
    const textos = Array.from(raiz.querySelectorAll('code > span'))
      .map((linha) => linha.textContent?.replace(/\s+/g, ' ').trim())
      .filter((texto) => texto);

    expect(textos).toEqual([
      'public class ArtificialIntelligence {',
      'boolean modismo = false;',
      'boolean parteDoTrabalho = true;',
      '@Override',
      'public void comoEuUsoIA() {',
      expect.stringContaining(INICIO_DO_PARAGRAFO),
      '}',
    ]);
  });

  it.each([
    ['modismo', 'false'],
    ['parteDoTrabalho', 'true'],
  ])('colore boolean %s como declaração e %s como valor', async (campo, valor) => {
    const linha = linhaDe(await renderizar(), `boolean ${campo}`);

    expect(linha?.querySelector('.papel-declaracao')?.textContent).toBe(`boolean ${campo}`);
    expect(linha?.querySelector('.papel-valor')?.textContent).toBe(valor);
  });

  it('põe os campos em linhas apertadas, recuados um nível', async () => {
    const raiz = await renderizar();

    for (const campo of ['boolean modismo', 'boolean parteDoTrabalho']) {
      const linha = linhaDe(raiz, campo);

      expect(linha?.classList.contains('apertada')).toBe(true);
      expect(linha?.style.getPropertyValue('--recuo')).toBe('1');
    }
  });

  it('marca o método com @Override na cor de anotação', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelector('.papel-anotacao')?.textContent).toBe('@Override');
    expect(linhaDe(raiz, 'comoEuUsoIA')?.querySelector('.papel-palavra-chave')?.textContent).toBe(
      'public void',
    );
  });

  it('começa e termina o parágrafo com os textos da spec', async () => {
    const raiz = await renderizar();
    const texto = raiz.querySelector('.paragrafo')?.textContent ?? '';

    expect(raiz.querySelectorAll('.paragrafo')).toHaveLength(1);
    expect(texto.startsWith(INICIO_DO_PARAGRAFO)).toBe(true);
    expect(texto.endsWith(FIM_DO_PARAGRAFO)).toBe(true);
  });

  it('cita Watts Company, Claude Code, Codex e SDD no parágrafo', async () => {
    const texto = (await renderizar()).querySelector('.paragrafo')?.textContent ?? '';

    for (const termo of ['Watts Company', 'Claude Code', 'Codex', 'Spec-Driven Development']) {
      expect(texto).toContain(termo);
    }
  });

  it('não mostra controle de páginas, pois a seção tem uma página só', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelector('app-paginas-da-secao')).toBeNull();
    expect(raiz.querySelector('nav')).toBeNull();
  });

  it('mantém o texto do código sem "*"', async () => {
    expect((await renderizar()).querySelector('code')?.textContent).not.toContain('*');
  });
});
