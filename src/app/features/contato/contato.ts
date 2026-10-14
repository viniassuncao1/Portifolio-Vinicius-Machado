import { Component, afterNextRender, signal } from '@angular/core';

import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
import { CONTEUDO_CONTATO, EMAIL_DE_CONTATO } from './contato.conteudo';

const AVISO_COPIADO = 'E-mail copiado';
const AVISO_FALHOU = 'Não foi possível copiar o e-mail';

// O h1 da página vem da casca.
@Component({
  selector: 'app-contato',
  imports: [EditorDeCodigo],
  template: `
    <app-editor-de-codigo [conteudo]="conteudo" />
    <div class="acoes">
      @if (podeCopiar()) {
        <button type="button" class="copiar" (click)="copiarEmail()">Copiar e-mail</button>
      }
      <span class="aviso" role="status" aria-live="polite">{{ aviso() }}</span>
    </div>
  `,
  styleUrl: './contato.scss',
})
export class Contato {
  protected readonly conteudo = CONTEUDO_CONTATO;
  /** Só depois da hidratação e com a Clipboard API: sem ela o botão não aparece. */
  protected readonly podeCopiar = signal(false);
  protected readonly aviso = signal('');

  constructor() {
    afterNextRender(() =>
      this.podeCopiar.set(typeof navigator.clipboard?.writeText === 'function'),
    );
  }

  protected async copiarEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(EMAIL_DE_CONTATO);
      this.aviso.set(AVISO_COPIADO);
    } catch {
      this.aviso.set(AVISO_FALHOU);
    }
  }
}
