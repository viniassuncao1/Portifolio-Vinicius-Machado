import { Component } from '@angular/core';

import { ProjetoEmCartao } from '../../shared/cartoes/projeto-em-cartao';
import { SecaoEmDuasVisoes } from '../../shared/secao-em-duas-visoes/secao-em-duas-visoes';
import { CONTEUDO_PROJETO_5 } from './projeto-5.conteudo';

// O h1 da página vem da casca; o ▶ da calha (no editor) e a janela de preview são da casca. A seção tem duas visões do mesmo conteúdo: cartão e código.
@Component({
  selector: 'app-projeto-5',
  imports: [SecaoEmDuasVisoes, ProjetoEmCartao],
  template: `
    <app-secao-em-duas-visoes [conteudo]="conteudo" tema="projetos">
      <ng-template #cartao><app-projeto-em-cartao secao="projeto-5" /></ng-template>
    </app-secao-em-duas-visoes>
  `,
})
export class Projeto5 {
  protected readonly conteudo = CONTEUDO_PROJETO_5;
}
