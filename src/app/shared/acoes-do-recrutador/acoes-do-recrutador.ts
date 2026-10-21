import { Component, inject } from '@angular/core';

import { CopiarEmail } from '../../core/copiar-email';
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
  protected readonly curriculo = ENDERECO_DO_CURRICULO;
  protected readonly linkedin = ENDERECO_DO_LINKEDIN;
  protected readonly github = ENDERECO_DO_GITHUB;
}
