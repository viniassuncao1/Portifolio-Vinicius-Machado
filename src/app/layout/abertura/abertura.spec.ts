import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ATRIBUTO_DA_ABERTURA, Abertura } from '../../core/abertura';
import { LINHA_DO_TEMPO } from '../../core/linha-do-tempo-da-abertura';
import { AberturaComponente } from './abertura';

@Component({
  imports: [AberturaComponente],
  template: `<main tabindex="-1">Conteúdo</main>
    <app-abertura />`,
})
class Hospedeiro {}

describe('AberturaComponente', () => {
  const raiz = () => document.documentElement;

  async function montar() {
    raiz().setAttribute(ATRIBUTO_DA_ABERTURA, '');
    const fixture = TestBed.createComponent(Hospedeiro);
    document.body.append(fixture.nativeElement);
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(0);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      el,
      abertura: TestBed.inject(Abertura),
      camada: () => el.querySelector<HTMLElement>('.abertura')!,
      main: el.querySelector('main')!,
    };
  }

  const avancar = async (fixture: { detectChanges(): void }, ms: number) => {
    await vi.advanceTimersByTimeAsync(ms);
    fixture.detectChanges();
  };

  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  afterEach(() => {
    vi.useRealTimers();
    raiz().removeAttribute(ATRIBUTO_DA_ABERTURA);
    document.body.replaceChildren();
  });

  it('é um diálogo modal rotulado pelo nome, com a fase em data-fase', async () => {
    const { camada } = await montar();

    expect(camada().getAttribute('role')).toBe('dialog');
    expect(camada().getAttribute('aria-modal')).toBe('true');
    expect(camada().getAttribute('data-fase')).toBe('splash');
    const nome = document.getElementById(camada().getAttribute('aria-labelledby')!);
    expect(nome?.textContent).toBe('Vinicius Machado');
  });

  it('deixa o resto inert enquanto dura, sem esconder o conteúdo, e libera ao revelar', async () => {
    const { fixture, main, abertura } = await montar();

    expect(main.hasAttribute('inert')).toBe(true);
    expect(main.hasAttribute('aria-hidden')).toBe(false);

    abertura.fase.set('revelando');
    await avancar(fixture, 0);
    expect(main.hasAttribute('inert')).toBe(false);
  });

  it('leva o foco ao ▶ quando fica pronto, sem pular nem Esc', async () => {
    const { fixture, el, abertura } = await montar();

    await avancar(fixture, LINHA_DO_TEMPO.splash);
    await avancar(fixture, 0);

    expect(abertura.fase()).toBe('pronto');
    expect(document.activeElement).toBe(el.querySelector('.botao-run'));
    expect(el.querySelector('.botao-run')?.getAttribute('aria-keyshortcuts')).toBe(
      abertura.teclasDoAtalho,
    );
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(abertura.fase()).toBe('pronto');
    expect(el.textContent).not.toMatch(/pular/i);
  });

  it('o atalho da plataforma e o clique no ▶ executam', async () => {
    const { fixture, abertura } = await montar();
    await avancar(fixture, LINHA_DO_TEMPO.splash);
    const atalho = abertura.ehMac ? { key: 'r', ctrlKey: true } : { key: 'F10', shiftKey: true };

    document.dispatchEvent(new KeyboardEvent('keydown', { ...atalho, cancelable: true }));
    expect(abertura.fase()).toBe('compilando');
  });

  it('o clique no ▶ executa e leva o foco para a janela', async () => {
    const { fixture, el, abertura } = await montar();
    await avancar(fixture, LINHA_DO_TEMPO.splash);

    el.querySelector<HTMLButtonElement>('.botao-run')!.click();
    await avancar(fixture, 0);
    await avancar(fixture, 0);

    expect(abertura.fase()).toBe('compilando');
    expect(document.activeElement).toBe(el.querySelector('.janela'));
  });

  it('ao encerrar o foco vai para o main e a camada é dispensada', async () => {
    const { fixture, el, main, abertura } = await montar();

    abertura.fase.set('revelando');
    await avancar(fixture, 0);
    abertura.fase.set('encerrada');
    abertura.dispensada.set(true);
    await avancar(fixture, 0);

    expect(document.activeElement).toBe(main);
    expect((el.querySelector('app-abertura') as HTMLElement).hidden).toBe(true);
  });

  it('só anuncia marcos numa região aria-live polite', async () => {
    const { fixture, el } = await montar();
    await avancar(fixture, 0);
    const viva = el.querySelector('[aria-live]');

    expect(viva?.getAttribute('aria-live')).toBe('polite');
    expect(viva?.textContent).toContain('Carregando o portfólio');
  });

  it('sem abertura (estado inicial encerrado) não leva o foco ao main', async () => {
    raiz().removeAttribute(ATRIBUTO_DA_ABERTURA);
    const fixture = TestBed.createComponent(Hospedeiro);
    document.body.append(fixture.nativeElement);
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(0);
    fixture.detectChanges();

    expect(TestBed.inject(Abertura).fase()).toBe('encerrada');
    expect(document.activeElement).toBe(document.body);
  });
});
