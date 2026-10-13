import { Component, inject } from '@angular/core';

import { JanelaDePreview } from '../../core/janela-de-preview';
import type { PreviewDeProjeto } from '../../core/previews';
import { Icone } from '../icone/icone';

/**
 * Botão "Executar" abaixo do código: abre o site do projeto na janela de preview.
 * Só aparece nas rotas de projetos que têm site (`core/previews.ts`).
 */
@Component({
  selector: 'app-botao-executar',
  imports: [Icone],
  template: `
    @if (janela.previewDaRota(); as preview) {
      <button type="button" class="executar" (click)="abrir(preview, $event)">
        <app-icone nome="executar" />
        Executar
      </button>
    }
  `,
  styleUrl: './botao-executar.scss',
})
export class BotaoExecutar {
  protected readonly janela = inject(JanelaDePreview);

  protected abrir(preview: PreviewDeProjeto, evento: Event): void {
    this.janela.abrir(preview, evento.currentTarget as HTMLElement);
  }
}
