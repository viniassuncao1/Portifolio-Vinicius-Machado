import { Component } from '@angular/core';

import { CURSOS } from '../../core/perfil';
import { FraseQueSeAcende } from '../movimento/frase-que-se-acende';

const dataEmPortugues = ([ano, mes, dia]: readonly [number, number, number]): string =>
  `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;

/** Os cursos concluídos, do mais recente para o mais antigo, com o total de horas. */
@Component({
  selector: 'app-certificacoes-em-cartoes',
  imports: [FraseQueSeAcende],
  template: `
    <div class="cabecalho-de-secao">
      <p class="eyebrow">Certificações</p>
      <h3 class="titulo-de-secao" appFraseQueSeAcende>
        {{ cursos.length }} cursos, {{ totalDeHoras }} horas, da web ao Spring Boot.
      </h3>
    </div>
    <ol class="lista grade-de-cartoes">
      @for (curso of cursos; track curso.variavel) {
        <li class="casca-dupla">
          <div class="miolo miolo-de-cartao">
            <span class="rotulo-mono">{{ curso.data }}</span>
            <h4>{{ curso.nome }}</h4>
            <p class="apoio">{{ curso.horas }} horas</p>
          </div>
        </li>
      }
    </ol>
  `,
  styleUrl: './certificacoes-em-cartoes.scss',
})
export class CertificacoesEmCartoes {
  protected readonly cursos = CURSOS.map((curso) => ({
    ...curso,
    data: dataEmPortugues(curso.concluidoEm),
  }));
  protected readonly totalDeHoras = CURSOS.reduce((soma, curso) => soma + curso.horas, 0);
}
