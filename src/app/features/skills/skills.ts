import { Component } from '@angular/core';

import { StackEmGradle } from '../../shared/cartoes/stack-em-gradle';
import { SecaoEmDuasVisoes } from '../../shared/secao-em-duas-visoes/secao-em-duas-visoes';
import { CONTEUDO_SKILLS } from './skills.conteudo';

// O h1 da página vem da casca. A seção tem duas visões do mesmo conteúdo: cartão e código.
@Component({
  selector: 'app-skills',
  imports: [SecaoEmDuasVisoes, StackEmGradle],
  template: `
    <app-secao-em-duas-visoes [conteudo]="conteudo" tema="stack">
      <ng-template #cartao><app-stack-em-gradle /></ng-template>
    </app-secao-em-duas-visoes>
  `,
})
export class Skills {
  protected readonly conteudo = CONTEUDO_SKILLS;
}
