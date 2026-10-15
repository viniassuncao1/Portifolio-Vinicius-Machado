import { Component, inject } from '@angular/core';

import { JanelaDePreview } from '../../core/janela-de-preview';
import type { PreviewDeProjeto } from '../../core/previews';

/**
 * Code vision do IntelliJ acima da declaração da classe, nos projetos com site:
 * `▶ Executar · Ver o site ao vivo` abre a janela de preview (o mesmo efeito do ▶ da calha).
 * Só aparece nas rotas de `core/previews.ts`.
 */
@Component({
  selector: 'app-visao-de-codigo',
  template: `
    @if (janela.previewDaRota(); as preview) {
      <button type="button" class="visao" (click)="abrir(preview, $event)">
        <span aria-hidden="true">▶</span> Executar · Ver o site ao vivo
      </button>
    }
  `,
  styleUrl: './visao-de-codigo.scss',
})
export class VisaoDeCodigo {
  protected readonly janela = inject(JanelaDePreview);

  protected abrir(preview: PreviewDeProjeto, evento: Event): void {
    this.janela.abrir(preview, evento.currentTarget as HTMLElement);
  }
}
