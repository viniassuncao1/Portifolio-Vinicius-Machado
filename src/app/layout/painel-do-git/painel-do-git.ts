import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import type { CommitDoHistorico } from '../../core/git/historico';
import { enderecoDoCommit, enderecoDoPr, shaCurto } from '../../core/git/ler-historico';
import { PainelDoGit } from '../../core/painel-do-git';
import { GlifoFechar } from '../../shared/glifo-fechar/glifo-fechar';
import { dataCompleta, dataRelativa } from './data-relativa';
import { LARGURA_DA_FAIXA, centroDaFaixa, montarGrafo } from './grafo';

/**
 * Painel do Git na parte de baixo da IDE (no celular, em tela cheia): grafo, lista de commits e
 * detalhes do escolhido. A lista é um `listbox` com `aria-activedescendant`: as setas movem o
 * commit ativo, Enter ou clique mostram os detalhes e Esc fecha devolvendo o foco. O estado
 * aberto/fechado fica em `data-aberto` no host, para o Compasso animar.
 */
@Component({
  selector: 'app-painel-do-git',
  imports: [GlifoFechar],
  templateUrl: './painel-do-git.html',
  styleUrl: './painel-do-git.scss',
  host: {
    '[attr.data-aberto]': 'painel.aberto()',
    '(keydown.escape)': 'fechar($event)',
  },
})
export class PainelDoGitComponente {
  private readonly injector = inject(Injector);
  private readonly secao = viewChild<ElementRef<HTMLElement>>('secao');
  private readonly lista = viewChild<ElementRef<HTMLElement>>('lista');

  protected readonly painel = inject(PainelDoGit);
  protected readonly commits = computed(() => this.painel.historico()?.commits ?? []);
  protected readonly grafo = computed(() => montarGrafo(this.commits()));
  protected readonly larguraDoGrafo = computed(() => this.grafo().faixas * LARGURA_DA_FAIXA);
  protected readonly ativo = signal(0);
  protected readonly escolhido = signal<CommitDoHistorico | null>(null);
  protected readonly idAtivo = computed(() => {
    const commit = this.commits()[this.ativo()];
    return commit ? this.idDoCommit(commit) : null;
  });
  /** Hora de referência das datas relativas: fixada quando o painel abre, já no navegador. */
  protected readonly agora = signal(new Date(0));
  protected readonly centroDaFaixa = centroDaFaixa;
  protected readonly shaCurto = shaCurto;
  protected readonly dataCompleta = dataCompleta;

  constructor() {
    effect(() => {
      if (!this.painel.aberto()) return;
      this.agora.set(new Date());
      afterNextRender(() => this.secao()?.nativeElement.focus(), { injector: this.injector });
    });
    // Com o histórico na tela o foco vai para a lista, para as setas funcionarem de imediato.
    effect(() => this.lista()?.nativeElement.focus());
  }

  protected idDoCommit(commit: CommitDoHistorico): string {
    return `commit-${shaCurto(commit.sha)}`;
  }

  protected relativa(commit: CommitDoHistorico): string {
    return dataRelativa(commit.data, this.agora());
  }

  protected enderecoDoCommit(commit: CommitDoHistorico): string {
    return enderecoDoCommit(this.painel.historico()?.repositorio ?? '', commit.sha);
  }

  protected enderecoDoPr(commit: CommitDoHistorico): string {
    return enderecoDoPr(this.painel.historico()?.repositorio ?? '', commit.pr ?? 0);
  }

  protected fechar(evento?: Event): void {
    evento?.stopPropagation();
    this.painel.fechar();
  }

  protected escolher(indice: number): void {
    this.ativo.set(indice);
    this.escolhido.set(this.commits()[indice] ?? null);
  }

  protected aoClicar(evento: MouseEvent): void {
    const alvo = evento.target instanceof Element ? evento.target.closest('[data-indice]') : null;
    const indice = Number(alvo?.getAttribute('data-indice'));
    if (alvo && !Number.isNaN(indice)) this.escolher(indice);
  }

  protected aoTeclar(evento: KeyboardEvent): void {
    const total = this.commits().length;
    const destino: Record<string, number> = {
      ArrowDown: Math.min(this.ativo() + 1, total - 1),
      ArrowUp: Math.max(this.ativo() - 1, 0),
      Home: 0,
      End: total - 1,
    };
    if (evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault();
      this.escolher(this.ativo());
      return;
    }
    if (!(evento.key in destino) || total === 0) return;
    evento.preventDefault();
    this.ativo.set(destino[evento.key]);
    afterNextRender(
      () => {
        const id = this.idAtivo();
        const item = id ? this.lista()?.nativeElement.querySelector(`#${id}`) : null;
        item?.scrollIntoView?.({ block: 'nearest' });
      },
      { injector: this.injector },
    );
  }
}
