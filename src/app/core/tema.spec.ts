import { DOCUMENT, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CHAVE_DO_TEMA, Tema } from './tema';

describe('Tema', () => {
  let documento: Document;
  const raiz = () => documento.documentElement;
  const corDoNavegador = () =>
    documento.head.querySelector('meta[name="theme-color"]')?.getAttribute('content');

  beforeEach(() => {
    documento = TestBed.inject(DOCUMENT);
    localStorage.clear();
    raiz().removeAttribute('data-tema');
    raiz().style.removeProperty('color-scheme');
    documento.head.querySelector('meta[name="theme-color"]')?.remove();
    const meta = documento.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    meta.setAttribute('content', '#2B2B2B');
    documento.head.appendChild(meta);
  });

  afterEach(() => {
    localStorage.clear();
    raiz().removeAttribute('data-tema');
    raiz().style.removeProperty('color-scheme');
    documento.head.querySelector('meta[name="theme-color"]')?.remove();
  });

  it('lê o tema que o script inline aplicou no html', () => {
    raiz().setAttribute('data-tema', 'claro');

    const tema = TestBed.inject(Tema);

    expect(tema.tema()).toBe('claro');
    expect(tema.claro()).toBe(true);
    expect(raiz().style.colorScheme).toBe('light');
  });

  it('usa o escuro sem o atributo e com o sistema sem preferência pelo claro', () => {
    expect(TestBed.inject(Tema).tema()).toBe('escuro');
  });

  it('alterna entre escuro e claro e guarda a escolha', () => {
    raiz().setAttribute('data-tema', 'escuro');
    const tema = TestBed.inject(Tema);

    tema.alternar();

    expect(tema.tema()).toBe('claro');
    expect(raiz().getAttribute('data-tema')).toBe('claro');
    expect(raiz().style.colorScheme).toBe('light');
    expect(localStorage.getItem(CHAVE_DO_TEMA)).toBe('claro');

    tema.alternar();

    expect(tema.tema()).toBe('escuro');
    expect(raiz().style.colorScheme).toBe('dark');
    expect(localStorage.getItem(CHAVE_DO_TEMA)).toBe('escuro');
  });

  it('atualiza o theme-color junto com o tema', () => {
    raiz().setAttribute('data-tema', 'escuro');
    const tema = TestBed.inject(Tema);
    expect(corDoNavegador()).toBe('#2B2B2B');

    tema.alternar();

    expect(corDoNavegador()?.toUpperCase()).toBe('#ECECEC');
  });

  it('aplicar muda a página sem guardar a escolha', () => {
    const tema = TestBed.inject(Tema);

    tema.aplicar('claro');

    expect(tema.tema()).toBe('claro');
    expect(raiz().getAttribute('data-tema')).toBe('claro');
    expect(localStorage.getItem(CHAVE_DO_TEMA)).toBeNull();
  });

  it('continua funcionando quando o armazenamento está bloqueado', () => {
    const tema = TestBed.inject(Tema);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('bloqueado', 'SecurityError');
    });

    expect(() => tema.alternar()).not.toThrow();
    expect(tema.tema()).toBe('claro');
    vi.restoreAllMocks();
  });

  describe('no servidor', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
      documento = TestBed.inject(DOCUMENT);
    });

    it('não toca no html nem no armazenamento', () => {
      const guardar = vi.spyOn(Storage.prototype, 'setItem');
      const tema = TestBed.inject(Tema);

      tema.alternar();

      expect(tema.tema()).toBe('claro');
      expect(documento.documentElement.hasAttribute('data-tema')).toBe(false);
      expect(guardar).not.toHaveBeenCalled();
      vi.restoreAllMocks();
    });
  });
});
