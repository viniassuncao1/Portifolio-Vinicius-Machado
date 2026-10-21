import { PLATFORM_ID, Service, afterNextRender, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type VisaoDoConteudo = 'cartao' | 'codigo';

export const CHAVE_DA_VISAO = 'visao-do-conteudo';

const ehVisao = (valor: unknown): valor is VisaoDoConteudo =>
  valor === 'cartao' || valor === 'codigo';

/**
 * Cartão ou código: duas visões do mesmo conteúdo (ADR-0019). Quem chega pela primeira vez vê o
 * cartão, que se lê em segundos; o código é a alternativa que o visitante escolhe e o navegador
 * lembra (`localStorage`, sempre dentro de try/catch). No servidor e antes da hidratação vale o
 * cartão, que é o que o HTML pré-renderizado traz.
 */
@Service()
export class VisaoDoConteudoEscolhida {
  private readonly navegador = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly atual = signal<VisaoDoConteudo>('cartao');

  readonly visao = this.atual.asReadonly();

  constructor() {
    afterNextRender(() => {
      const lembrada = this.ler();
      if (lembrada) this.atual.set(lembrada);
    });
  }

  escolher(visao: VisaoDoConteudo): void {
    this.atual.set(visao);
    if (!this.navegador) return;
    try {
      localStorage.setItem(CHAVE_DA_VISAO, visao);
    } catch {
      // Armazenamento bloqueado: a escolha vale só nesta visita.
    }
  }

  /** Mostra a visão sem gravá-la: quem pede "Ver em código" não muda a preferência de sempre. */
  escolherSemLembrar(visao: VisaoDoConteudo): void {
    this.atual.set(visao);
  }

  alternar(): void {
    this.escolher(this.atual() === 'cartao' ? 'codigo' : 'cartao');
  }

  private ler(): VisaoDoConteudo | null {
    try {
      const valor = localStorage.getItem(CHAVE_DA_VISAO);
      return ehVisao(valor) ? valor : null;
    } catch {
      return null;
    }
  }
}
