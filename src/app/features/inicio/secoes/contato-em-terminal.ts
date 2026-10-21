import { Component, inject } from '@angular/core';

import { CopiarEmail } from '../../../core/copiar-email';
import { CONTATOS, ENDERECO_DO_CURRICULO } from '../../../core/perfil';
import { AcoesDoRecrutador } from '../../../shared/acoes-do-recrutador/acoes-do-recrutador';

/** O contato num terminal: o comando que "roda" e a saída, que são os links reais. Funciona sem o visual. */
@Component({
  selector: 'app-contato-em-terminal',
  imports: [AcoesDoRecrutador],
  templateUrl: './contato-em-terminal.html',
  styleUrl: './contato-em-terminal.scss',
})
export class ContatoEmTerminal {
  protected readonly email = inject(CopiarEmail);
  protected readonly contatos = CONTATOS;
  protected readonly curriculo = ENDERECO_DO_CURRICULO;
}
