import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { COMO_USO_IA } from '../../core/perfil';
import { FraseQueSeAcende } from '../movimento/frase-que-se-acende';

/** Como o Vinicius usa IA: a posição, as ferramentas e o método, e o caminho para o estudo do projeto 2. */
@Component({
  selector: 'app-ia-em-cartao',
  imports: [RouterLink, FraseQueSeAcende],
  template: `
    <div class="cabecalho-de-secao">
      <p class="eyebrow">Como uso a IA</p>
      <h3 class="titulo-de-secao" appFraseQueSeAcende>IA é parte do trabalho, não modismo.</h3>
    </div>
    <div class="bento">
      <article class="casca-dupla">
        <div class="miolo miolo-de-cartao">
          <p class="citacao">{{ ia.texto }}</p>
        </div>
      </article>
      <div class="lateral">
        <article class="casca-dupla">
          <div class="miolo miolo-de-cartao">
            <span class="rotulo-mono">ferramentas</span>
            <ul class="chips" aria-label="Ferramentas">
              @for (ferramenta of ia.ferramentas; track ferramenta) {
                <li class="chip">{{ ferramenta }}</li>
              }
            </ul>
          </div>
        </article>
        <article class="casca-dupla">
          <div class="miolo miolo-de-cartao">
            <span class="rotulo-mono">metodologia</span>
            <h4>{{ ia.metodologia }}</h4>
            <a routerLink="/projeto-2" class="link-mais">
              Veja o estudo no Projeto 2 <span aria-hidden="true">→</span>
            </a>
          </div>
        </article>
      </div>
    </div>
  `,
  styleUrl: './ia-em-cartao.scss',
})
export class IaEmCartao {
  protected readonly ia = COMO_USO_IA;
}
