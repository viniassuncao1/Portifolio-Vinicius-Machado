import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { TitleStrategy, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from '../../app.routes';
import { EstrategiaDeTitulo } from '../../core/estrategia-de-titulo';
import { Inicio } from './inicio';

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

  const linhas = (raiz: HTMLElement) =>
    Array.from(raiz.querySelectorAll('code > span'))
      .map((linha) => linha.textContent?.replace(/\s+/g, ' ').trim())
      .filter((texto) => texto);

  it('declara o pacote, o import e o record ViniciusMachado, na ordem', async () => {
    const raiz = await renderizar();

    expect(linhas(raiz).slice(0, 7)).toEqual([
      'package portfolio.viniciusmachado;',
      'import java.util.List;',
      'Desenvolvedor Full Stack Júnior: Java, Spring Boot, Angular e SQL.',
      'public record ViniciusMachado(',
      'String role,',
      'List<String> stack',
      ') implements FullStackDeveloper {',
    ]);
  });

  it('declara o pacote portfolio.viniciusmachado como palavra-chave e texto comum', async () => {
    const raiz = await renderizar();
    const linha = raiz.querySelectorAll('code > span')[1];

    expect(linha.querySelector('.papel-palavra-chave')?.textContent).toBe('package');
    expect(linha.textContent).toContain('portfolio.viniciusmachado;');
  });

  it('exibe o Javadoc do perfil antes do record', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelector('.javadoc')?.textContent).toContain('Full Stack Júnior');
  });

  it('mostra os componentes do record na cor de declaração', async () => {
    const raiz = await renderizar();

    expect(
      Array.from(raiz.querySelectorAll('.papel-declaracao')).map((d) => d.textContent),
    ).toEqual(['String role', 'List<String> stack']);
  });

  it('mostra o cargo e as quatro tecnologias da stack, em ordem, com aspas retas', async () => {
    const raiz = await renderizar();

    const literais = Array.from(raiz.querySelectorAll('.papel-literal')).map((l) => l.textContent);

    expect(literais).toEqual([
      '"Full Stack Júnior"',
      '"Java"',
      '"Spring Boot"',
      '"Angular"',
      '"SQL"',
    ]);
  });

  it('cria a stack com List.of, em lista imutável', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelector('code')?.textContent).toContain('List.of(');
    expect(raiz.querySelector('code')?.textContent).not.toContain('String[]');
  });

  it('indenta o record com zero, os componentes com dois e a stack com três níveis', async () => {
    const raiz = await renderizar();
    const todas = Array.from(raiz.querySelectorAll<HTMLElement>('code > span'));
    const recuo = (texto: string) =>
      todas.find((l) => l.textContent?.trim() === texto)?.style.getPropertyValue('--recuo');

    expect([
      recuo('public record ViniciusMachado('),
      recuo('String role,'),
      recuo('List.of("Java", "Spring Boot", "Angular", "SQL")'),
    ]).toEqual(['0', '2', '3']);
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

  it('mostra o código do Início no editor da casca', async () => {
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
