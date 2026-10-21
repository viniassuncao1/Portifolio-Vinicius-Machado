import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { contadorDoProjeto } from '../../core/projetos';
import type { Projeto } from '../../core/projetos';
import { CapaEmCodigoDoProjeto } from './capa-em-codigo';

/**
 * Cartão de um projeto: um link real para `/projetos/<slug>` (abre com clique direito, copiar
 * endereço e teclado). O clique comum é interceptado pela vitrine para abrir os detalhes com a
 * expansão a partir do cartão.
 */
@Component({
  selector: 'app-cartao-de-projeto',
  imports: [RouterLink, NgOptimizedImage, CapaEmCodigoDoProjeto],
  templateUrl: './cartao-de-projeto.html',
  styleUrl: './cartao-de-projeto.scss',
})
export class CartaoDeProjeto {
  readonly projeto = input.required<Projeto>();
  /** Cartão no centro do carrossel: os vizinhos ficam esmaecidos. */
  readonly ativo = input(true);
  /** O primeiro cartão visível carrega com prioridade; os demais só ao chegar perto. */
  readonly prioridade = input(false);
  readonly abrir = output<{ projeto: Projeto; origem: HTMLElement }>();

  protected readonly contador = computed(() => contadorDoProjeto(this.projeto()));
  protected readonly imagem = computed(() => this.projeto().imagens[0]);

  protected aoClicar(evento: MouseEvent): void {
    // Cliques com modificador (nova aba, nova janela) seguem o link normal.
    if (evento.defaultPrevented || evento.metaKey || evento.ctrlKey || evento.shiftKey) return;
    evento.preventDefault();
    this.abrir.emit({ projeto: this.projeto(), origem: evento.currentTarget as HTMLElement });
  }
}
