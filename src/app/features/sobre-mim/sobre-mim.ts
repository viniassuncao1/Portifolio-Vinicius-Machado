import { Component } from '@angular/core';

import { SobreEmCartoes } from '../../shared/cartoes/sobre-em-cartoes';
import { SecaoEmDuasVisoes } from '../../shared/secao-em-duas-visoes/secao-em-duas-visoes';
import { CONTEUDO_SOBRE_MIM } from './sobre-mim.conteudo';

// O h1 da página vem da casca. A seção tem duas visões do mesmo conteúdo: cartão e código.
@Component({
  selector: 'app-sobre-mim',
  imports: [SecaoEmDuasVisoes, SobreEmCartoes],
  template: `
    <app-secao-em-duas-visoes [conteudo]="conteudo" tema="sobre">
      <ng-template #cartao><app-sobre-em-cartoes [completo]="true" /></ng-template>
    </app-secao-em-duas-visoes>
  `,
})
export class SobreMim {
  protected readonly conteudo = CONTEUDO_SOBRE_MIM;
}
