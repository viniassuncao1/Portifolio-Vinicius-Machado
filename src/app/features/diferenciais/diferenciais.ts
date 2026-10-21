import { Component } from '@angular/core';

import { DiferenciaisEmCartoes } from '../../shared/cartoes/diferenciais-em-cartoes';
import { SecaoEmDuasVisoes } from '../../shared/secao-em-duas-visoes/secao-em-duas-visoes';
import { CONTEUDO_DIFERENCIAIS } from './diferenciais.conteudo';

// O h1 da página vem da casca. A seção tem duas visões do mesmo conteúdo: cartão e código.
@Component({
  selector: 'app-diferenciais',
  imports: [SecaoEmDuasVisoes, DiferenciaisEmCartoes],
  template: `
    <app-secao-em-duas-visoes [conteudo]="conteudo" tema="sobre">
      <ng-template #cartao><app-diferenciais-em-cartoes /></ng-template>
    </app-secao-em-duas-visoes>
  `,
})
export class Diferenciais {
  protected readonly conteudo = CONTEUDO_DIFERENCIAIS;
}
