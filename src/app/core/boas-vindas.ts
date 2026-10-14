import { DOCUMENT, Service, signal } from '@angular/core';
import { inject } from '@angular/core';

/** Marca a sessão em que a tela de boas-vindas já foi exibida. */
export const CHAVE_DAS_BOAS_VINDAS = 'boas-vindas-exibida';
export const AVISO_DE_INICIALIZACAO = 'PortfolioApplication started in 1.8 s';
export const DURACAO_DO_AVISO_MS = 6000;

/**
 * Estado das boas-vindas: se a tela já foi vista nesta sessão e o aviso de inicialização que a
 * barra de status mostra por 6 s depois que ela fecha.
 */
@Service()
export class BoasVindas {
  private readonly documento = inject(DOCUMENT);
  private readonly textoDoAviso = signal('');
  private temporizador: ReturnType<typeof setTimeout> | undefined;

  readonly aviso = this.textoDoAviso.asReadonly();

  /** Marca a sessão e diz se esta é a primeira vez; sem armazenamento, mostra e segue. */
  registrarPrimeiraVista(): boolean {
    try {
      const sessao = this.documento.defaultView?.sessionStorage;
      if (!sessao) return true;
      if (sessao.getItem(CHAVE_DAS_BOAS_VINDAS) !== null) return false;
      sessao.setItem(CHAVE_DAS_BOAS_VINDAS, '1');
    } catch {
      // Armazenamento bloqueado: sem como lembrar, mostra nesta carga.
    }
    return true;
  }

  /** Mostra o aviso de inicialização por 6 s. */
  avisarInicializacao(): void {
    clearTimeout(this.temporizador);
    this.textoDoAviso.set(AVISO_DE_INICIALIZACAO);
    this.temporizador = setTimeout(() => this.textoDoAviso.set(''), DURACAO_DO_AVISO_MS);
  }
}
