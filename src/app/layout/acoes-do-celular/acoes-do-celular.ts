import { Component, ElementRef, input, output, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { Icone } from '../../shared/icone/icone';

/**
 * Barra de ações do celular (abaixo de 768px): Seções (abre a gaveta com a árvore), Projetos e
 * Contato, ao alcance do polegar. No desktop não existe: a faixa de ferramentas e a barra superior
 * fazem esse papel.
 */
@Component({
  selector: 'app-acoes-do-celular',
  imports: [Icone, RouterLink, RouterLinkActive],
  templateUrl: './acoes-do-celular.html',
  styleUrl: './acoes-do-celular.scss',
})
export class AcoesDoCelular {
  private readonly botaoSecoes = viewChild.required<ElementRef<HTMLButtonElement>>('botaoSecoes');

  readonly gavetaAberta = input(false);
  readonly alternarGaveta = output<void>();

  /** Devolve o foco ao botão Seções quando a gaveta fecha. */
  focarSecoes(): void {
    this.botaoSecoes().nativeElement.focus();
  }
}
