import { Component, computed, inject } from '@angular/core';

import { JanelaDePreview } from '../../core/janela-de-preview';
import type { PreviewDeProjeto } from '../../core/previews';
import { SECOES } from '../../core/secoes';
import { Icone } from '../icone/icone';

/**
 * ▶ de executar na calha do editor, na linha da declaração da classe, como no IntelliJ: abre o site
 * do projeto na janela de preview. Só aparece nas rotas de projetos que têm site (`core/previews.ts`).
 * É um botão de verdade, com o nome da seção ("Executar Projeto 2") e foco visível.
 */
@Component({
  selector: 'app-botao-executar',
  imports: [Icone],
  template: `
    @if (janela.previewDaRota(); as preview) {
      <button
        type="button"
        class="executar"
        [attr.aria-label]="'Executar ' + titulo()"
        (click)="abrir(preview, $event)"
      >
        <app-icone nome="executar" />
      </button>
    }
  `,
  styleUrl: './botao-executar.scss',
})
export class BotaoExecutar {
  protected readonly janela = inject(JanelaDePreview);
  protected readonly titulo = computed(
    () => SECOES.find((secao) => secao.slug === this.janela.slugAtual())?.titulo ?? 'projeto',
  );

  protected abrir(preview: PreviewDeProjeto, evento: Event): void {
    this.janela.abrir(preview, evento.currentTarget as HTMLElement);
  }
}
