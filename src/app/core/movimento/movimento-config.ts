import { PLATFORM_ID, Service, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const CONSULTA_MOVIMENTO_REDUZIDO = '(prefers-reduced-motion: reduce)';
const CONSULTA_PONTEIRO_FINO = '(hover: hover) and (pointer: fine)';
/** Abaixo disso o aparelho é tratado como fraco e só roda o movimento essencial. */
const NUCLEOS_DE_APARELHO_FRACO = 4;

export type BibliotecaDeMovimento = typeof import('motion');

/**
 * Decide se há movimento e carrega a biblioteca `motion` só quando há (ADR-0019). Tradução, para
 * Angular, do `motionConfig` e do `useReducedMotion` das skills `motion-*` do ECC: a preferência
 * por movimento reduzido é um `signal` que acompanha o sistema, e sem movimento a biblioteca nem é
 * baixada. No servidor nada é lido do navegador e `carregar()` devolve `null`.
 */
@Service()
export class MovimentoConfig {
  private readonly navegador = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly consultaReduzido = this.navegador
    ? globalThis.matchMedia?.(CONSULTA_MOVIMENTO_REDUZIDO)
    : undefined;

  /** `true` quando o visitante pediu para reduzir o movimento. */
  readonly reduzido = signal(this.consultaReduzido?.matches ?? false);
  readonly aparelhoFraco =
    this.navegador && (globalThis.navigator?.hardwareConcurrency ?? 8) <= NUCLEOS_DE_APARELHO_FRACO;
  /** Mouse ou trackpad com hover: só aí valem os efeitos de ponteiro. */
  readonly ponteiroFino =
    this.navegador && (globalThis.matchMedia?.(CONSULTA_PONTEIRO_FINO).matches ?? false);

  private biblioteca: Promise<BibliotecaDeMovimento> | null = null;

  constructor() {
    this.consultaReduzido?.addEventListener('change', (evento) =>
      this.reduzido.set(evento.matches),
    );
  }

  /** O movimento essencial (que explica algo) roda em aparelho fraco; o decorativo não. */
  deveAnimar({ essencial = false }: { essencial?: boolean } = {}): boolean {
    if (!this.navegador || this.reduzido()) return false;
    return essencial || !this.aparelhoFraco;
  }

  /** Carrega a biblioteca uma vez, fora do pacote inicial; `null` quando não deve animar. */
  carregar(opcoes: { essencial?: boolean } = {}): Promise<BibliotecaDeMovimento | null> {
    if (!this.deveAnimar(opcoes)) return Promise.resolve(null);
    this.biblioteca ??= import('motion');
    return this.biblioteca;
  }
}
