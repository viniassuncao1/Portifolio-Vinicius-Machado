import { ApplicationRef, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { RelogioDeBrasilia } from './relogio-de-brasilia';

describe('RelogioDeBrasilia', () => {
  afterEach(() => vi.useRealTimers());

  it('mostra a hora de Brasília depois da hidratação, no formato HH:mm', () => {
    vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] });
    vi.setSystemTime(new Date('2026-10-21T15:07:00Z'));

    const relogio = TestBed.inject(RelogioDeBrasilia);
    expect(relogio.hora()).toBe('');
    TestBed.inject(ApplicationRef).tick();

    expect(relogio.hora()).toBe('12:07');
  });

  it('atualiza a cada 30 segundos', () => {
    vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] });
    vi.setSystemTime(new Date('2026-10-21T15:07:50Z'));
    const relogio = TestBed.inject(RelogioDeBrasilia);
    TestBed.inject(ApplicationRef).tick();
    expect(relogio.hora()).toBe('12:07');

    vi.advanceTimersByTime(30_000);

    expect(relogio.hora()).toBe('12:08');
  });

  it('no servidor fica vazia', () => {
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });

    const relogio = TestBed.inject(RelogioDeBrasilia);
    TestBed.inject(ApplicationRef).tick();

    expect(relogio.hora()).toBe('');
  });
});
