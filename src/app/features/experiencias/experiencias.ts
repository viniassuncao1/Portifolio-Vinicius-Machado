import { Component } from '@angular/core';

import { ExperienciaEmGrafo } from '../../shared/cartoes/experiencia-em-grafo';
import { SecaoEmDuasVisoes } from '../../shared/secao-em-duas-visoes/secao-em-duas-visoes';
import { CONTEUDO_EXPERIENCIAS } from './experiencias.conteudo';

// O h1 da página vem da casca. A seção tem duas visões do mesmo conteúdo: cartão e código.
@Component({
  selector: 'app-experiencias',
  imports: [SecaoEmDuasVisoes, ExperienciaEmGrafo],
  template: `
    <app-secao-em-duas-visoes [conteudo]="conteudo" tema="formacao">
      <ng-template #cartao><app-experiencia-em-grafo [completo]="true" /></ng-template>
    </app-secao-em-duas-visoes>
  `,
})
export class Experiencias {
  protected readonly conteudo = CONTEUDO_EXPERIENCIAS;
}
