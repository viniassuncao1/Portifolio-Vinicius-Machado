import { Component } from '@angular/core';

import { FormacaoEIdiomas } from '../../shared/cartoes/formacao-e-idiomas';
import { SecaoEmDuasVisoes } from '../../shared/secao-em-duas-visoes/secao-em-duas-visoes';
import { CONTEUDO_FORMACAO } from './formacao.conteudo';

// O h1 da página vem da casca. A seção tem duas visões do mesmo conteúdo: cartão e código.
@Component({
  selector: 'app-formacao',
  imports: [SecaoEmDuasVisoes, FormacaoEIdiomas],
  template: `
    <app-secao-em-duas-visoes [conteudo]="conteudo" tema="formacao">
      <ng-template #cartao><app-formacao-e-idiomas /></ng-template>
    </app-secao-em-duas-visoes>
  `,
})
export class Formacao {
  protected readonly conteudo = CONTEUDO_FORMACAO;
}
