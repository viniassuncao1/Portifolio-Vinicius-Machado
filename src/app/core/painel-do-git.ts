import { PLATFORM_ID, Service, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { AreaDeBaixo } from './area-de-baixo';
import { lerHistorico } from './git/ler-historico';
import type { HistoricoDoGit } from './git/historico';

export type EstadoDoHistorico = 'ocioso' | 'carregando' | 'pronto' | 'erro';

const ENDERECO_DO_HISTORICO = 'git/historico.json';

/**
 * Estado do painel do Git: aberto ou fechado (na `AreaDeBaixo`) e o histórico. O JSON só é baixado na primeira
 * abertura (nunca no servidor nem no carregamento inicial) e fica guardado aqui. Guarda o elemento
 * que abriu o painel para devolver o foco quando ele fecha.
 */
@Service()
export class PainelDoGit {
  private readonly navegador = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly origem = signal<HTMLElement | null>(null);
  private readonly estadoAtual = signal<EstadoDoHistorico>('ocioso');
  private readonly historicoCarregado = signal<HistoricoDoGit | null>(null);
  private readonly area = inject(AreaDeBaixo);

  /** O painel do Git é a janela aberta na área de baixo (a de Run fecha quando ele abre). */
  readonly aberto = computed(() => this.area.janela() === 'git');
  readonly estado = this.estadoAtual.asReadonly();
  readonly historico = this.historicoCarregado.asReadonly();
  /** O histórico chegou, mas sem commits (build sem histórico do Git). */
  readonly vazio = computed(
    () => this.estadoAtual() === 'pronto' && this.historicoCarregado()?.commits.length === 0,
  );

  abrir(origem: HTMLElement | null): void {
    if (this.aberto()) return;
    this.origem.set(origem);
    this.area.abrir('git');
    if (this.estadoAtual() === 'ocioso') void this.carregar();
  }

  /** Fecha o painel e devolve o foco a quem o abriu. */
  fechar(): void {
    if (!this.aberto()) return;
    this.area.fechar('git');
    this.origem()?.focus();
    this.origem.set(null);
  }

  alternar(origem: HTMLElement | null): void {
    if (this.aberto()) this.fechar();
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
