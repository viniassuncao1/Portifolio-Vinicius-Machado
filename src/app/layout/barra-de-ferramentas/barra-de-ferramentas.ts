import { Component, ElementRef, inject, input, output, viewChild } from '@angular/core';

import { JanelaDePreview } from '../../core/janela-de-preview';
import { PainelDoGit } from '../../core/painel-do-git';
import { Icone } from '../../shared/icone/icone';

/**
 * Barra de ferramentas escura nos cinzas do design, com os ícones do design (Buscar e a branch são
 * da IntelliJ Platform, que o design não tem). Os ícones só decorativos e a branch ficam fora da
 * leitura e do foco. São botões de verdade: Buscar, Executar (nos projetos com site) e, no celular,
 * Projeto, que abre a gaveta.
 */
@Component({
  selector: 'app-barra-de-ferramentas',
  imports: [Icone],
  templateUrl: './barra-de-ferramentas.html',
  styleUrl: './barra-de-ferramentas.scss',
})
export class BarraDeFerramentas {
  private readonly botaoProjeto = viewChild.required<ElementRef<HTMLButtonElement>>('botaoProjeto');

  protected readonly janela = inject(JanelaDePreview);
  protected readonly git = inject(PainelDoGit);
  protected readonly ramo = 'master';

  /** Só o celular mostra o botão Projeto: ele abre e fecha a gaveta de seções. */
  readonly gavetaAberta = input(false);
  readonly alternarGaveta = output<void>();
  readonly buscar = output<void>();

  focarProjeto(): void {
    this.botaoProjeto().nativeElement.focus();
  }

  protected executar(evento: Event): void {
    const preview = this.janela.previewDaRota();
    if (preview) this.janela.abrir(preview, evento.currentTarget as HTMLElement);
  }
}
