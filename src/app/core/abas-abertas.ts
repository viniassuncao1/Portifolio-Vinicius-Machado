import {
  DestroyRef,
  Injector,
  PLATFORM_ID,
  Service,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { ARQUIVO_INICIO, SECOES } from './secoes';

export interface Aba {
  /** Slug da seção; vazio para o Início. */
  readonly slug: string;
  readonly arquivo: string;
  /** Endereço aberto ao ativar a aba. */
  readonly rota: string;
}

const CHAVE_DA_SESSAO = 'abas-abertas';

const ABA_INICIO: Aba = { slug: '', arquivo: ARQUIVO_INICIO, rota: '/' };
const ABAS_POSSIVEIS: readonly Aba[] = [
  ABA_INICIO,
  ...SECOES.map((secao) => ({ slug: secao.slug, arquivo: secao.arquivo, rota: `/${secao.slug}` })),
];

const abaDoSlug = (slug: string): Aba | undefined => ABAS_POSSIVEIS.find((a) => a.slug === slug);

/** Slug da seção de um endereço (`/skills/2?x` -> `skills`; `/` -> vazio). */
const slugDaUrl = (url: string): string => url.split(/[?#]/)[0].split('/')[1] ?? '';

/**
 * Abas abertas da faixa de arquivos. A aba da rota atual abre a cada navegação. A sessão
 * (`sessionStorage`) é restaurada só no navegador, depois da hidratação; no servidor existe apenas
 * a aba da rota atual, para o HTML pré-renderizado e a hidratação coincidirem.
 */
@Service()
export class AbasAbertas {
  private readonly router = inject(Router);
  private readonly navegador = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly lista = signal<readonly Aba[]>([]);
  private readonly slugAtivo = signal('');
  /** Só depois de restaurar a sessão é seguro gravar, senão a aba atual apagaria as guardadas. */
  private sessaoRestaurada = false;

  readonly abas = this.lista.asReadonly();
  readonly ativa = computed(() => this.lista().find((aba) => aba.slug === this.slugAtivo()));

  constructor() {
    this.router.events
      .pipe(
        filter((evento) => evento instanceof NavigationEnd),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe(() => this.abrirDaRotaAtual());

    if (this.router.navigated) this.abrirDaRotaAtual();
    if (this.navegador) {
      afterNextRender(() => this.restaurarSessao(), { injector: inject(Injector) });
    }
  }

  abrir(slug: string): void {
    const aba = abaDoSlug(slug);
    if (!aba) return;
    this.slugAtivo.set(slug);
    if (this.lista().some((a) => a.slug === slug)) return;
    this.lista.update((abas) => [...abas, aba]);
    this.salvar();
  }

  /** Fecha uma aba. Se era a ativa, vai para a vizinha (à direita, senão à esquerda) ou para `/`. */
  fechar(slug: string): void {
    const abas = this.lista();
    const indice = abas.findIndex((aba) => aba.slug === slug);
    if (indice < 0) return;

    const restantes = abas.filter((aba) => aba.slug !== slug);
    this.lista.set(restantes);
    this.salvar();
    if (slug !== this.slugAtivo()) return;

    const vizinha = restantes[indice] ?? restantes[indice - 1];
    void this.router.navigateByUrl(vizinha?.rota ?? '/').then(() => this.abrirDaRotaAtual());
  }

  private abrirDaRotaAtual(): void {
    const slug = slugDaUrl(this.router.url);
    this.abrir(abaDoSlug(slug) ? slug : '');
  }

  private restaurarSessao(): void {
    const guardados = this.lerSessao();
    const atuais = this.lista();
    const restauradas = [
      ...guardados.filter((a) => !atuais.some((atual) => atual.slug === a.slug)),
      ...atuais,
    ];
    // Mantém a ordem guardada, com a aba da rota atual na sua posição original quando existir.
    const ordem = guardados.map((a) => a.slug);
    this.lista.set(
      [...restauradas].sort((a, b) => posicao(ordem, a.slug) - posicao(ordem, b.slug)),
    );
    this.sessaoRestaurada = true;
    this.salvar();
  }

  private lerSessao(): readonly Aba[] {
    try {
      const bruto = sessionStorage.getItem(CHAVE_DA_SESSAO);
      const slugs: unknown = bruto ? JSON.parse(bruto) : [];
      if (!Array.isArray(slugs)) return [];
      return slugs.flatMap((slug) => {
        const aba = typeof slug === 'string' ? abaDoSlug(slug) : undefined;
        return aba ? [aba] : [];
      });
    } catch {
      return [];
    }
  }

  private salvar(): void {
    if (!this.navegador || !this.sessaoRestaurada) return;
    try {
      sessionStorage.setItem(CHAVE_DA_SESSAO, JSON.stringify(this.lista().map((a) => a.slug)));
    } catch {
      // Sem sessionStorage (modo privado, cota): as abas só deixam de sobreviver ao recarregar.
    }
  }
}

const posicao = (ordem: readonly string[], slug: string): number => {
  const i = ordem.indexOf(slug);
  return i < 0 ? ordem.length : i;
};
