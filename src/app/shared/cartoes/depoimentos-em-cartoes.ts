import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

import { RECOMENDACOES } from '../../core/perfil';
import { FraseQueSeAcende } from '../movimento/frase-que-se-acende';

const dataEmPortugues = ([ano, mes, dia]: readonly [number, number, number]): string =>
  `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;

/** As recomendações recebidas no LinkedIn, com quem escreveu, o cargo, a relação e a data. */
@Component({
  selector: 'app-depoimentos-em-cartoes',
  imports: [NgOptimizedImage, FraseQueSeAcende],
  template: `
    <div class="cabecalho-de-secao">
      <p class="eyebrow">Recomendações</p>
      <h3 class="titulo-de-secao" appFraseQueSeAcende>O que dizem de quem trabalhou comigo.</h3>
    </div>
    <ul class="lista grade-de-cartoes">
      @for (r of recomendacoes; track r.autora) {
        <li class="casca-dupla">
          <figure class="miolo miolo-de-cartao">
            <blockquote>
              @for (paragrafo of r.paragrafos; track $index) {
                <p>{{ paragrafo }}</p>
              }
            </blockquote>
            <figcaption>
              <img [ngSrc]="r.foto.src" width="96" height="96" [alt]="r.foto.alt" />
              <span class="quem">
                <a [href]="r.linkedin" target="_blank" rel="noopener noreferrer" class="link-mais">
                  {{ r.autora }}<span class="somente-leitores"> (abre em nova aba)</span>
                </a>
                <span class="apoio">{{ r.cargo }} · {{ r.relacao }} · {{ r.data }}</span>
              </span>
            </figcaption>
          </figure>
        </li>
      }
    </ul>
  `,
  styleUrl: './depoimentos-em-cartoes.scss',
})
export class DepoimentosEmCartoes {
  protected readonly recomendacoes = RECOMENDACOES.map((r) => ({
    ...r,
    data: dataEmPortugues(r.data),
  }));
}
