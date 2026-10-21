import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PERFIL, SOBRE } from '../../core/perfil';
import { FraseQueSeAcende } from '../movimento/frase-que-se-acende';

/** O Sobre Mim em quatro afirmações, num bento assimétrico (a primeira ocupa duas colunas). */
@Component({
  selector: 'app-sobre-em-cartoes',
  imports: [FraseQueSeAcende, NgOptimizedImage, RouterLink],
  templateUrl: './sobre-em-cartoes.html',
  styleUrl: './sobre-em-cartoes.scss',
})
export class SobreEmCartoes {
  /** Na página da seção o atalho para ela mesma não aparece. */
  readonly completo = input(false);
  protected readonly perfil = PERFIL;
  protected readonly itens = SOBRE;
}
