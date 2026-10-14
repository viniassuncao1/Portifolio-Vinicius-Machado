import { PLATFORM_ID, Service, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { lerHistorico } from './git/ler-historico';
import type { HistoricoDoGit } from './git/historico';

export type EstadoDoHistorico = 'ocioso' | 'carregando' | 'pronto' | 'erro';

const ENDERECO_DO_HISTORICO = 'git/historico.json';

/**
 * Histórico do repositório para a página `/repositorio`. O JSON só é baixado quando a página pede
 * (nunca no servidor nem no carregamento inicial do site) e fica guardado aqui, de modo que
 * reabrir a página não baixa de novo.
 */
@Service()
export class HistoricoDoRepositorio {
  private readonly navegador = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly estadoAtual = signal<EstadoDoHistorico>('ocioso');
  private readonly historicoCarregado = signal<HistoricoDoGit | null>(null);

  readonly estado = this.estadoAtual.asReadonly();
  readonly historico = this.historicoCarregado.asReadonly();
  /** O histórico chegou, mas sem commits (build sem histórico do Git). */
  readonly vazio = computed(
    () => this.estadoAtual() === 'pronto' && this.historicoCarregado()?.commits.length === 0,
  );

  /** Baixa o histórico na primeira chamada; as seguintes não fazem nada. */
  async carregar(): Promise<void> {
    if (!this.navegador || this.estadoAtual() !== 'ocioso') return;
    await this.baixar();
  }

  async tentarDeNovo(): Promise<void> {
    if (this.estadoAtual() === 'erro') await this.baixar();
  }

  private async baixar(): Promise<void> {
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
