import {
  DOCUMENT,
  Injector,
  PLATFORM_ID,
  Service,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import { trocarComTransicao } from './transicao-de-tema';

export type NomeDoTema = 'claro' | 'escuro';

export const CHAVE_DO_TEMA = 'tema';
const ATRIBUTO_DO_TEMA = 'data-tema';
const TOKEN_DA_COR_DO_TEMA = '--cor-painel';
/** Usadas só se o token não puder ser lido; o valor de verdade vem de `_tokens.scss` e é o mesmo do script do `index.html`. */
const COR_DO_NAVEGADOR_PADRAO: Readonly<Record<NomeDoTema, string>> = {
  escuro: '#2B2B2B',
  claro: '#ECECEC',
};

const ehTema = (valor: unknown): valor is NomeDoTema => valor === 'claro' || valor === 'escuro';

/**
 * Tema claro ou escuro. O script inline do `index.html` já aplicou `data-tema` no `<html>` antes
 * da primeira pintura; este serviço lê esse valor (em vez de recalculá-lo, para não divergir do
 * pré-render) e cuida da troca: `data-tema`, `color-scheme`, `theme-color` e o `localStorage`.
 * No servidor não toca em `localStorage`, `matchMedia` nem no `<html>`.
 */
@Service()
export class Tema {
  private readonly documento = inject(DOCUMENT);
  private readonly navegador = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly atual = signal<NomeDoTema>(this.lerDoDocumento());

  readonly tema = this.atual.asReadonly();
  readonly claro = computed(() => this.atual() === 'claro');

  constructor() {
    // Sincroniza `color-scheme` e `theme-color` com o tema que o script inline aplicou.
    if (this.navegador) this.sincronizarNavegador(this.atual());
  }

  /** Troca para o outro tema e guarda a escolha. */
  alternar(): void {
    this.escolher(this.atual() === 'claro' ? 'escuro' : 'claro');
  }

  /** Guarda a escolha do visitante e aplica o tema, com um crossfade curto quando dá. */
  escolher(tema: NomeDoTema): void {
    this.guardar(tema);
    if (!this.navegador) {
      this.aplicar(tema);
      return;
    }
    trocarComTransicao(this.documento, () => this.aplicar(tema), {
      navegando: this.router.currentNavigation() !== null,
      aposRenderizar: () =>
        new Promise<void>((resolver) =>
          afterNextRender(() => resolver(), { injector: this.injector }),
        ),
    });
  }

  /**
   * Muda o tema na página (`data-tema`, `color-scheme`, `theme-color` e o signal), sem guardar.
   * É a mudança visual que `escolher` envolve numa View Transition (ver `transicao-de-tema.ts`).
   */
  aplicar(tema: NomeDoTema): void {
    this.atual.set(tema);
    if (this.navegador) this.sincronizarNavegador(tema);
  }

  private lerDoDocumento(): NomeDoTema {
    const valor = this.documento.documentElement.getAttribute(ATRIBUTO_DO_TEMA);
    if (ehTema(valor)) return valor;
    // Sem o script inline (ou no servidor): o sistema decide no navegador, escuro nos demais casos.
    return this.navegador && this.sistemaPrefereClaro() ? 'claro' : 'escuro';
  }

  private sistemaPrefereClaro(): boolean {
    const janela = this.documento.defaultView;
    return janela?.matchMedia?.('(prefers-color-scheme: light)').matches ?? false;
  }

  private guardar(tema: NomeDoTema): void {
    if (!this.navegador) return;
    try {
      this.documento.defaultView?.localStorage.setItem(CHAVE_DO_TEMA, tema);
    } catch {
      // Armazenamento bloqueado (janela privada, cookies desligados): a troca vale só nesta visita.
    }
  }

  private sincronizarNavegador(tema: NomeDoTema): void {
    const raiz = this.documento.documentElement;
    raiz.setAttribute(ATRIBUTO_DO_TEMA, tema);
    raiz.style.colorScheme = tema === 'claro' ? 'light' : 'dark';
    this.atualizarCorDoNavegador(tema);
  }

  private atualizarCorDoNavegador(tema: NomeDoTema): void {
    const meta = this.documento.head.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    const token = this.documento.defaultView
      ?.getComputedStyle(this.documento.documentElement)
      .getPropertyValue(TOKEN_DA_COR_DO_TEMA)
      .trim();
    meta.setAttribute('content', token || COR_DO_NAVEGADOR_PADRAO[tema]);
  }
}
