import { TestBed } from '@angular/core/testing';

import { CONTEUDO_DIFERENCIAIS } from './diferenciais.conteudo';
import { Diferenciais } from './diferenciais';

const INICIO_DO_PARAGRAFO = 'Moro em Brasília há 20 anos.';
const FIM_DO_PARAGRAFO = 'encarar o que aparecer pela frente.';

describe('Diferenciais', () => {
  async function renderizar(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Diferenciais);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  const linhaDe = (raiz: HTMLElement, texto: string) =>
    Array.from(raiz.querySelectorAll('code > span')).find((linha) =>
      linha.textContent?.includes(texto),
    );

  it('exibe o código da seção no editor, sem h1 próprio', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelectorAll('app-editor-de-codigo')).toHaveLength(1);
    expect(raiz.querySelector('h1')).toBeNull();
  });

  it('declara o record PersonalData e a constante VINICIUS, na ordem', async () => {
    const raiz = await renderizar();
    const textos = Array.from(raiz.querySelectorAll('code > span'))
      .map((linha) => linha.textContent?.replace(/\s+/g, ' ').trim())
      .filter((texto) => texto);

    expect(textos).toEqual([
      'import java.time.Period;',
      expect.stringContaining(INICIO_DO_PARAGRAFO),
      'public record PersonalData(',
      'String origin,',
      'String city,',
      'Period livingInCityFor,',
      'boolean extrovert,',
      'boolean curious,',
      'boolean loveToLearn',
      ') {',
      'public static final PersonalData VINICIUS = new PersonalData(',
      '"Mineiro",',
      '"Brasília",',
      'Period.ofYears(20),',
      'true, // extrovertido',
      'true, // curioso',
      'true // gosta de aprender',
      ');',
      '}',
    ]);
  });

  it('mostra origem e cidade com os textos entre aspas na cor de literal', async () => {
    const raiz = await renderizar();

    expect(Array.from(raiz.querySelectorAll('.papel-literal')).map((l) => l.textContent)).toEqual([
      '"Mineiro"',
      '"Brasília"',
    ]);
  });

  it.each(['extrovert', 'curious', 'loveToLearn'])(
    'declara boolean %s como declaração',
    async (campo) => {
      const raiz = await renderizar();

      expect(
        linhaDe(raiz, `boolean ${campo}`)?.querySelector('.papel-declaracao')?.textContent,
      ).toBe(`boolean ${campo}`);
    },
  );

  it('usa o papel valor nos três booleanos true e nos 20 anos', async () => {
    const raiz = await renderizar();

    expect(Array.from(raiz.querySelectorAll('.papel-valor')).map((v) => v.textContent)).toEqual([
      '20',
      'true',
      'true',
      'true',
    ]);
  });

  it('comenta cada booleano com o significado, na cor de comentário', async () => {
    const raiz = await renderizar();
    const comentarios = Array.from(raiz.querySelectorAll('.papel-comentario')).map((c) =>
      c.textContent?.trim(),
    );

    expect(comentarios).toEqual(
      expect.arrayContaining(['// extrovertido', '// curioso', '// gosta de aprender']),
    );
  });

  it('recua os componentes dois níveis, a constante um e o parágrafo zero', async () => {
    const raiz = await renderizar();
    const recuo = (texto: string) =>
      (linhaDe(raiz, texto) as HTMLElement).style.getPropertyValue('--recuo');

    expect(recuo('String origin,')).toBe('2');
    expect(recuo('PersonalData VINICIUS')).toBe('1');
    expect(recuo('"Mineiro"')).toBe('3');
    expect(recuo('public record PersonalData')).toBe('0');
    expect(recuo(INICIO_DO_PARAGRAFO)).toBe('0');
  });

  it('começa e termina o parágrafo com os textos da spec', async () => {
    const raiz = await renderizar();
    const texto = raiz.querySelector('.javadoc')?.textContent ?? '';

    expect(raiz.querySelectorAll('.javadoc')).toHaveLength(1);
    expect(texto.startsWith(INICIO_DO_PARAGRAFO)).toBe(true);
    expect(texto.endsWith(FIM_DO_PARAGRAFO)).toBe(true);
  });

  it('fecha o record com a chave de fechamento no recuo zero', async () => {
    const ultima = CONTEUDO_DIFERENCIAIS.at(-1);

    expect(ultima).toMatchObject({ tipo: 'codigo', recuo: 0 });
  });

  it('mantém o texto do código sem números de linha', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelector('code')?.textContent).not.toMatch(/^\d+/);
  });
});
