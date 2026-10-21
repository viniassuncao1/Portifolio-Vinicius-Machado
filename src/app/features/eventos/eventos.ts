import { Component } from '@angular/core';

import { EventosEmCartoes } from '../../shared/cartoes/eventos-em-cartoes';
import { SecaoEmDuasVisoes } from '../../shared/secao-em-duas-visoes/secao-em-duas-visoes';
import { CONTEUDO_EVENTOS } from './eventos.conteudo';

// O h1 da página vem da casca. A seção tem duas visões do mesmo conteúdo: cartão e código.
@Component({
  selector: 'app-eventos',
  imports: [SecaoEmDuasVisoes, EventosEmCartoes],
  template: `
    <app-secao-em-duas-visoes [conteudo]="conteudo" tema="formacao">
      <ng-template #cartao><app-eventos-em-cartoes /></ng-template>
    </app-secao-em-duas-visoes>
  `,
})
export class Eventos {
  protected readonly conteudo = CONTEUDO_EVENTOS;
}
