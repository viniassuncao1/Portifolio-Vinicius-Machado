import { Component, computed, inject } from '@angular/core';

import { AVISO_DE_EMAIL_COPIADO, CopiarEmail } from '../../core/copiar-email';
import { ENDERECO_DO_CURRICULO, ENDERECO_DO_GITHUB, ENDERECO_DO_LINKEDIN } from '../../core/perfil';

/**
 * Barra de ações de quem recruta: baixar o currículo, abrir o LinkedIn e o GitHub e copiar o
 * e-mail, com a confirmação numa região `aria-live`. Os links de sites abrem em nova aba.
 */
@Component({
  selector: 'app-acoes-do-recrutador',
  templateUrl: './acoes-do-recrutador.html',
  styleUrl: './acoes-do-recrutador.scss',
})
export class AcoesDoRecrutador {
  protected readonly email = inject(CopiarEmail);
  /** O botão confirma a cópia no próprio rótulo; a região `aria-live` anuncia o mesmo a leitores de tela. */
  protected readonly copiado = computed(() => this.email.aviso() === AVISO_DE_EMAIL_COPIADO);
  protected readonly curriculo = ENDERECO_DO_CURRICULO;
  protected readonly linkedin = ENDERECO_DO_LINKEDIN;
  protected readonly github = ENDERECO_DO_GITHUB;
}
