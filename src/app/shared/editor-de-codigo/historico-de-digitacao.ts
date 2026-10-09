import { Service } from '@angular/core';

/** Seções que já foram digitadas nesta visita (só em memória: recarregar a página zera). */
@Service()
export class HistoricoDeDigitacao {
  private readonly vistas = new Set<string>();

  /** Marca a seção como vista e diz se esta é a primeira vez. */
  registrarPrimeiraVista(chave: string): boolean {
    if (this.vistas.has(chave)) return false;
    this.vistas.add(chave);
    return true;
  }
}
