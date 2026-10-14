import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BoasVindas } from '../../core/boas-vindas';
import { TelaDeBoasVindas } from './tela-de-boas-vindas';

@Component({
  imports: [TelaDeBoasVindas],
  template: `<main id="pagina">Conteúdo</main>
    <app-tela-de-boas-vindas />`,
})
class Hospedeiro {}

describe('TelaDeBoasVindas', () => {
  const matchMediaOriginal = document.defaultView!.matchMedia;

  const movimentoReduzido = (reduzir: boolean) => {
    document.defaultView!.matchMedia = ((q: string) => ({
      matches: reduzir && q.includes('reduce'),
    })) as typeof matchMedia;
  };

  /** Monta no corpo do documento: a tela bloqueia os irmãos do seu host. */
  async function montar(opcoes: { fontes?: Promise<unknown>; estavel?: boolean } = {}) {
    if (opcoes.fontes)
      Object.defineProperty(document, 'fonts', {
        value: { ready: opcoes.fontes },
        configurable: true,
      });
    const fixture = TestBed.createComponent(Hospedeiro);
    document.body.append(fixture.nativeElement);
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(0);
    fixture.detectChanges();
    const raiz = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      raiz,
      tela: () => raiz.querySelector('.tela'),
      pagina: raiz.querySelector('#pagina')!,
    };
  }

  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    movimentoReduzido(false);
  });

  afterEach(() => {
    vi.useRealTimers();
    document.defaultView!.matchMedia = matchMediaOriginal;
    Reflect.deleteProperty(document, 'fonts');
    document.body.replaceChildren();
  });

  it('na primeira visita mostra foto, nome, cargo, frase e a barra, como status', async () => {
    const { tela } = await montar();
    const el = tela()!;

    expect(el.getAttribute('role')).toBe('status');
    expect(el.textContent).toContain('Carregando o portfólio de Vinicius Machado');
    expect(el.querySelector('img')?.getAttribute('alt')).toBe('Foto de Vinicius Machado');
    expect(el.querySelector('img')?.getAttribute('src')).toContain('fotos/vinicius.webp');
    expect(el.querySelector('.nome')?.textContent).toBe('Vinicius Machado');
    expect(el.querySelector('.cargo')?.textContent).toContain('Full Stack');
    expect(el.querySelector('.frase')?.textContent).toBe('Seja bem-vindo ao meu portfólio');
    expect(el.querySelector('.barra')).not.toBeNull();
    expect(el.querySelector('button, a')).toBeNull();
  });

  it('não aparece de novo na mesma sessão', async () => {
    sessionStorage.setItem('boas-vindas-exibida', '1');

    const { tela } = await montar();

    expect(tela()).toBeNull();
  });

  it('deixa o resto inert e o conteúdo no DOM, sem esconder nem aria-hidden', async () => {
    const { pagina } = await montar({ fontes: new Promise(() => undefined) });

    expect(pagina.hasAttribute('inert')).toBe(true);
    expect(pagina.getAttribute('aria-hidden')).toBeNull();
    expect(pagina.textContent).toBe('Conteúdo');
  });

  it('não fecha antes de 0,6 s mesmo com tudo pronto', async () => {
    const { fixture, tela } = await montar();

    await vi.advanceTimersByTimeAsync(590);
    fixture.detectChanges();

    expect(tela()).not.toBeNull();
  });

  it('com tudo pronto fecha logo depois de 0,6 s, libera o resto e dispara o aviso', async () => {
    const { fixture, tela, pagina } = await montar();

    await vi.advanceTimersByTimeAsync(700);
    fixture.detectChanges();

    expect(tela()?.getAttribute('data-estado')).toBe('saindo');
    expect(pagina.hasAttribute('inert')).toBe(false);
    expect(TestBed.inject(BoasVindas).aviso()).toBe('PortfolioApplication started in 1.8 s');

    await vi.advanceTimersByTimeAsync(250);
    fixture.detectChanges();
    expect(tela()).toBeNull();
  });

  it('fecha no teto de 2 s mesmo que as fontes nunca carreguem', async () => {
    const { fixture, tela } = await montar({ fontes: new Promise(() => undefined) });

    await vi.advanceTimersByTimeAsync(1990);
    fixture.detectChanges();
    expect(tela()?.getAttribute('data-estado')).toBe('aberta');

    await vi.advanceTimersByTimeAsync(20);
    fixture.detectChanges();
    expect(tela()?.getAttribute('data-estado')).toBe('saindo');
  });

  it('com movimento reduzido o teto cai para 1 s e some sem fade', async () => {
    movimentoReduzido(true);
    const { fixture, tela } = await montar({ fontes: new Promise(() => undefined) });

    await vi.advanceTimersByTimeAsync(990);
    fixture.detectChanges();
    expect(tela()).not.toBeNull();

    await vi.advanceTimersByTimeAsync(20);
    fixture.detectChanges();
    expect(tela()).toBeNull();
  });

  it('não rouba o foco', async () => {
    const botao = document.createElement('button');
    document.body.prepend(botao);
    botao.focus();

    await montar();

    expect(document.activeElement).toBe(botao);
  });

  it('o CSS anima só transform e opacity com tokens e desliga em movimento reduzido', async () => {
    await montar();
    const css = Array.from(document.head.querySelectorAll('style'))
      .map((e) => e.textContent ?? '')
      .join('\n');

    expect(css).toMatch(/transition:\s*transform\s+var\(--duracao-lenta\)/);
    expect(css).toMatch(/transition:\s*opacity\s+var\(--duracao-media\)/);
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce\)[^]*transition:\s*none/);
  });
});
