import { Component, output, viewChild } from '@angular/core';

import { GlifoFechar } from '../../shared/glifo-fechar/glifo-fechar';
import { ArvoreDeSecoes } from '../arvore-de-secoes/arvore-de-secoes';

@Component({
  selector: 'app-painel-lateral',
  imports: [ArvoreDeSecoes, GlifoFechar],
  templateUrl: './painel-lateral.html',
  styleUrl: './painel-lateral.scss',
})
export class PainelLateral {
  private readonly arvore = viewChild.required(ArvoreDeSecoes);

  /** Repassa a escolha de uma seção para a casca fechar a gaveta. */
  readonly secaoEscolhida = output<void>();

  /** Pedido do botão "Fechar seções" da gaveta (só aparece abaixo de 768px). */
  readonly fecharGaveta = output<void>();

  focarPrimeiroItem(): void {
    this.arvore().focarPrimeiroItem();
  }
}
