import { Component, afterNextRender, computed, inject, signal } from '@angular/core';

import { contarPorTipo, ultimosCommitsDeCodigo, ultimosPrs } from '../../core/git/resumo';
import { enderecoDoCommit, enderecoDoPr, shaCurto } from '../../core/git/ler-historico';
import { HistoricoDoRepositorio } from '../../core/repositorio';
import { agruparTiposPequenos } from './agrupar-tipos';
import { dataRelativa } from './data-relativa';

/** O que cada tipo do Conventional Commits quer dizer, para quem não conhece a convenção. */
const SIGNIFICADO_DOS_TIPOS: Readonly<Record<string, string>> = {
  feat: 'funcionalidade nova',
  fix: 'correção de erro',
  test: 'testes automatizados',
  docs: 'documentação',
  refactor: 'reorganização do código',
  chore: 'manutenção e ferramentas',
  perf: 'desempenho',
  ci: 'integração contínua',
  build: 'build e dependências',
  style: 'formatação',
  revert: 'reversão',
  outros: 'sem tipo no assunto',
};

/**
 * Página do repositório no estilo do GitHub, aberta como aba do editor: nome, o que o repositório
 * mostra, números, divisão do trabalho por tipo, últimos pull requests e últimos commits. O JSON
 * do histórico é baixado só quando a página abre (no navegador); no servidor ela sai com o
 * esqueleto de carregamento. O h1 da página vem da casca.
 */
@Component({
  selector: 'app-repositorio',
  templateUrl: './repositorio.html',
  styleUrl: './repositorio.scss',
})
export class Repositorio {
  protected readonly repositorio = inject(HistoricoDoRepositorio);
  /** Hora de referência das datas relativas: só existe depois de abrir, já no navegador. */
  private readonly agora = signal(new Date(0));

  protected readonly commits = computed(() => this.repositorio.historico()?.commits ?? []);
  protected readonly nome = computed(() => this.repositorio.historico()?.repositorio ?? '');
  protected readonly endereco = computed(() => `https://github.com/${this.nome()}`);
  protected readonly enderecoDoHistorico = computed(() => `${this.endereco()}/commits`);
  protected readonly prs = computed(() => ultimosPrs(this.commits()));
  protected readonly totalDePrs = computed(() => this.commits().filter((c) => c.pr).length);
  protected readonly recentes = computed(() => ultimosCommitsDeCodigo(this.commits()));
  protected readonly tipos = computed(() =>
    agruparTiposPequenos(contarPorTipo(this.commits())).map((tipo) => ({
      ...tipo,
      significado: tipo.reunidos ?? SIGNIFICADO_DOS_TIPOS[tipo.tipo] ?? '',
    })),
  );
  /** O histórico vem do mais novo para o mais antigo: o primeiro commit é o último da lista. */
  protected readonly desde = computed(() => this.commits().at(-1)?.data ?? '');
  protected readonly shaCurto = shaCurto;

  constructor() {
    afterNextRender(() => {
      this.agora.set(new Date());
      void this.repositorio.carregar();
    });
  }

  protected inteiro(valor: number): string {
    return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(valor);
  }

  protected dataCurta(iso: string): string {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeZone: 'UTC' }).format(
      new Date(iso),
    );
  }

  protected relativa(iso: string): string {
    return dataRelativa(iso, this.agora());
  }

  protected enderecoDoCommit(sha: string): string {
    return enderecoDoCommit(this.nome(), sha);
  }

  protected enderecoDoPr(numero: number): string {
    return enderecoDoPr(this.nome(), numero);
  }
}
