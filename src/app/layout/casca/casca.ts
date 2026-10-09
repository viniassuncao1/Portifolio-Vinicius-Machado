import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { DADO_ARVORE_NO_INICIO } from '../../core/secoes';
import { EstrategiaDeTitulo } from '../../core/estrategia-de-titulo';
import { BuscaDeSecoes } from '../busca-de-secoes/busca-de-secoes';
import { BarraDeStatus } from '../barra-de-status/barra-de-status';
import { BarraDeFerramentas } from '../barra-de-ferramentas/barra-de-ferramentas';
import { FaixaDeAbas } from '../faixa-de-abas/faixa-de-abas';
import { PainelLateral } from '../painel-lateral/painel-lateral';

/**
 * Casca da IDE: barra de ferramentas, painel lateral e a aba com o editor onde as rotas entram.
 * Abaixo de 768px o painel vira uma gaveta aberta pelo botão "Seções" (o estado fica em
 * `data-aberta` no painel, para o Compasso animar).
 */
@Component({
  selector: 'app-casca',
  imports: [
    RouterOutlet,
    BarraDeFerramentas,
    PainelLateral,
    FaixaDeAbas,
    BarraDeStatus,
    BuscaDeSecoes,
  ],
  templateUrl: './casca.html',
  styleUrl: './casca.scss',
  host: {
    '(keydown.escape)': 'fecharEDevolverFoco()',
    '(keydown.control.p)': 'abrirBusca($event)',
    '(keydown.meta.p)': 'abrirBusca($event)',
  },
})
export class Casca {
  private readonly injector = inject(Injector);
  private readonly painel = viewChild.required(PainelLateral);
  private readonly busca = viewChild.required(BuscaDeSecoes);
  private readonly botao = viewChild.required<ElementRef<HTMLButtonElement>>('botaoSecoes');

  protected readonly titulo = inject(EstrategiaDeTitulo).titulo;
  protected readonly gavetaAberta = signal(false);

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

  /** Fecha a gaveta (Escape ou escolha de seção) e devolve o foco ao botão "Seções". */
  protected fecharEDevolverFoco(): void {
    if (!this.gavetaAberta()) return;
    this.fecharGaveta();
    this.botao().nativeElement.focus();
  }
}
