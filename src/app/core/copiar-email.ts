import { PLATFORM_ID, Service, afterNextRender, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { EMAIL_DE_CONTATO } from './perfil';

export const AVISO_DE_EMAIL_COPIADO = 'E-mail copiado';
export const AVISO_DE_EMAIL_NAO_COPIADO = 'Não foi possível copiar o e-mail';

/**
 * Copia o e-mail de contato e diz o resultado num texto que vai para uma região `aria-live`. O
 * botão só aparece depois da hidratação e com a Clipboard API (`disponivel`); sem ela o e-mail
 * continua sendo um link `mailto:`.
 */
@Service()
export class CopiarEmail {
  private readonly navegador = isPlatformBrowser(inject(PLATFORM_ID));
  readonly disponivel = signal(false);
  readonly aviso = signal('');

  constructor() {
    afterNextRender(() =>
      this.disponivel.set(this.navegador && typeof navigator.clipboard?.writeText === 'function'),
    );
  }

  async copiar(): Promise<void> {
    try {
      await navigator.clipboard.writeText(EMAIL_DE_CONTATO);
      this.aviso.set(AVISO_DE_EMAIL_COPIADO);
    } catch {
      this.aviso.set(AVISO_DE_EMAIL_NAO_COPIADO);
    }
  }
}
