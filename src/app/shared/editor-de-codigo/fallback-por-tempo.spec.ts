import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { comum, linha } from './conteudo';
import type { ConteudoDoEditor } from './conteudo';
import { EditorDeCodigo } from './editor-de-codigo';

const DURACAO_MAXIMA_MS = 1500;
const FOLGA_MS = 100;

describe('Fallback por tempo da digitação', () => {
  const matchMediaOriginal = document.defaultView!.matchMedia;
  const conteudo: ConteudoDoEditor = Array.from({ length: 80 }, (_, i) => linha(0, comum(`l${i}`)));

  const abrir = (): HTMLElement => {
    const fixture = TestBed.createComponent(EditorDeCodigo);
    fixture.componentRef.setInput('conteudo', conteudo);
    document.body.append(fixture.nativeElement);
    fixture.detectChanges();
    TestBed.tick();
    return fixture.nativeElement as HTMLElement;
  };

  beforeEach(() => {
    vi.useFakeTimers();
    document.defaultView!.matchMedia = (() => ({ matches: false })) as unknown as typeof matchMedia;
    // Aba oculta: o quadro de animação nunca roda.
    vi.spyOn(document.defaultView!, 'requestAnimationFrame').mockReturnValue(1);
    vi.spyOn(document.defaultView!, 'cancelAnimationFrame').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.defaultView!.matchMedia = matchMediaOriginal;
    document.body.replaceChildren();
  });

  it('completa a digitação por tempo mesmo sem nenhum quadro de animação', () => {
    const editor = abrir();
    expect(editor.classList).toContain('digitando');

    vi.advanceTimersByTime(DURACAO_MAXIMA_MS + FOLGA_MS);
    TestBed.tick();

    expect(editor.classList).not.toContain('digitando');
    expect(editor.classList).toContain('pronto');
    expect(editor.style.getPropertyValue('--digitado')).toBe('');
  });

  it('não completa antes do prazo', () => {
    const editor = abrir();

    vi.advanceTimersByTime(DURACAO_MAXIMA_MS);
    TestBed.tick();

    expect(editor.classList).toContain('digitando');
  });

  it('com movimento reduzido nem agenda o fallback: o código já aparece pronto', () => {
    document.defaultView!.matchMedia = (() => ({ matches: true })) as unknown as typeof matchMedia;

    const editor = abrir();

    expect(editor.classList).toContain('pronto');
    expect(vi.getTimerCount()).toBe(0);
  });
});
