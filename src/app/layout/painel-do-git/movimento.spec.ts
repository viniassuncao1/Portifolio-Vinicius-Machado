import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { PainelDoGit } from '../../core/painel-do-git';
import { PainelDoGitComponente } from './painel-do-git';

describe('Movimento do painel do Git', () => {
  const css = () =>
    Array.from(document.head.querySelectorAll('style'))
      .map((estilo) => estilo.textContent ?? '')
      .join('\n')
      .replace(/\[_nghost-[^\]]*\]/g, ':host')
      .replace(/\[_ngcontent-[^\]]*\]/g, '');

  const montar = () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => undefined)),
    );
    const fixture = TestBed.createComponent(PainelDoGitComponente);
    fixture.detectChanges();
    return fixture;
  };

  it('fechado, o host fica oculto e sem receber cliques', () => {
    montar();

    expect(css()).toMatch(/:host\s*\{[^}]*display:\s*none/s);
    expect(css()).toMatch(/:host\s*\{[^}]*pointer-events:\s*none/);
  });

  it('anima só transform e opacity, com tokens e o display como transição discreta', () => {
    montar();
    const transicao = css().match(/:host\s*\{[^}]*?transition:([^;]*);/)?.[1] ?? '';

    expect(transicao).toMatch(/opacity\s+var\(--duracao-media\)\s+var\(--curva-entrada\)/);
    expect(transicao).toMatch(/transform\s+var\(--duracao-media\)\s+var\(--curva-entrada\)/);
    expect(transicao).toMatch(/display\s+var\(--duracao-media\)\s+allow-discrete/);
    expect(transicao).not.toMatch(/\b(height|width|top|left|margin|padding)\b/);
  });

  it('a entrada nunca parte do invisível, para o conteúdo não depender da animação', () => {
    montar();
    const partida = css().match(/@starting-style\s*\{[^}]*?opacity:\s*([\d.]+)/)?.[1];

    expect(Number(partida)).toBeGreaterThanOrEqual(0.5);
  });

  it('sem movimento, a transição some com prefers-reduced-motion', () => {
    montar();

    expect(css()).toMatch(
      /prefers-reduced-motion:\s*reduce\)\s*\{\s*:host\s*\{\s*transition:\s*none/,
    );
  });

  it('o conteúdo aparece com o painel aberto, sem depender de animação', async () => {
    const fixture = montar();

    TestBed.inject(PainelDoGit).abrir(null);
    fixture.detectChanges();
    const raiz = fixture.nativeElement as HTMLElement;

    expect(raiz.getAttribute('data-aberto')).toBe('true');
    expect(raiz.querySelector('.painel')).not.toBeNull();
    expect(raiz.querySelector('h2')?.textContent).toBe('Git');
  });

  it('no celular, a folha de tela cheia sobe de mais baixo', () => {
    montar();

    expect(css()).toMatch(/max-width:\s*767\.98px\)[^]*--deslocamento-painel-git:\s*2rem/);
  });
});
