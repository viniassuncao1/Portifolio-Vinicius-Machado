import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { DADO_ARVORE_NO_INICIO } from '../../core/secoes';
import { EstrategiaDeTitulo } from '../../core/estrategia-de-titulo';
import { Tema } from '../../core/tema';
import { JanelaDePreviewComponente } from '../../shared/janela-de-preview/janela-de-preview';
import { BuscaDeSecoes } from '../busca-de-secoes/busca-de-secoes';
import { BarraDeStatus } from '../barra-de-status/barra-de-status';
import { BarraDeFerramentas } from '../barra-de-ferramentas/barra-de-ferramentas';
import { FaixaDeAbas } from '../faixa-de-abas/faixa-de-abas';
import { FaixaDeFerramentas } from '../faixa-de-ferramentas/faixa-de-ferramentas';
import { JanelaDeRunComponente } from '../janela-de-run/janela-de-run';
import { PainelLateral } from '../painel-lateral/painel-lateral';
import { TelaDeBoasVindas } from '../tela-de-boas-vindas/tela-de-boas-vindas';

/**
 * Casca da IDE: barra superior, faixa de ferramentas, painel do projeto e a aba com o editor onde
 * as rotas entram. No desktop o botão Projeto da faixa mostra e esconde o painel (`data-painel` na
 * área). Abaixo de 768px o painel vira uma gaveta aberta pelo botão Projeto da barra superior (o
 * estado fica em `data-aberta` no painel, para o Compasso animar).
 */
@Component({
  selector: 'app-casca',
  imports: [
    RouterOutlet,
    BarraDeFerramentas,
    FaixaDeFerramentas,
    PainelLateral,
    JanelaDeRunComponente,
    FaixaDeAbas,
    BarraDeStatus,
    BuscaDeSecoes,
    JanelaDePreviewComponente,
    TelaDeBoasVindas,
  ],
  templateUrl: './casca.html',
  styleUrl: './casca.scss',
  host: {
    '(keydown.escape)': 'fecharEDevolverFoco()',
    // No documento: logo após carregar o foco está no <body>, fora do host da casca.
    '(document:keydown.control.p)': 'abrirBusca($event)',
    '(document:keydown.meta.p)': 'abrirBusca($event)',
  },
})
export class Casca {
  private readonly injector = inject(Injector);
  private readonly painel = viewChild.required(PainelLateral);
  private readonly busca = viewChild.required(BuscaDeSecoes);
  private readonly conteudo = viewChild<ElementRef<HTMLElement>>('conteudo');
  private readonly barra = viewChild.required(BarraDeFerramentas);

  protected readonly titulo = inject(EstrategiaDeTitulo).titulo;
  protected readonly gavetaAberta = signal(false);
  protected readonly painelVisivel = signal(true);

  private readonly router = inject(Router);
  /** A rota aberta pede a árvore como no Início (design da tela 01). */
  protected readonly arvoreNoInicio = toSignal(
    this.router.events.pipe(
      filter((evento) => evento instanceof NavigationEnd),
      startWith(null),
      map(() => {
        let rota = this.router.routerState.snapshot.root;
        while (rota.firstChild) rota = rota.firstChild;
        return rota.data[DADO_ARVORE_NO_INICIO] === true;
      }),
    ),
    { requireSync: true },
  );

  constructor() {
    // Instancia o serviço de tema no carregamento: ele sincroniza color-scheme e theme-color.
    inject(Tema);
    // Cada página abre no topo: o editor é a região rolável e a rolagem não se reinicia sozinha.
    this.router.events
      .pipe(
        filter((evento) => evento instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.conteudo()?.nativeElement.scrollTo?.({ top: 0 }));
  }

  protected alternarPainel(): void {
    this.painelVisivel.update((visivel) => !visivel);
  }

  protected alternarGaveta(): void {
    if (this.gavetaAberta()) {
      this.fecharGaveta();
      return;
    }
    this.gavetaAberta.set(true);
    afterNextRender(() => this.painel().focarPrimeiroItem(), { injector: this.injector });
  }

  /** Ctrl/Cmd+P abre a busca de seções no lugar da impressão do navegador. */
  protected abrirBusca(evento?: Event): void {
    evento?.preventDefault();
    this.busca().abrir();
  }

  protected fecharGaveta(): void {
    this.gavetaAberta.set(false);
  }

  /** Fecha a gaveta (Escape ou escolha de seção) e devolve o foco ao botão Projeto. */
  protected fecharEDevolverFoco(): void {
    if (!this.gavetaAberta()) return;
    this.fecharGaveta();
    this.barra().focarProjeto();
  }
}
