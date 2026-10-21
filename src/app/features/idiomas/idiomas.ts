import { Component } from '@angular/core';

import { IdiomasEmCartoes } from '../../shared/cartoes/idiomas-em-cartoes';
import { SecaoEmDuasVisoes } from '../../shared/secao-em-duas-visoes/secao-em-duas-visoes';
import { CONTEUDO_IDIOMAS } from './idiomas.conteudo';

// O h1 da página vem da casca. A seção tem duas visões do mesmo conteúdo: cartão e código.
@Component({
  selector: 'app-idiomas',
  imports: [SecaoEmDuasVisoes, IdiomasEmCartoes],
  template: `
    <app-secao-em-duas-visoes [conteudo]="conteudo" tema="formacao">
      <ng-template #cartao><app-idiomas-em-cartoes /></ng-template>
    </app-secao-em-duas-visoes>
  `,
})
export class Idiomas {
  protected readonly conteudo = CONTEUDO_IDIOMAS;
}
