import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EXPERIENCIAS } from '../../core/perfil';
import { FraseQueSeAcende } from '../movimento/frase-que-se-acende';

/** Três destaques por experiência: o resto está em `/experiencias`. */
const DESTAQUES_POR_EXPERIENCIA = 3;

/** A experiência como um `git log --graph`: uma linha vertical, um ponto por experiência. */
@Component({
  selector: 'app-experiencia-em-grafo',
  imports: [FraseQueSeAcende, RouterLink],
  templateUrl: './experiencia-em-grafo.html',
  styleUrl: './experiencia-em-grafo.scss',
})
export class ExperienciaEmGrafo {
  /** Na página da seção (`true`) mostra todos os destaques; no Início, só os três primeiros. */
  readonly completo = input(false);

  protected readonly experiencias = computed(() =>
    EXPERIENCIAS.map((experiencia) => ({
      ...experiencia,
      destaques: this.completo()
        ? experiencia.destaques
        : experiencia.destaques.slice(0, DESTAQUES_POR_EXPERIENCIA),
    })),
  );
}
