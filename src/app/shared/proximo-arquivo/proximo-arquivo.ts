import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

import { proximaSecao } from '../../core/proxima-secao';

/**
 * Comentário clicável no fim do editor: `// Próximo: Diferenciais.java →`. Descobre a seção
 * seguinte pela URL, na ordem da árvore; não aparece no Início nem na última seção.
 */
@Component({
  selector: 'app-proximo-arquivo',
  imports: [RouterLink],
  template: `
    @if (proxima(); as secao) {
      <a class="proximo" [routerLink]="['/', secao.slug]">// Próximo: {{ secao.arquivo }} →</a>
    }
  `,
  styleUrl: './proximo-arquivo.scss',
})
export class ProximoArquivo {
  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((evento) => evento instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly proxima = computed(() => proximaSecao(this.url()));
}
