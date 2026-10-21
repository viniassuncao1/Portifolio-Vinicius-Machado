import { Component } from '@angular/core';

import { ProjetoEmCartao } from '../../shared/cartoes/projeto-em-cartao';
import { SecaoEmDuasVisoes } from '../../shared/secao-em-duas-visoes/secao-em-duas-visoes';
import { CONTEUDO_PROJETO_2 } from './projeto-2.conteudo';

// O h1 da página vem da casca. A seção tem duas visões do mesmo conteúdo: cartão e código.
@Component({
  selector: 'app-projeto-2',
  imports: [SecaoEmDuasVisoes, ProjetoEmCartao],
  template: `
    <app-secao-em-duas-visoes [conteudo]="conteudo" tema="projetos">
      <ng-template #cartao><app-projeto-em-cartao secao="projeto-2" /></ng-template>
    </app-secao-em-duas-visoes>
  `,
})
export class Projeto2 {
  protected readonly conteudo = CONTEUDO_PROJETO_2;
}
