import { Component, afterNextRender, signal } from '@angular/core';

import { EMAIL_DE_CONTATO } from '../../core/perfil';
import { ContatoEmTerminal } from '../../shared/cartoes/contato-em-terminal';
import { SecaoEmDuasVisoes } from '../../shared/secao-em-duas-visoes/secao-em-duas-visoes';
import { CONTEUDO_CONTATO } from './contato.conteudo';

const AVISO_COPIADO = 'E-mail copiado';
const AVISO_FALHOU = 'Não foi possível copiar o e-mail';

// O h1 da página vem da casca. A seção tem duas visões do mesmo conteúdo: cartão e código.
@Component({
  selector: 'app-contato',
  imports: [SecaoEmDuasVisoes, ContatoEmTerminal],
  template: `
    <app-secao-em-duas-visoes [conteudo]="conteudo" tema="contato">
      <ng-template #cartao><app-contato-em-terminal /></ng-template>
      <ng-template #extraDoCodigo>
        <div class="acoes">
          @if (podeCopiar()) {
            <button type="button" class="copiar" (click)="copiarEmail()">Copiar e-mail</button>
          }
          <span class="aviso" role="status" aria-live="polite">{{ aviso() }}</span>
        </div>
      </ng-template>
    </app-secao-em-duas-visoes>
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
