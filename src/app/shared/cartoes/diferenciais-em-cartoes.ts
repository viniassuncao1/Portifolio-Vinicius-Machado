import { Component } from '@angular/core';

import { DIFERENCIAIS } from '../../core/perfil';
import { FraseQueSeAcende } from '../movimento/frase-que-se-acende';

/** Os diferenciais: o texto do Javadoc num cartão grande e os dados de `DadosPessoais` ao lado. */
@Component({
  selector: 'app-diferenciais-em-cartoes',
  imports: [FraseQueSeAcende],
  template: `
    <div class="cabecalho-de-secao">
      <p class="eyebrow">Diferenciais</p>
      <h3 class="titulo-de-secao" appFraseQueSeAcende>
        Mineiro em Brasília, curioso e disposto a aprender.
      </h3>
    </div>
    <div class="bento">
      <article class="casca-dupla texto">
        <div class="miolo miolo-de-cartao">
          <p class="citacao">{{ d.texto }}</p>
        </div>
      </article>
      <ul class="dados grade-de-cartoes" aria-label="Dados pessoais">
        <li class="casca-dupla">
          <div class="miolo miolo-de-cartao">
            <span class="rotulo-mono">origem</span>
            <h4>{{ d.origem }}</h4>
          </div>
        </li>
        <li class="casca-dupla">
          <div class="miolo miolo-de-cartao">
            <span class="rotulo-mono">anos em {{ d.cidade }}</span>
            <h4 class="numero">{{ d.anosNaCidade }}</h4>
          </div>
        </li>
        @for (traco of d.tracos; track traco) {
          <li class="casca-dupla">
            <div class="miolo miolo-de-cartao">
              <span class="rotulo-mono">traço</span>
              <h4>{{ traco }}</h4>
            </div>
          </li>
        }
      </ul>
    </div>
  `,
  styleUrl: './diferenciais-em-cartoes.scss',
})
export class DiferenciaisEmCartoes {
  protected readonly d = DIFERENCIAIS;
}
