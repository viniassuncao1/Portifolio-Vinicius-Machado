import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PROJETOS } from '../../../core/projetos';
import { CapaEmCodigoDoProjeto } from '../../../shared/capa-em-codigo/capa-em-codigo';

/** Os seis projetos da vitrine, num bento: dois grandes em cima e quatro menores embaixo. */
@Component({
  selector: 'app-projetos-em-destaque',
  imports: [RouterLink, NgOptimizedImage, CapaEmCodigoDoProjeto],
  templateUrl: './projetos-em-destaque.html',
  styleUrl: './projetos-em-destaque.scss',
})
export class ProjetosEmDestaque {
  protected readonly projetos = PROJETOS;
}
