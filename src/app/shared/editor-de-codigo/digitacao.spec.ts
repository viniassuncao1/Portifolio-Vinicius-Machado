import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EstadoDoEditor } from '../../core/estado-do-editor';
import { comum, linha, vazia } from './conteudo';
import type { ConteudoDoEditor } from './conteudo';
import { EditorDeCodigo } from './editor-de-codigo';

const CONTEUDO: ConteudoDoEditor = Array.from({ length: 80 }, (_, i) =>
  i % 5 === 4 ? vazia() : linha(0, comum(`int linha${i} = ${i};`)),
);

@Component({
  imports: [EditorDeCodigo],
  template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
})
class Hospedeiro {
  readonly conteudo = CONTEUDO;
}

describe('Digitação do editor', () => {
  const matchMediaOriginal = document.defaultView!.matchMedia;
  const quadros = new Map<number, FrameRequestCallback>();
  let proximoId = 0;

  function simularMovimentoReduzido(reduzir: boolean): void {
    document.defaultView!.matchMedia = ((consulta: string) => ({
      matches: reduzir && consulta.includes('prefers-reduced-motion'),
    })) as typeof matchMedia;
  }

  /** Avança os quadros de animação: cada chamada simula um quadro no instante `agora`. */
  function avancar(agora: number): void {
    const pendentes = [...quadros.values()];
    quadros.clear();
    pendentes.forEach((quadro) => quadro(agora));
    TestBed.tick();
  }

  function abrir(): { host: HTMLElement; editor: HTMLElement } {
    const fixture = TestBed.createComponent(Hospedeiro);
    document.body.append(fixture.nativeElement);
    fixture.detectChanges();
    TestBed.tick();
    const editor = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      'app-editor-de-codigo',
    )!;
    return { host: fixture.nativeElement as HTMLElement, editor };
  }

  beforeEach(() => {
    simularMovimentoReduzido(false);
    quadros.clear();
    proximoId = 0;
    vi.spyOn(document.defaultView!, 'requestAnimationFrame').mockImplementation((chamada) => {
      quadros.set(++proximoId, chamada);
      return proximoId;
    });
    vi.spyOn(document.defaultView!, 'cancelAnimationFrame').mockImplementation((id) => {
      quadros.delete(id);
    });
  });

  afterEach(() => {
    document.defaultView!.matchMedia = matchMediaOriginal;
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it('digita na primeira abertura mantendo o texto completo no DOM', () => {
    const { editor } = abrir();
    const textoAntes = editor.querySelector('code')!.textContent;

    expect(editor.classList).toContain('digitando');
    avancar(0);
    avancar(750);
    expect(Number(editor.style.getPropertyValue('--digitado'))).toBeGreaterThan(0);
    expect(editor.classList).toContain('digitando');
    expect(editor.querySelector('code')!.textContent).toBe(textoAntes);
    expect(textoAntes).toContain('int linha78');
  });

  it('termina em até 1,5 segundo, mesmo com conteúdo longo', () => {
    const { editor } = abrir();

    avancar(0);
    avancar(1500);

    expect(editor.classList).not.toContain('digitando');
    expect(editor.classList).toContain('pronto');
    expect(editor.style.getPropertyValue('--digitado')).toBe('');
  });

  it('mostra o código pronto ao voltar para a mesma seção', () => {
    abrir();
    const segunda = abrir();

    expect(segunda.editor.classList).not.toContain('digitando');
    expect(segunda.editor.classList).toContain('pronto');
  });

  it('completa a digitação ao pressionar uma tecla', () => {
    const { editor } = abrir();
    avancar(0);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    TestBed.tick();

    expect(editor.classList).not.toContain('digitando');
    expect(editor.classList).toContain('pronto');
  });

  it('completa a digitação ao clicar no editor, sem mover a linha atual', () => {
    const { editor } = abrir();
    avancar(0);
    const atualAntes = editor.querySelector('.atual')!.getAttribute('data-indice');

    editor.querySelector<HTMLElement>('[data-indice="0"]')!.click();
    TestBed.tick();

    expect(editor.classList).not.toContain('digitando');
    expect(editor.querySelector('.atual')!.getAttribute('data-indice')).toBe(atualAntes);
  });

  describe('com movimento reduzido', () => {
    it('não digita: o código aparece pronto', () => {
      simularMovimentoReduzido(true);

      const { editor } = abrir();

      expect(editor.classList).not.toContain('digitando');
      expect(editor.classList).toContain('pronto');
    });

    it('desliga o recorte da digitação e o piscar do cursor no CSS', () => {
      abrir();
      const regras = Array.from(document.styleSheets)
        .flatMap((folha) => Array.from(folha.cssRules))
        .filter((regra) => regra instanceof CSSMediaRule)
        .filter((regra) => regra.conditionText.includes('prefers-reduced-motion'))
        .map((regra) =>
          Array.from(regra.cssRules)
            .map((r) => r.cssText)
            .join('\n'),
        )
        .join('\n');

      expect(regras).toContain('clip-path: none');
      expect(regras).toContain('animation: none');
    });
  });

  describe('linha atual e cursor', () => {
    it('começa na última linha de código e escreve a posição ao terminar', () => {
      const { editor } = abrir();
      avancar(0);
      avancar(1500);

      const ultima = CONTEUDO.map((item) => item.tipo).lastIndexOf('codigo');
      expect(editor.querySelector('.atual')!.getAttribute('data-indice')).toBe(String(ultima));
      expect(TestBed.inject(EstadoDoEditor).linha()).toBe(ultima + 1);
    });

    it('move o destaque e atualiza linha e coluna ao clicar numa linha', () => {
      simularMovimentoReduzido(true);
      const { editor } = abrir();

      editor.querySelector<HTMLElement>('[data-indice="4"]')!.click();
      TestBed.tick();

      expect(editor.querySelectorAll('.atual')).toHaveLength(1);
      expect(editor.querySelector('.atual')!.getAttribute('data-indice')).toBe('4');
      expect(TestBed.inject(EstadoDoEditor).linha()).toBe(5);
      expect(TestBed.inject(EstadoDoEditor).coluna()).toBe(1);
    });
  });
});
