import { PLATFORM_ID, Service, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { lerHistorico } from './git/ler-historico';
import type { HistoricoDoGit } from './git/historico';

export type EstadoDoHistorico = 'ocioso' | 'carregando' | 'pronto' | 'erro';

const ENDERECO_DO_HISTORICO = 'git/historico.json';

/**
 * Estado do painel do Git: aberto ou fechado e o histórico. O JSON só é baixado na primeira
 * abertura (nunca no servidor nem no carregamento inicial) e fica guardado aqui. Guarda o elemento
 * que abriu o painel para devolver o foco quando ele fecha.
 */
@Service()
export class PainelDoGit {
  private readonly navegador = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly origem = signal<HTMLElement | null>(null);
  private readonly estadoAtual = signal<EstadoDoHistorico>('ocioso');
  private readonly historicoCarregado = signal<HistoricoDoGit | null>(null);
  private readonly estaAberto = signal(false);

  readonly aberto = this.estaAberto.asReadonly();
  readonly estado = this.estadoAtual.asReadonly();
  readonly historico = this.historicoCarregado.asReadonly();
  /** O histórico chegou, mas sem commits (build sem histórico do Git). */
  readonly vazio = computed(
    () => this.estadoAtual() === 'pronto' && this.historicoCarregado()?.commits.length === 0,
  );

  abrir(origem: HTMLElement | null): void {
    if (this.estaAberto()) return;
    this.origem.set(origem);
    this.estaAberto.set(true);
    if (this.estadoAtual() === 'ocioso') void this.carregar();
  }

  /** Fecha o painel e devolve o foco a quem o abriu. */
  fechar(): void {
    if (!this.estaAberto()) return;
    this.estaAberto.set(false);
    this.origem()?.focus();
    this.origem.set(null);
  }

  alternar(origem: HTMLElement | null): void {
    if (this.estaAberto()) this.fechar();
    else this.abrir(origem);
  }

  async tentarDeNovo(): Promise<void> {
    if (this.estadoAtual() === 'erro') await this.carregar();
  }

  private async carregar(): Promise<void> {
    if (!this.navegador) return;
    this.estadoAtual.set('carregando');
    try {
      const resposta = await fetch(new URL(ENDERECO_DO_HISTORICO, document.baseURI));
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      const historico = lerHistorico(await resposta.json());
      if (!historico) throw new Error('Formato inesperado');
      this.historicoCarregado.set(historico);
      this.estadoAtual.set('pronto');
    } catch {
      this.estadoAtual.set('erro');
    }
  }
}
