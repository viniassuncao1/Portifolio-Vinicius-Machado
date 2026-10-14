import { DOCUMENT, Service, signal } from '@angular/core';
import { inject } from '@angular/core';

export const CHAVE_DO_MODO_DE_LEITURA = 'modo-de-leitura';

/**
 * Modo de leitura do Javadoc (a "Rendered View" do IntelliJ): ligado por padrão. A escolha vale para
 * o site todo e fica no `sessionStorage` (só `desligado` é guardado). No servidor, sempre ligado.
 */
@Service()
export class ModoDeLeitura {
  private readonly documento = inject(DOCUMENT);
  private readonly ligado = signal(this.ler());

  readonly ativo = this.ligado.asReadonly();

  alternar(): void {
    const novo = !this.ligado();
    this.ligado.set(novo);
    try {
      const armazenamento = this.documento.defaultView?.sessionStorage;
      if (novo) armazenamento?.removeItem(CHAVE_DO_MODO_DE_LEITURA);
      else armazenamento?.setItem(CHAVE_DO_MODO_DE_LEITURA, 'desligado');
    } catch {
      // Sem armazenamento a escolha vale só até recarregar.
    }
  }

  private ler(): boolean {
    try {
      return (
        this.documento.defaultView?.sessionStorage.getItem(CHAVE_DO_MODO_DE_LEITURA) !== 'desligado'
      );
    } catch {
      return true;
    }
  }
}
