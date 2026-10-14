import { Component, ElementRef, inject, input, output, viewChild } from '@angular/core';

import { JanelaDePreview } from '../../core/janela-de-preview';
import { JanelaDeRun } from '../../core/janela-de-run';
import { PainelDoGit } from '../../core/painel-do-git';
import { Tema } from '../../core/tema';
import { Icone } from '../../shared/icone/icone';

/**
 * Barra de ferramentas escura nos cinzas do design, com os ícones do design (Buscar e a branch são
 * da IntelliJ Platform, que o design não tem). Os ícones só decorativos e a branch ficam fora da
 * leitura e do foco. São botões de verdade: Buscar, Executar (o preview nos projetos com site; nos demais, a janela de Run) e, no celular,
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
  protected readonly run = inject(JanelaDeRun);
  protected readonly git = inject(PainelDoGit);
  protected readonly tema = inject(Tema);
  protected readonly ramo = 'master';

  /** Só o celular mostra o botão Projeto: ele abre e fecha a gaveta de seções. */
  readonly gavetaAberta = input(false);
  readonly alternarGaveta = output<void>();
  readonly buscar = output<void>();

  focarProjeto(): void {
    this.botaoProjeto().nativeElement.focus();
  }

  /** Fora dos projetos com site, o Executar reabre a janela de Run e reinicia o log. */
  protected executarAplicacao(evento: Event): void {
    this.run.executar(evento.currentTarget as HTMLElement);
  }

  protected executar(evento: Event): void {
    const preview = this.janela.previewDaRota();
    if (preview) this.janela.abrir(preview, evento.currentTarget as HTMLElement);
  }
}
