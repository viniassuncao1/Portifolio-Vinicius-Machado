import { Component } from '@angular/core';

import { DepoimentosEmCartoes } from '../../shared/cartoes/depoimentos-em-cartoes';
import { SecaoEmDuasVisoes } from '../../shared/secao-em-duas-visoes/secao-em-duas-visoes';
import { CONTEUDO_DEPOIMENTOS } from './depoimentos.conteudo';

// O h1 da página vem da casca. A seção tem duas visões do mesmo conteúdo: cartão e código.
@Component({
  selector: 'app-depoimentos',
  imports: [SecaoEmDuasVisoes, DepoimentosEmCartoes],
  template: `
    <app-secao-em-duas-visoes [conteudo]="conteudo" tema="contato">
      <ng-template #cartao><app-depoimentos-em-cartoes /></ng-template>
    </app-secao-em-duas-visoes>
  `,
})
export class Depoimentos {
  protected readonly conteudo = CONTEUDO_DEPOIMENTOS;
}
