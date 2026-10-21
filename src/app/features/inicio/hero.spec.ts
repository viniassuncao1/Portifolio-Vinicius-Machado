import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Hero } from './hero';

function simularMovimento(reduzido: boolean) {
  vi.stubGlobal('navigator', { hardwareConcurrency: 8 });
  vi.stubGlobal('matchMedia', (consulta: string) => ({
    matches: consulta.includes('reduced-motion') ? reduzido : true,
    addEventListener: () => undefined,
  }));
}

function montar() {
  TestBed.configureTestingModule({ providers: [provideRouter([{ path: '**', children: [] }])] });
  const fixture = TestBed.createComponent(Hero);
  fixture.detectChanges();
  TestBed.inject(ApplicationRef).tick();
  fixture.detectChanges();
  return fixture;
}

describe('Hero', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('com movimento reduzido mostra o cartão direto, sem digitar', () => {
    simularMovimento(true);

    const fixture = montar();

    const raiz = fixture.nativeElement as HTMLElement;
    expect(raiz.querySelector('.janela-do-hero')?.getAttribute('data-fase')).toBe('cartao');
    expect(raiz.querySelector('.codigo')).toBeNull();
  });

  it('o texto do nome, do cargo e do resumo existe desde o primeiro quadro', () => {
    simularMovimento(true);

    const raiz = montar().nativeElement as HTMLElement;

    expect(raiz.querySelector('.nome')?.textContent).toBe('Vinicius Machado');
    expect(raiz.querySelector('.resumo')?.textContent).toContain('Java 21');
    expect(raiz.querySelectorAll('.stack .chip')).toHaveLength(4);
  });

  it('com movimento digita a classe e, em até 2,5 s, resolve no cartão', () => {
    simularMovimento(false);
    vi.useFakeTimers({
      toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout', 'performance'],
    });

    const fixture = montar();
    const raiz = fixture.nativeElement as HTMLElement;
    expect(raiz.querySelector('.janela-do-hero')?.getAttribute('data-fase')).toBe('digitando');

    vi.advanceTimersByTime(700);
    fixture.detectChanges();
    const parcial = raiz.querySelector('.codigo')?.textContent ?? '';
    expect(parcial.length).toBeGreaterThan(0);
    expect(parcial).not.toContain('SQL');
    expect(raiz.querySelector('.codigo')?.getAttribute('aria-hidden')).toBe('true');

    vi.advanceTimersByTime(2500 - 700);
    fixture.detectChanges();
    expect(raiz.querySelector('.janela-do-hero')?.getAttribute('data-fase')).toBe('cartao');
    expect(raiz.querySelector('.codigo')).toBeNull();
  });

  it('a digitação acontece uma vez por carga da página', () => {
    simularMovimento(false);
    vi.useFakeTimers({
      toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout', 'performance'],
    });

    const primeira = montar();
    const fase = (fixture: ReturnType<typeof montar>) =>
      (fixture.nativeElement as HTMLElement)
        .querySelector('.janela-do-hero')
        ?.getAttribute('data-fase');
    expect(fase(primeira)).toBe('digitando');

    // Voltar ao Início na mesma carga da página não digita de novo.
    const segunda = TestBed.createComponent(Hero);
    segunda.detectChanges();
    TestBed.inject(ApplicationRef).tick();
    segunda.detectChanges();
    expect(fase(segunda)).toBe('cartao');
  });
});
