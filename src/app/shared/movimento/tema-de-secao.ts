import {
  DOCUMENT,
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
} from '@angular/core';

/** Seções com tema de cor (`src/styles/_temas-de-secao.scss`). */
export type NomeDaSecaoTematica = 'hero' | 'sobre' | 'stack' | 'formacao' | 'projetos' | 'contato';

/** Faixa de 1px na metade da janela: a seção que a cruza é a que manda no tema. */
const MARGEM_DA_METADE = '-50% 0px -50% 0px';
const ATRIBUTO = 'data-secao';

/**
 * Quando a seção passa da metade da janela, o `<html>` recebe `data-secao` com o nome dela e as
 * variáveis `--s-*` transitam para o tema (900 ms, ou nada com movimento reduzido). Funciona sem a
 * biblioteca de animação: é um `IntersectionObserver` mais as transições em CSS. Ao sair da página,
 * o atributo é removido e o tema volta ao padrão.
 */
@Directive({ selector: '[appTemaDeSecao]' })
export class TemaDeSecao {
  readonly nome = input.required<NomeDaSecaoTematica>({ alias: 'appTemaDeSecao' });

  constructor() {
    const elemento = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const raiz = inject(DOCUMENT).documentElement;
    const destruir = inject(DestroyRef);

    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined') return;
      const observador = new IntersectionObserver(
        (entradas) => {
          if (entradas.some((entrada) => entrada.isIntersecting)) {
            raiz.setAttribute(ATRIBUTO, this.nome());
          }
        },
        { rootMargin: MARGEM_DA_METADE },
      );
      observador.observe(elemento);
      destruir.onDestroy(() => {
        observador.disconnect();
        if (raiz.getAttribute(ATRIBUTO) === this.nome()) raiz.removeAttribute(ATRIBUTO);
      });
    });
  }
}
