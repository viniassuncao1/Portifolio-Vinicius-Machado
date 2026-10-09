import { Component, ElementRef, input, output, signal, viewChildren } from '@angular/core';
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

  /** No Início a primeira seção aparece destacada e expandida, sem `aria-current`. */
  readonly noInicio = input(false);

  /** Item que entra na ordem de Tab (roving tabindex): o atual ou o último focado. */
  protected readonly indiceFocavel = signal(0);

  /** Emitido quando o visitante escolhe uma seção (a gaveta usa para se fechar). */
  readonly secaoEscolhida = output<void>();

  focarPrimeiroItem(): void {
    this.itens()[0]?.nativeElement.focus();
  }

  protected aoAtivar(indice: number, ativo: boolean): void {
    if (ativo) this.indiceFocavel.set(indice);
  }

  /** Setas, Home e End movem o foco entre os itens; Enter abre o link focado. */
  protected aoTeclar(evento: KeyboardEvent): void {
    const ultimo = this.secoes.length - 1;
    const destino = {
      ArrowDown: Math.min(this.indiceFocavel() + 1, ultimo),
      ArrowUp: Math.max(this.indiceFocavel() - 1, 0),
      Home: 0,
      End: ultimo,
    }[evento.key];
    if (destino === undefined) return;

    evento.preventDefault();
    this.indiceFocavel.set(destino);
    this.itens()[destino]?.nativeElement.focus();
  }
}
