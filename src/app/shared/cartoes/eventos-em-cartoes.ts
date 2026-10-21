import { Component } from '@angular/core';

import { EVENTOS } from '../../core/perfil';
import { FraseQueSeAcende } from '../movimento/frase-que-se-acende';

/** Os eventos de tecnologia de que o Vinicius participou, com o número de vezes. */
@Component({
  selector: 'app-eventos-em-cartoes',
  imports: [FraseQueSeAcende],
  template: `
    <div class="cabecalho-de-secao">
      <p class="eyebrow">Eventos</p>
      <h3 class="titulo-de-secao" appFraseQueSeAcende>
        Onde a comunidade de tecnologia se encontra.
      </h3>
    </div>
    <ul class="lista grade-de-cartoes">
      @for (evento of eventos; track evento.nome) {
        <li class="casca-dupla">
          <div class="miolo miolo-de-cartao">
            <span class="rotulo-mono">{{ evento.vezes }}× presente</span>
            <h4>{{ evento.nome }}</h4>
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
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    @media (max-width: 767px) {
      .lista {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class EventosEmCartoes {
  protected readonly eventos = EVENTOS;
}
