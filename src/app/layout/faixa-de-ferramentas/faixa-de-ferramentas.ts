import { Component, computed, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';

import { AbasAbertas, SLUG_DO_REPOSITORIO } from '../../core/abas-abertas';
import { Icone } from '../../shared/icone/icone';

/**
 * Faixa de ferramentas à esquerda, só no desktop. Projeto mostra e esconde o painel do projeto e
 * Commit leva à página do repositório (`/repositorio`); Estrutura só imita a IDE e fica fora da leitura e do foco.
 */
@Component({
  selector: 'app-faixa-de-ferramentas',
  imports: [Icone],
  templateUrl: './faixa-de-ferramentas.html',
  styleUrl: './faixa-de-ferramentas.scss',
})
export class FaixaDeFerramentas {
  private readonly router = inject(Router);
  private readonly abas = inject(AbasAbertas);
  /** Commit marca `aria-current` enquanto a página do repositório está aberta. */
  protected readonly noRepositorio = computed(
    () => this.abas.ativa()?.slug === SLUG_DO_REPOSITORIO,
  );
  readonly painelVisivel = input.required<boolean>();
  readonly alternarPainel = output<void>();

  protected abrirRepositorio(): void {
    void this.router.navigateByUrl(`/${SLUG_DO_REPOSITORIO}`);
  }
}
