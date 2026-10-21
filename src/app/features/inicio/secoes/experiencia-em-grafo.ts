import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EXPERIENCIAS } from '../../../core/perfil';

/** Três destaques por experiência: o resto está em `/experiencias`. */
const DESTAQUES_POR_EXPERIENCIA = 3;

/** A experiência como um `git log --graph`: uma linha vertical, um ponto por experiência. */
@Component({
  selector: 'app-experiencia-em-grafo',
  imports: [RouterLink],
  templateUrl: './experiencia-em-grafo.html',
  styleUrl: './experiencia-em-grafo.scss',
})
export class ExperienciaEmGrafo {
  protected readonly experiencias = EXPERIENCIAS.map((experiencia) => ({
    ...experiencia,
    destaques: experiencia.destaques.slice(0, DESTAQUES_POR_EXPERIENCIA),
  }));
}
