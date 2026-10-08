import { Component, ElementRef, output, viewChildren } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { SECOES } from '../../core/secoes';
import { Icone } from '../../shared/icone/icone';

@Component({
  selector: 'app-arvore-de-secoes',
  imports: [RouterLink, RouterLinkActive, Icone],
  templateUrl: './arvore-de-secoes.html',
  styleUrl: './arvore-de-secoes.scss',
})
export class ArvoreDeSecoes {
  protected readonly secoes = SECOES;
  private readonly itens = viewChildren<ElementRef<HTMLAnchorElement>>('item');

  /** Emitido quando o visitante escolhe uma seção (a gaveta usa para se fechar). */
  readonly secaoEscolhida = output<void>();

  focarPrimeiroItem(): void {
    this.itens()[0]?.nativeElement.focus();
  }
}
