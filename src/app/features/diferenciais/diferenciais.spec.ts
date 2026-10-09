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

  it('declara a classe PersonalData e o método diferenciais, na ordem', async () => {
    const raiz = await renderizar();
    const textos = Array.from(raiz.querySelectorAll('code > span'))
      .map((linha) => linha.textContent?.replace(/\s+/g, ' ').trim())
      .filter((texto) => texto);

    expect(textos).toEqual([
      'public class PersonalData {',
      'String origem = “Mineiro”;',
      'String cidade = “Brasília”;',
      'boolean extrovertido = true;',
      'boolean curioso = true;',
      'boolean gostaDeAprender = true;',
      '@Override',
      'public void diferenciais() {',
      expect.stringContaining(INICIO_DO_PARAGRAFO),
      '}',
    ]);
  });

  it('mostra origem e cidade com os textos entre aspas curvas na cor de literal', async () => {
    const raiz = await renderizar();

    expect(linhaDe(raiz, 'origem')?.querySelector('.papel-literal')?.textContent).toBe('“Mineiro”');
    expect(linhaDe(raiz, 'cidade')?.querySelector('.papel-literal')?.textContent).toBe(
      '“Brasília”',
    );
  });

  it.each(['extrovertido', 'curioso', 'gostaDeAprender'])(
    'colore boolean %s como declaração e true como valor',
    async (campo) => {
      const raiz = await renderizar();
      const linha = linhaDe(raiz, `boolean ${campo}`);

      expect(linha?.querySelector('.papel-declaracao')?.textContent).toBe(`boolean ${campo}`);
      expect(linha?.querySelector('.papel-valor')?.textContent).toBe('true');
      expect(linha?.querySelector('.papel-literal')).toBeNull();
    },
  );

  it('usa o papel valor só nos três booleanos', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelectorAll('.papel-valor')).toHaveLength(3);
  });

  it('anota o método com @Override na cor de anotação', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelector('.papel-anotacao')?.textContent).toBe('@Override');
  });

  it('agrupa os campos em linhas compactas, com vazias compactas entre os grupos', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelectorAll('code > span.compacta:not(.vazia)')).toHaveLength(5);
    expect(raiz.querySelectorAll('code > span.vazia.compacta')).toHaveLength(4);
  });

  it('recua os campos um nível, a anotação e o método um nível e o parágrafo zero', async () => {
    const raiz = await renderizar();
    const recuo = (texto: string) =>
      (linhaDe(raiz, texto) as HTMLElement).style.getPropertyValue('--recuo');

    expect(recuo('origem')).toBe('1');
    expect(recuo('boolean curioso')).toBe('1');
    expect(recuo('@Override')).toBe('1');
    expect(recuo('public void diferenciais')).toBe('1');
    expect(recuo(INICIO_DO_PARAGRAFO)).toBe('0');
  });

  it('começa e termina o parágrafo com os textos da spec', async () => {
    const raiz = await renderizar();
    const texto = raiz.querySelector('.paragrafo')?.textContent ?? '';

    expect(raiz.querySelectorAll('.paragrafo')).toHaveLength(1);
    expect(texto.startsWith(INICIO_DO_PARAGRAFO)).toBe(true);
    expect(texto.endsWith(FIM_DO_PARAGRAFO)).toBe(true);
  });

  it('reproduz o design: a classe termina na chave de fechamento da tela 03', async () => {
    const ultima = CONTEUDO_DIFERENCIAIS.at(-1);

    expect(ultima).toMatchObject({ tipo: 'codigo', recuo: 0 });
  });

  it('mantém o texto do código sem "*"', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelector('code')?.textContent).not.toContain('*');
  });
});
