import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CursorDoSite } from './cursor-do-site';

function simular({ fino, reduzido }: { fino: boolean; reduzido: boolean }) {
  vi.stubGlobal('navigator', { hardwareConcurrency: 8 });
  vi.stubGlobal('matchMedia', (consulta: string) => ({
    matches: consulta.includes('reduced-motion') ? reduzido : fino,
    addEventListener: () => undefined,
  }));
}

function montar() {
  const fixture = TestBed.createComponent(CursorDoSite);
  fixture.detectChanges();
  TestBed.inject(ApplicationRef).tick();
  return fixture;
}

describe('CursorDoSite', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (acao: FrameRequestCallback) => {
      acao(0);
      return 1;
    });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('é decorativo: escondido de leitores de tela', () => {
    simular({ fino: true, reduzido: false });

    expect((montar().nativeElement as HTMLElement).getAttribute('aria-hidden')).toBe('true');
  });

  it('acompanha o ponteiro e cresce sobre links e botões', () => {
    simular({ fino: true, reduzido: false });
    const fixture = montar();
    const el = fixture.nativeElement as HTMLElement;
    const botao = document.createElement('button');
    document.body.append(botao);

    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 40, clientY: 60 }));
    fixture.detectChanges();
    expect(el.getAttribute('data-ativo')).toBe('true');
    expect(el.style.getPropertyValue('--x')).toBe('40px');
    expect(el.getAttribute('data-sobre-alvo')).toBe('false');

    botao.dispatchEvent(new PointerEvent('pointermove', { clientX: 5, clientY: 5, bubbles: true }));
    fixture.detectChanges();
    expect(el.getAttribute('data-sobre-alvo')).toBe('true');
  });

  it('em toque ou com movimento reduzido não faz nada', () => {
    simular({ fino: false, reduzido: false });
    const toque = montar();
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 1, clientY: 1 }));
    toque.detectChanges();
    expect((toque.nativeElement as HTMLElement).getAttribute('data-ativo')).toBe('false');

    simular({ fino: true, reduzido: true });
    const reduzido = montar();
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 1, clientY: 1 }));
    reduzido.detectChanges();
    expect((reduzido.nativeElement as HTMLElement).getAttribute('data-ativo')).toBe('false');
  });
});
