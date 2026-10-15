import { Component, computed, inject } from '@angular/core';

import { JanelaDePreview } from '../../core/janela-de-preview';
import { LINKS_EXTERNOS_DE_PROJETO } from '../../core/previews';
import type { PreviewDeProjeto } from '../../core/previews';

/**
 * Code vision do IntelliJ acima da declaração da classe, nos projetos com site:
 * `▶ Executar · Ver o site ao vivo` abre a janela de preview (o mesmo efeito do ▶ da calha).
 * Nos projetos sem site mas com endereço externo (`LINKS_EXTERNOS_DE_PROJETO`), vira um link para
 * ele, como `▶ Executar · Ver no GitHub`, aberto em nova aba. Só aparece nas rotas de
 * `core/previews.ts`.
 */
@Component({
  selector: 'app-visao-de-codigo',
  template: `
    @if (janela.previewDaRota(); as preview) {
      <button type="button" class="visao" (click)="abrir(preview, $event)">
        <span aria-hidden="true">▶</span> Executar · Ver o site ao vivo
      </button>
    } @else if (linkExterno(); as link) {
      <a class="visao" [href]="link.url" target="_blank" rel="noopener noreferrer">
        <span aria-hidden="true">▶</span> Executar · {{ link.rotulo }}
        <span class="aviso-nova-aba"> (abre em nova aba)</span>
      </a>
    }
  `,
  styleUrl: './visao-de-codigo.scss',
})
export class VisaoDeCodigo {
  protected readonly janela = inject(JanelaDePreview);
  protected readonly linkExterno = computed(
    () => LINKS_EXTERNOS_DE_PROJETO[this.janela.slugAtual()],
  );

  protected abrir(preview: PreviewDeProjeto, evento: Event): void {
    this.janela.abrir(preview, evento.currentTarget as HTMLElement);
  }
}
