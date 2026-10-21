import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PERFIL, SOBRE } from '../../../core/perfil';

/** O Sobre Mim em quatro afirmações, num bento assimétrico (a primeira ocupa duas colunas). */
@Component({
  selector: 'app-sobre-em-cartoes',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './sobre-em-cartoes.html',
  styleUrl: './sobre-em-cartoes.scss',
})
export class SobreEmCartoes {
  protected readonly perfil = PERFIL;
  protected readonly itens = SOBRE;
}
