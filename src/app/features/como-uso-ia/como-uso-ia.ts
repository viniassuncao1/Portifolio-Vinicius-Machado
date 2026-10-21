import { Component } from '@angular/core';

import { IaEmCartao } from '../../shared/cartoes/ia-em-cartao';
import { SecaoEmDuasVisoes } from '../../shared/secao-em-duas-visoes/secao-em-duas-visoes';
import { CONTEUDO_COMO_USO_IA } from './como-uso-ia.conteudo';

// O h1 da página vem da casca. A seção tem duas visões do mesmo conteúdo: cartão e código.
@Component({
  selector: 'app-como-uso-ia',
  imports: [SecaoEmDuasVisoes, IaEmCartao],
  template: `
    <app-secao-em-duas-visoes [conteudo]="conteudo" tema="stack">
      <ng-template #cartao><app-ia-em-cartao /></ng-template>
    </app-secao-em-duas-visoes>
  `,
})
export class ComoUsoIa {
  protected readonly conteudo = CONTEUDO_COMO_USO_IA;
}
