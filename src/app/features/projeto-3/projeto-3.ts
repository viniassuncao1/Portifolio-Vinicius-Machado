import { Component } from '@angular/core';

import { ProjetoEmCartao } from '../../shared/cartoes/projeto-em-cartao';
import { SecaoEmDuasVisoes } from '../../shared/secao-em-duas-visoes/secao-em-duas-visoes';
import { CONTEUDO_PROJETO_3 } from './projeto-3.conteudo';

// O h1 da página vem da casca; o ▶ da calha (no editor) leva ao repositório no GitHub. A seção tem duas visões do mesmo conteúdo: cartão e código.
@Component({
  selector: 'app-projeto-3',
  imports: [SecaoEmDuasVisoes, ProjetoEmCartao],
  template: `
    <app-secao-em-duas-visoes [conteudo]="conteudo" tema="projetos">
      <ng-template #cartao><app-projeto-em-cartao secao="projeto-3" /></ng-template>
    </app-secao-em-duas-visoes>
  `,
})
export class Projeto3 {
  protected readonly conteudo = CONTEUDO_PROJETO_3;
}
