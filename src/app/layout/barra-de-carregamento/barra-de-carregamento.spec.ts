import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { BarraDeCarregamento } from './barra-de-carregamento';

@Component({ template: '' })
class Vazia {}

describe('BarraDeCarregamento', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: Vazia },
          { path: 'a', component: Vazia },
        ]),
      ],
    });
    vi.useFakeTimers();
  });

  afterEach(() => vi.useRealTimers());

  const estado = (el: HTMLElement) => el.getAttribute('data-estado');

  it('é decorativa: escondida de leitores de tela', () => {
    const fixture = TestBed.createComponent(BarraDeCarregamento);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).getAttribute('aria-hidden')).toBe('true');
    expect(estado(fixture.nativeElement)).toBe('parada');
  });

  it('corre durante a navegação, fica à vista o tempo mínimo e some', async () => {
    const fixture = TestBed.createComponent(BarraDeCarregamento);
    fixture.detectChanges();
    const harness = await RouterTestingHarness.create();

    const navegacao = harness.navigateByUrl('/a');
    fixture.detectChanges();
    await navegacao;
    fixture.detectChanges();
    expect(estado(fixture.nativeElement)).toBe('correndo');

    await vi.advanceTimersByTimeAsync(500);
    fixture.detectChanges();
    expect(estado(fixture.nativeElement)).toBe('terminando');

    await vi.advanceTimersByTimeAsync(300);
    fixture.detectChanges();
    expect(estado(fixture.nativeElement)).toBe('parada');
  });

  it('uma navegação cancelada também encerra a barra', async () => {
    const fixture = TestBed.createComponent(BarraDeCarregamento);
    fixture.detectChanges();
    const roteador = TestBed.inject(Router);

    await roteador.navigateByUrl('/nao-existe').catch(() => undefined);
    await vi.advanceTimersByTimeAsync(800);
    fixture.detectChanges();

    expect(estado(fixture.nativeElement)).toBe('parada');
  });
});
