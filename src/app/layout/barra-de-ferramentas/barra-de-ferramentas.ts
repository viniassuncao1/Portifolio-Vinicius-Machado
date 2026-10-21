import { Component, afterNextRender, inject, output, signal } from '@angular/core';

import { Router } from '@angular/router';

import { SLUG_DO_REPOSITORIO } from '../../core/abas-abertas';
import { JanelaDePreview } from '../../core/janela-de-preview';
import { JanelaDeRun } from '../../core/janela-de-run';
import { Tema } from '../../core/tema';
import { Icone } from '../../shared/icone/icone';

/**
 * Barra superior da casca, com a identidade do projeto à esquerda (o widget do projeto do IntelliJ
 * New UI: selo com as iniciais e o nome, que leva ao Início) e as ações à direita: ▶ Executar (o
 * preview nos projetos com site; nos demais, a janela de Run), busca (Ctrl/Cmd+K), tema e a branch.
 * Os ícones só decorativos ficam fora da leitura e do foco.
 */
@Component({
  selector: 'app-barra-de-ferramentas',
  imports: [Icone],
  host: { role: 'banner' },
  templateUrl: './barra-de-ferramentas.html',
  styleUrl: './barra-de-ferramentas.scss',
})
export class BarraDeFerramentas {
  protected readonly janela = inject(JanelaDePreview);
  protected readonly run = inject(JanelaDeRun);
  private readonly router = inject(Router);
  protected readonly tema = inject(Tema);
  protected readonly ramo = 'master';

  readonly buscar = output<void>();

  /** Atalho da busca como o sistema o escreve: ⌘K no Mac, Ctrl K nos demais (só depois da hidratação). */
  protected readonly atalhoDaBusca = signal('Ctrl K');

  constructor() {
    afterNextRender(() => {
      const plataforma = navigator.platform || navigator.userAgent;
      if (/mac|iphone|ipad/i.test(plataforma)) this.atalhoDaBusca.set('⌘K');
    });
  }

  protected irParaOInicio(): void {
    void this.router.navigateByUrl('/');
  }

  protected abrirRepositorio(): void {
    void this.router.navigateByUrl(`/${SLUG_DO_REPOSITORIO}`);
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
