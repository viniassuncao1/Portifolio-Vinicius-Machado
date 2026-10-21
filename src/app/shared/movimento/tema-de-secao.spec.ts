import { DOCUMENT, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TemaDeSecao } from './tema-de-secao';

@Component({
  imports: [TemaDeSecao],
  template: `
    <section appTemaDeSecao="sobre" id="a"></section>
    <section appTemaDeSecao="stack" id="b"></section>
  `,
})
class Hospedeiro {}

type Retorno = (entradas: { isIntersecting: boolean }[]) => void;

describe('TemaDeSecao', () => {
  let disparar: Map<Element, Retorno>;
  let desconectados: number;

  beforeEach(() => {
    disparar = new Map();
    desconectados = 0;
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(private readonly retorno: Retorno) {}
        observe(el: Element) {
          disparar.set(el, this.retorno);
        }
        disconnect() {
          desconectados++;
        }
      },
    );
    TestBed.inject(DOCUMENT).documentElement.removeAttribute('data-secao');
  });

  afterEach(() => vi.unstubAllGlobals());

  async function montar() {
    const fixture = TestBed.createComponent(Hospedeiro);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('põe o nome da seção no html quando ela cruza a metade da janela', async () => {
    const fixture = await montar();
    const raiz = TestBed.inject(DOCUMENT).documentElement;
    const stack = fixture.nativeElement.querySelector('#b') as Element;

    disparar.get(stack)?.([{ isIntersecting: true }]);

    expect(raiz.getAttribute('data-secao')).toBe('stack');
  });

  it('não muda o tema quando a seção sai da faixa', async () => {
    const fixture = await montar();
    const raiz = TestBed.inject(DOCUMENT).documentElement;
    const sobre = fixture.nativeElement.querySelector('#a') as Element;
    disparar.get(sobre)?.([{ isIntersecting: true }]);

    disparar.get(sobre)?.([{ isIntersecting: false }]);

    expect(raiz.getAttribute('data-secao')).toBe('sobre');
  });

  it('ao sair da página remove o atributo e desconecta os observadores', async () => {
    const fixture = await montar();
    const raiz = TestBed.inject(DOCUMENT).documentElement;
    const stack = fixture.nativeElement.querySelector('#b') as Element;
    disparar.get(stack)?.([{ isIntersecting: true }]);

    fixture.destroy();

    expect(raiz.hasAttribute('data-secao')).toBe(false);
    expect(desconectados).toBe(2);
  });

  it('sem IntersectionObserver não faz nada', async () => {
    vi.stubGlobal('IntersectionObserver', undefined);

    await montar();

    expect(TestBed.inject(DOCUMENT).documentElement.hasAttribute('data-secao')).toBe(false);
  });
});
