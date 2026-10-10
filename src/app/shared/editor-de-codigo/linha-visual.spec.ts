import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EstadoDoEditor } from '../../core/estado-do-editor';
import { comum, javadoc, linha } from './conteudo';
import type { ConteudoDoEditor } from './conteudo';
import { EditorDeCodigo } from './editor-de-codigo';

const ALTURA_DA_LINHA = 30;
const TOPO_DO_EDITOR = 100;

/** Linhas visuais que cada item ocupa; a coluna de números tem uma linha por número. */
const LINHAS_POR_ITEM = [1, 4, 1, 3, 1];

describe('Linha visual na barra de status', () => {
  const matchMediaOriginal = document.defaultView!.matchMedia;
  const retanguloOriginal = Element.prototype.getBoundingClientRect;

  const conteudo: ConteudoDoEditor = [
    linha(0, comum('a')),
    javadoc(0, 'texto longo que quebra em várias linhas'),
    linha(0, comum('b')),
    javadoc(0, 'outro bloco'),
    linha(0, comum('c')),
  ];

  const retangulo = (topo: number, altura: number): DOMRect =>
    ({ top: topo, height: altura, bottom: topo + altura }) as DOMRect;

  /** Simula o layout: itens empilhados conforme `LINHAS_POR_ITEM` e números de altura fixa. */
  beforeEach(() => {
    document.defaultView!.matchMedia = ((consulta: string) => ({
      matches: consulta.includes('prefers-reduced-motion'),
    })) as typeof matchMedia;
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: Element,
    ) {
      if (this.matches('.numeros')) return retangulo(TOPO_DO_EDITOR, 99 * ALTURA_DA_LINHA);
      if (this.closest('.numeros')) return retangulo(TOPO_DO_EDITOR, ALTURA_DA_LINHA);
      const indice = this.getAttribute('data-indice');
      if (indice === null) return retanguloOriginal.call(this);
      const antes = LINHAS_POR_ITEM.slice(0, Number(indice)).reduce((a, b) => a + b, 0);
      const altura = LINHAS_POR_ITEM[Number(indice)] * ALTURA_DA_LINHA;
      return retangulo(TOPO_DO_EDITOR + antes * ALTURA_DA_LINHA, altura);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.defaultView!.matchMedia = matchMediaOriginal;
  });

  const abrir = (): HTMLElement => {
    const fixture = TestBed.createComponent(EditorDeCodigo);
    fixture.componentRef.setInput('conteudo', conteudo);
    document.body.append(fixture.nativeElement);
    fixture.detectChanges();
    TestBed.tick();
    return fixture.nativeElement as HTMLElement;
  };

  it('reporta a linha visual do último item de código, não o seu índice', () => {
    abrir();

    expect(TestBed.inject(EstadoDoEditor).linha()).toBe(10);
  });

  it('reporta a linha visual ao clicar num javadoc de várias linhas', () => {
    const editor = abrir();

    editor.querySelector<HTMLElement>('[data-indice="3"]')!.click();
    TestBed.tick();

    expect(TestBed.inject(EstadoDoEditor).linha()).toBe(7);
  });

  it('reporta a primeira linha visual de um item que ocupa várias', () => {
    const editor = abrir();

    editor.querySelector<HTMLElement>('[data-indice="1"] .javadoc-texto')!.click();
    TestBed.tick();

    expect(TestBed.inject(EstadoDoEditor).linha()).toBe(2);
  });
});
