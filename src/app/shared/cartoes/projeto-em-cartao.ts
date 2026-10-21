import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PROJETOS, projetoDaSecao } from '../../core/projetos';
import { CapaEmCodigoDoProjeto } from '../capa-em-codigo/capa-em-codigo';
import { FraseQueSeAcende } from '../movimento/frase-que-se-acende';

/**
 * A visão em cartão de um projeto (`/projeto-N`): a mesma informação da vitrine (captura ou capa em
 * código, papel, destaques e link), numa página só dele. O arquivo Java do projeto é a outra visão.
 */
@Component({
  selector: 'app-projeto-em-cartao',
  imports: [RouterLink, NgOptimizedImage, CapaEmCodigoDoProjeto, FraseQueSeAcende],
  templateUrl: './projeto-em-cartao.html',
  styleUrl: './projeto-em-cartao.scss',
})
export class ProjetoEmCartao {
  /** Seção do projeto: `projeto-1` a `projeto-6`. */
  readonly secao = input.required<string>();

  protected readonly projeto = computed(() => projetoDaSecao(this.secao()));
  protected readonly imagem = computed(() => this.projeto()?.imagens[0] ?? null);
  protected readonly total = PROJETOS.length;
}
