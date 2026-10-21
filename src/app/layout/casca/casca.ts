import {
  Component,
  DOCUMENT,
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
import { Abertura } from '../../core/abertura';
import { JanelaDePreviewComponente } from '../../shared/janela-de-preview/janela-de-preview';
import { BuscaDeSecoes } from '../busca-de-secoes/busca-de-secoes';
import { BarraDeStatus } from '../barra-de-status/barra-de-status';
import { CursorDoSite } from '../cursor-do-site/cursor-do-site';
import { BarraDeCarregamento } from '../barra-de-carregamento/barra-de-carregamento';
import { BarraDeFerramentas } from '../barra-de-ferramentas/barra-de-ferramentas';
import { FaixaDeAbas } from '../faixa-de-abas/faixa-de-abas';
import { FaixaDeFerramentas } from '../faixa-de-ferramentas/faixa-de-ferramentas';
import { JanelaDeRunComponente } from '../janela-de-run/janela-de-run';
import { PainelLateral } from '../painel-lateral/painel-lateral';
import { AberturaComponente } from '../abertura/abertura';
import { AcoesDoCelular } from '../acoes-do-celular/acoes-do-celular';

const CHAVE_DO_PAINEL = 'painel-do-projeto';
const LARGURA_DO_DESKTOP = '(min-width: 768px)';

/**
 * Casca da IDE: barra superior, faixa de ferramentas, painel do projeto e a aba com o editor onde
 * as rotas entram. No desktop o botão Projeto da faixa (ou Ctrl/Cmd+B) mostra e esconde o painel
 * (`data-painel` na área; a escolha fica na sessão). Abaixo de 768px o painel vira uma gaveta aberta pelo botão Seções da barra de ações de baixo (o
 * estado fica em `data-aberta` no painel, para o Compasso animar).
 */
@Component({
  selector: 'app-casca',
  imports: [
    RouterOutlet,
    BarraDeCarregamento,
    CursorDoSite,
    BarraDeFerramentas,
    FaixaDeFerramentas,
    PainelLateral,
    JanelaDeRunComponente,
    FaixaDeAbas,
    BarraDeStatus,
    BuscaDeSecoes,
    JanelaDePreviewComponente,
    AberturaComponente,
    AcoesDoCelular,
  ],
  templateUrl: './casca.html',
  styleUrl: './casca.scss',
  host: {
    // Durante a revelação da abertura os painéis entram em sequência (ver `casca.scss`).
    '[attr.data-revelando]': "abertura.fase() === 'revelando'",
    '(keydown.escape)': 'fecharEDevolverFoco()',
    // No documento: logo após carregar o foco está no <body>, fora do host da casca.
    '(document:keydown.control.p)': 'abrirBusca($event)',
    '(document:keydown.meta.p)': 'abrirBusca($event)',
    '(document:keydown.control.k)': 'abrirBusca($event)',
    '(document:keydown.meta.k)': 'abrirBusca($event)',
    // Ctrl/Cmd+B recolhe e mostra o painel do projeto, como nas IDEs (só no desktop).
    '(document:keydown.control.b)': 'alternarPainelPorAtalho($event)',
    '(document:keydown.meta.b)': 'alternarPainelPorAtalho($event)',
  },
})
export class Casca {
  private readonly injector = inject(Injector);
  private readonly documento = inject(DOCUMENT);
  private readonly painel = viewChild.required(PainelLateral);
  private readonly busca = viewChild.required(BuscaDeSecoes);
  private readonly conteudo = viewChild<ElementRef<HTMLElement>>('conteudo');
  private readonly acoes = viewChild.required(AcoesDoCelular);

  protected readonly abertura = inject(Abertura);
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
    // Só no navegador, depois da hidratação: o HTML pré-renderizado sai com o painel aberto.
    afterNextRender(() => this.restaurarPainel());
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
    this.lembrarPainel();
  }

  /** Atalho Ctrl/Cmd+B: só onde o painel é recolhível (desktop); no celular a gaveta tem o seu botão. */
  protected alternarPainelPorAtalho(evento: Event): void {
    const janela = this.documento.defaultView;
    if (!(janela?.matchMedia?.(LARGURA_DO_DESKTOP).matches ?? true)) return;
    evento.preventDefault();
    this.alternarPainel();
  }

  /** O estado do painel dura a sessão: recarregar ou navegar mantém o painel como o visitante deixou. */
  private lembrarPainel(): void {
    try {
      const armazenamento = this.documento.defaultView?.sessionStorage;
      if (this.painelVisivel()) armazenamento?.removeItem(CHAVE_DO_PAINEL);
      else armazenamento?.setItem(CHAVE_DO_PAINEL, 'recolhido');
    } catch {
      // Sem armazenamento o estado vale só até recarregar.
    }
  }

  private restaurarPainel(): void {
    try {
      if (this.documento.defaultView?.sessionStorage.getItem(CHAVE_DO_PAINEL) === 'recolhido') {
        this.painelVisivel.set(false);
      }
    } catch {
      // Sem armazenamento o painel começa aberto.
    }
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
    this.acoes().focarSecoes();
  }
}
