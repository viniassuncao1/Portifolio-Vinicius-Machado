import { Component, inject, input, output } from '@angular/core';

import { PainelDoGit } from '../../core/painel-do-git';

import { Icone } from '../../shared/icone/icone';

/**
 * Faixa de ferramentas à esquerda, só no desktop. Projeto mostra e esconde o painel do projeto e
 * Commit abre e fecha o painel do Git; Estrutura só imita a IDE e fica fora da leitura e do foco.
 */
@Component({
  selector: 'app-faixa-de-ferramentas',
  imports: [Icone],
  templateUrl: './faixa-de-ferramentas.html',
  styleUrl: './faixa-de-ferramentas.scss',
})
export class FaixaDeFerramentas {
  protected readonly git = inject(PainelDoGit);
  readonly painelVisivel = input.required<boolean>();
  readonly alternarPainel = output<void>();
}
