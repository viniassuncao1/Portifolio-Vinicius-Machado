import { Component, computed, inject } from '@angular/core';

import { VisaoDoConteudoEscolhida } from '../../core/visao-do-conteudo';

/**
 * Troca entre as duas visões do mesmo conteúdo: o cartão (que se lê em segundos) e o código (o
 * arquivo Java da IDE). A escolha fica lembrada pelo navegador.
 */
@Component({
  selector: 'app-alternar-visao',
  template: `
    <button
      type="button"
      class="alternar"
      [attr.aria-pressed]="emCodigo()"
      (click)="visao.alternar()"
    >
      <span aria-hidden="true">{{ emCodigo() ? '▦' : '{ }' }}</span>
      {{ emCodigo() ? 'Ver como cartão' : 'Ver como código' }}
    </button>
  `,
  styleUrl: './alternar-visao.scss',
})
export class AlternarVisao {
  protected readonly visao = inject(VisaoDoConteudoEscolhida);
  protected readonly emCodigo = computed(() => this.visao.visao() === 'codigo');
}
