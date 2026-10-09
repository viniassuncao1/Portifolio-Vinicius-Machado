import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { TitleStrategy, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from '../../app.routes';
import { EstrategiaDeTitulo } from '../../core/estrategia-de-titulo';
import { Inicio } from './inicio';

/** Linhas do código da tela 01, na ordem, com o papel de cada trecho. */
const LINHAS_DA_TELA_01: readonly (readonly [string, string][])[] = [
  [],
  [
    ['papel-palavra-chave', 'package'],
    ['papel-comum', '   portfolio.viniciusmachado;'],
  ],
  [
    ['papel-palavra-chave', 'public class'],
    ['papel-comum', '  ViniciusMachado'],
  ],
  [
    ['papel-comum', '      '],
    ['papel-palavra-chave', 'extends'],
    ['papel-comum', '  DesenvolvedorFullStack {'],
  ],
  [],
  [
    ['papel-declaracao', 'String cargo'],
    ['papel-comum', '  = '],
    ['papel-literal', '“Full Stack Júnior”'],
    ['papel-comum', ';'],
  ],
  [['papel-comum', 'String[] stack = {']],
  [
    ['papel-literal', '“Java”'],
    ['papel-comum', ','],
  ],
  [
    ['papel-literal', '“Spring Boot”'],
    ['papel-comum', ','],
  ],
  [
    ['papel-literal', '“Angular”'],
    ['papel-comum', ','],
  ],
  [['papel-literal', '“SQL”']],
  [],
  [['papel-comum', '};']],
  [],
  [['papel-comum', '}']],
];

describe('Inicio', () => {
  async function renderizar(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Inicio);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('exibe o código no editor, sem layout próprio', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelectorAll('app-editor-de-codigo')).toHaveLength(1);
  });

  it('exibe as 15 linhas da tela 01 com o papel de cada trecho', async () => {
    const raiz = await renderizar();

    const linhas = Array.from(raiz.querySelectorAll('code > span')).map((linha) =>
      Array.from(linha.children).map((trecho) => [trecho.className, trecho.textContent]),
    );

    expect(linhas).toEqual(LINHAS_DA_TELA_01);
  });

  it('declara o pacote portfolio.viniciusmachado como palavra-chave e texto comum', async () => {
    const raiz = await renderizar();
    const linha = raiz.querySelectorAll('code > span')[1];

    expect(linha.querySelector('.papel-palavra-chave')?.textContent).toBe('package');
    expect(linha.textContent).toContain('portfolio.viniciusmachado;');
  });

  it('declara a classe ViniciusMachado que estende DesenvolvedorFullStack', async () => {
    const raiz = await renderizar();
    const texto = Array.from(raiz.querySelectorAll('code > span'))
      .slice(2, 4)
      .map((linha) => linha.textContent?.replace(/\s+/g, ' ').trim());

    expect(texto).toEqual(['public class ViniciusMachado', 'extends DesenvolvedorFullStack {']);
  });

  it('mostra o cargo "Full Stack Júnior" com a declaração na cor de campo', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelector('.papel-declaracao')?.textContent).toBe('String cargo');
    expect(raiz.querySelector('.papel-literal')?.textContent).toBe('“Full Stack Júnior”');
  });

  it('lista as quatro tecnologias do array stack, em ordem, com aspas curvas', async () => {
    const raiz = await renderizar();

    const literais = Array.from(raiz.querySelectorAll('.papel-literal')).map((l) => l.textContent);

    expect(literais).toEqual([
      '“Full Stack Júnior”',
      '“Java”',
      '“Spring Boot”',
      '“Angular”',
      '“SQL”',
    ]);
  });

  it('usa aspas curvas e nunca aspas retas', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelector('code')?.textContent).not.toMatch(/["']/);
  });

  it('indenta o campo e o array com um nível e as tecnologias com dois', async () => {
    const raiz = await renderizar();
    const linhas = Array.from(raiz.querySelectorAll<HTMLElement>('code > span'));
    const recuo = (i: number) => linhas[i].style.getPropertyValue('--recuo');

    expect([recuo(1), recuo(5), recuo(6), recuo(7), recuo(10), recuo(12), recuo(14)]).toEqual([
      '0',
      '1',
      '1',
      '2',
      '2',
      '1',
      '0',
    ]);
  });

  it('não tem h1 próprio: o título vem da casca', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelector('h1')).toBeNull();
  });
});

describe('Início dentro da casca', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        { provide: TitleStrategy, useExisting: EstrategiaDeTitulo },
      ],
    });
  });

  async function abrirInicio(): Promise<HTMLElement> {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');
    harness.detectChanges();
    return harness.routeNativeElement as HTMLElement;
  }

  it('tem um único h1 com o texto Portfolio_Vinicius', async () => {
    const raiz = await abrirInicio();
    const titulos = raiz.querySelectorAll('h1');

    expect(titulos).toHaveLength(1);
    expect(titulos[0].textContent).toBe('Portfolio_Vinicius');
  });

  it('põe o nome do Vinicius no título da janela', async () => {
    await abrirInicio();

    expect(TestBed.inject(Title).getTitle()).toContain('Vinicius Machado');
  });

  it('destaca "Sobre Mim" e expande a seta, como na tela 01', async () => {
    const raiz = await abrirInicio();
    const destacados = raiz.querySelectorAll('nav .destacado');

    expect(destacados).toHaveLength(1);
    expect(destacados[0].textContent).toContain('Sobre Mim');
  });

  it('não marca nenhum item da árvore como página atual', async () => {
    const raiz = await abrirInicio();

    expect(raiz.querySelector('nav [aria-current]')).toBeNull();
  });

  it('mostra o código da tela 01 no editor da casca', async () => {
    const raiz = await abrirInicio();

    expect(raiz.querySelector('main code')?.textContent).toContain('portfolio.viniciusmachado;');
  });

  it('volta a marcar a página atual ao sair do Início para "Sobre Mim"', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/sobre-mim');
    harness.detectChanges();
    const raiz = harness.routeNativeElement as HTMLElement;

    expect(raiz.querySelectorAll('nav [aria-current="page"]')).toHaveLength(1);
    expect(raiz.querySelector('nav [aria-current="page"]')?.textContent).toContain('Sobre Mim');
  });
});
