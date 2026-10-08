import { Component, viewChild } from '@angular/core';

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

  focarPrimeiroItem(): void {
    this.arvore().focarPrimeiroItem();
  }
}
