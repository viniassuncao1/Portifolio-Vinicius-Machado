import { DOCUMENT, PLATFORM_ID, Service, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const MOVIMENTO_REDUZIDO = '(prefers-reduced-motion: reduce)';

/**
 * Janela de Run: abre na área de baixo com o log de inicialização do `PortfolioApplication`. Nunca
 * abre sozinha: só o Executar a abre (ou reexecuta) e leva o foco para a janela. Guarda quem a abriu para devolver o foco ao
 * fechar. A data e a hora do log são geradas no navegador, na abertura.
 *
 * Para o Compasso animar o log: `execucao` muda a cada (re)início, `terminado` diz se o log já
 * está completo (nasce completo só com movimento reduzido) e `concluir()` marca o fim da revelação.
 */
@Service()
export class JanelaDeRun {
  private readonly documento = inject(DOCUMENT);
  private readonly navegador = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly estaAberta = signal(false);
  private readonly origem = signal<HTMLElement | null>(null);
  private readonly numeroDaExecucao = signal(0);
  private readonly horaDoInicio = signal<Date | null>(null);
  private readonly logTerminado = signal(true);
  private readonly pedirFoco = signal(false);

  readonly aberto = this.estaAberta.asReadonly();
  /** Muda a cada abertura ou reexecução: o log reinicia. */
  readonly execucao = this.numeroDaExecucao.asReadonly();
  /** Quando a execução começou (relógio do navegador); `null` antes da primeira. */
  readonly inicio = this.horaDoInicio.asReadonly();
  /** O log já está completo na tela (ou foi pulado). */
  readonly terminado = this.logTerminado.asReadonly();
  /** A abertura foi pedida pelo visitante, então o foco vai para a janela. */
  readonly focarAoAbrir = this.pedirFoco.asReadonly();

  /** Abre pelo Executar (ou reexecuta, se já estiver aberta): reinicia o log e leva o foco. */
  executar(origem: HTMLElement | null): void {
    if (!this.navegador) return;
    this.iniciar(origem, true);
  }

  /** O Compasso chama ao terminar de revelar as linhas; "Pular" também. */
  concluir(): void {
    this.logTerminado.set(true);
  }

  /** Fecha a janela e devolve o foco a quem a abriu. */
  fechar(): void {
    if (!this.aberto()) return;
    this.estaAberta.set(false);
    this.origem()?.focus();
    this.origem.set(null);
  }

  private iniciar(origem: HTMLElement | null, comFoco: boolean): void {
    this.origem.set(origem);
    this.pedirFoco.set(comFoco);
    this.horaDoInicio.set(new Date());
    // Com movimento reduzido o log já nasce completo; senão o componente o revela e conclui.
    this.logTerminado.set(this.movimentoReduzido());
    this.numeroDaExecucao.update((n) => n + 1);
    this.estaAberta.set(true);
  }

  private movimentoReduzido(): boolean {
    return this.documento.defaultView?.matchMedia?.(MOVIMENTO_REDUZIDO).matches ?? false;
  }
}
