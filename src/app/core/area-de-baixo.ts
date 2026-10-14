import { Service, signal } from '@angular/core';

/** As janelas de ferramenta que dividem a área de baixo da IDE. */
export type JanelaDeBaixo = 'run' | 'git';

/**
 * Qual janela de ferramenta ocupa a área de baixo da IDE. Só uma de cada vez: abrir uma fecha a
 * outra. Cada janela tem o seu serviço (`JanelaDeRun`, `PainelDoGit`), que guarda o resto.
 */
@Service()
export class AreaDeBaixo {
  private readonly atual = signal<JanelaDeBaixo | null>(null);

  readonly janela = this.atual.asReadonly();

  abrir(janela: JanelaDeBaixo): void {
    this.atual.set(janela);
  }

  /** Fecha a área, mas só se a janela pedida ainda for a aberta. */
  fechar(janela: JanelaDeBaixo): void {
    if (this.atual() === janela) this.atual.set(null);
  }
}
