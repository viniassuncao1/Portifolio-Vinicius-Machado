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

  it('exibe as linhas de código na ordem, com constantes imutáveis', async () => {
    const raiz = await renderizar();
    const textos = Array.from(raiz.querySelectorAll('code > span'))
      .map((linha) => linha.textContent?.replace(/\s+/g, ' ').trim())
      .filter((texto) => texto);

    expect(textos).toEqual([
      'import java.util.List;',
      expect.stringContaining(INICIO_DO_PARAGRAFO),
      'public final class ArtificialIntelligence {',
      'public static final boolean FAD = false;',
      'public static final boolean PART_OF_THE_JOB = true;',
      'public static final List<String> TOOLS = List.of("Claude Code", "Codex");',
      'public static final String METHODOLOGY = "SDD (Spec-Driven Development)";',
      'private ArtificialIntelligence() {}',
      '}',
    ]);
  });

  it.each([
    ['FAD', 'false'],
    ['PART_OF_THE_JOB', 'true'],
  ])('colore boolean %s como declaração e %s como valor', async (campo, valor) => {
    const linha = linhaDe(await renderizar(), `boolean ${campo}`);

    expect(linha?.querySelector('.papel-declaracao')?.textContent).toBe(`boolean ${campo}`);
    expect(linha?.querySelector('.papel-valor')?.textContent).toBe(valor);
  });

  it('recua os campos um nível e a classe zero', async () => {
    const raiz = await renderizar();

    for (const campo of ['boolean FAD', 'boolean PART_OF_THE_JOB', 'TOOLS']) {
      expect(linhaDe(raiz, campo)?.style.getPropertyValue('--recuo')).toBe('1');
    }
    expect(linhaDe(raiz, 'final class')?.style.getPropertyValue('--recuo')).toBe('0');
  });

  it('lista as ferramentas e a metodologia como literais', async () => {
    const literais = Array.from((await renderizar()).querySelectorAll('.papel-literal')).map(
      (l) => l.textContent,
    );

    expect(literais).toEqual(['"Claude Code"', '"Codex"', '"SDD (Spec-Driven Development)"']);
  });

  it('exibe o texto como um bloco Javadoc antes da classe', async () => {
    const raiz = await renderizar();
    const bloco = raiz.querySelector('.javadoc');

    expect(bloco?.textContent).toContain(INICIO_DO_PARAGRAFO);
    expect(bloco?.nextElementSibling?.textContent).toContain('public final class');
  });

  it('começa e termina o parágrafo com os textos da spec', async () => {
    const raiz = await renderizar();
    const texto = raiz.querySelector('.javadoc')?.textContent ?? '';

    expect(raiz.querySelectorAll('.javadoc')).toHaveLength(1);
    expect(texto.startsWith(INICIO_DO_PARAGRAFO)).toBe(true);
    expect(texto.endsWith(FIM_DO_PARAGRAFO)).toBe(true);
  });

  it('cita Watts Company, Claude Code, Codex e SDD no parágrafo', async () => {
    const texto = (await renderizar()).querySelector('.javadoc')?.textContent ?? '';

    for (const termo of ['Watts Company', 'Claude Code', 'Codex', 'Spec-Driven Development']) {
      expect(texto).toContain(termo);
    }
  });

  it('não mostra controle de páginas, pois a seção tem uma página só', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelector('app-paginas-da-secao')).toBeNull();
    expect(raiz.querySelector('nav')).toBeNull();
  });

  it('mantém o texto do código sem números de linha', async () => {
    expect((await renderizar()).querySelector('code')?.textContent).not.toMatch(/^\d+/);
  });
});
