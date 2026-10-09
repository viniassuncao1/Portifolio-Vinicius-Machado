import { Service, signal } from '@angular/core';

/** Posição do cursor no editor (base 1): o editor escreve e a barra de status lê. */
@Service()
export class EstadoDoEditor {
  private readonly linhaAtual = signal(1);
  private readonly colunaAtual = signal(1);

  readonly linha = this.linhaAtual.asReadonly();
  readonly coluna = this.colunaAtual.asReadonly();

  posicionar(linha: number, coluna: number): void {
    this.linhaAtual.set(linha);
    this.colunaAtual.set(coluna);
  }

  reiniciar(): void {
    this.posicionar(1, 1);
  }
}
