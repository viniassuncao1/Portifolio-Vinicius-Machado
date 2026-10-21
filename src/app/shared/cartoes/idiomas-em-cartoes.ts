import { Component } from '@angular/core';

import { IDIOMAS } from '../../core/perfil';
import { FraseQueSeAcende } from '../movimento/frase-que-se-acende';

@Component({
  selector: 'app-idiomas-em-cartoes',
  imports: [FraseQueSeAcende],
  template: `
    <div class="cabecalho-de-secao">
      <p class="eyebrow">Idiomas</p>
      <h3 class="titulo-de-secao" appFraseQueSeAcende>Os idiomas que falo e o nível de cada um.</h3>
    </div>
    <ul class="lista grade-de-cartoes">
      @for (item of idiomas; track item.idioma) {
        <li class="casca-dupla">
          <div class="miolo miolo-de-cartao">
            <span class="rotulo-mono">{{ item.nivel }}</span>
            <h4>{{ item.idioma }}</h4>
          </div>
        </li>
      }
    </ul>
  `,
  styles: `
    :host {
      display: block;
    }

    .lista {
      grid-template-columns: repeat(2, minmax(0, 18rem));
    }

    @media (max-width: 600px) {
      .lista {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class IdiomasEmCartoes {
  protected readonly idiomas = IDIOMAS;
}
