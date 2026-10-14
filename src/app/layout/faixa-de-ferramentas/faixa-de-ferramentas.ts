import { Component, input, output } from '@angular/core';

import { Icone } from '../../shared/icone/icone';

/**
 * Faixa de ferramentas à esquerda, só no desktop. Projeto mostra e esconde o painel do projeto;
 * Commit e Estrutura só imitam a IDE e ficam fora da leitura e do foco.
 */
@Component({
  selector: 'app-faixa-de-ferramentas',
  imports: [Icone],
  templateUrl: './faixa-de-ferramentas.html',
  styleUrl: './faixa-de-ferramentas.scss',
})
export class FaixaDeFerramentas {
  readonly painelVisivel = input.required<boolean>();
  readonly alternarPainel = output<void>();
}
