import {
  Component,
  ElementRef,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
  output,
  viewChildren,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { SECOES } from '../../core/secoes';
import type { Pacote, Secao } from '../../core/secoes';
import { Icone } from '../../shared/icone/icone';

interface Pasta {
  readonly pacote: Pacote;
  readonly secoes: readonly Secao[];
}

/** As seções agrupadas por pacote, na ordem em que o pacote aparece em `SECOES`. */
const PASTAS: readonly Pasta[] = SECOES.reduce<Pasta[]>((pastas, secao) => {
  const existente = pastas.find((pasta) => pasta.pacote === secao.pacote);
  return existente
    ? pastas.map((pasta) =>
        pasta === existente ? { ...pasta, secoes: [...pasta.secoes, secao] } : pasta,
      )
    : [...pastas, { pacote: secao.pacote, secoes: [secao] }];
}, []);

const slugDaUrl = (url: string): string => url.split(/[?#]/)[0].split('/')[1] ?? '';

const chaveDaPasta = (pacote: Pacote): string => `pasta:${pacote}`;
const chaveDoArquivo = (slug: string): string => `arquivo:${slug}`;

/**
 * Árvore do projeto em pastas (pacotes Java), no padrão ARIA de tree view: um único item na ordem
 * de Tab (roving tabindex), setas para navegar, Direita/Esquerda para expandir e recolher.
 * Os arquivos são links reais para as rotas das seções.
 */
@Component({
  selector: 'app-arvore-de-secoes',
  imports: [RouterLink, RouterLinkActive, Icone],
  templateUrl: './arvore-de-secoes.html',
  styleUrl: './arvore-de-secoes.scss',
})
export class ArvoreDeSecoes {
  private readonly router = inject(Router);
  private readonly itens = viewChildren<ElementRef<HTMLElement>>('item');

  protected readonly pastas = PASTAS;

  /** No Início a primeira seção aparece destacada e expandida, sem `aria-current`. */
  readonly noInicio = input(false);

  /** Emitido quando o visitante escolhe uma seção (a gaveta usa para se fechar). */
  readonly secaoEscolhida = output<void>();

  private readonly slugAtual = toSignal(
    this.router.events.pipe(
      filter((evento) => evento instanceof NavigationEnd),
      startWith(null),
      map(() => slugDaUrl(this.router.url)),
    ),
    { requireSync: true },
  );

  private readonly pacoteAtual = computed<Pacote>(
    () => SECOES.find((secao) => secao.slug === this.slugAtual())?.pacote ?? SECOES[0].pacote,
  );

  /** Pastas abertas: a da seção atual abre ao navegar e as que o visitante abriu continuam abertas. */
  private readonly abertas = linkedSignal<Pacote, ReadonlySet<Pacote>>({
    source: this.pacoteAtual,
    computation: (pacote, anterior) => new Set([...(anterior?.value ?? []), pacote]),
  });

  /** Item que entra na ordem de Tab (roving tabindex): a seção atual ou o último item focado. */
  private readonly focavel = linkedSignal(() => {
    const secao = SECOES.find((s) => s.slug === this.slugAtual());
    return secao ? chaveDoArquivo(secao.slug) : chaveDaPasta(this.pacoteAtual());
  });

  /** O item focável vira a sua pasta se ela foi recolhida. */
  protected readonly chaveFocavel = computed(() => {
    const chave = this.focavel();
    const secao = SECOES.find((s) => chaveDoArquivo(s.slug) === chave);
    return secao && !this.abertas().has(secao.pacote) ? chaveDaPasta(secao.pacote) : chave;
  });

  /** Pasta que o visitante acabou de abrir: só ela anima, para o conteúdo nunca depender da animação. */
  protected readonly entrando = signal<Pacote | null>(null);

  protected readonly chaveDaPasta = chaveDaPasta;
  protected readonly chaveDoArquivo = chaveDoArquivo;

  protected estaAberta(pacote: Pacote): boolean {
    return this.abertas().has(pacote);
  }

  protected alternar(pacote: Pacote): void {
    this.entrando.set(this.abertas().has(pacote) ? null : pacote);
    this.abertas.update((abertas) => {
      const proximas = new Set(abertas);
      if (!proximas.delete(pacote)) proximas.add(pacote);
      return proximas;
    });
  }

  focarPrimeiroItem(): void {
    this.itens()[0]?.nativeElement.focus();
  }

  protected focar(chave: string): void {
    this.focavel.set(chave);
  }

  /** Setas, Home e End movem o foco; Direita e Esquerda abrem e fecham pastas; Enter e Espaço alternam a pasta. */
  protected aoTeclar(evento: KeyboardEvent): void {
    const itens = this.itens()
      .map((item) => item.nativeElement)
      .filter((item) => !item.closest('[hidden]'));
    const alvo =
      evento.target instanceof HTMLElement
        ? evento.target.closest<HTMLElement>('[role=treeitem]')
        : null;
    const indice = alvo ? itens.indexOf(alvo) : -1;
    if (!alvo || indice < 0) return;

    const pacote = alvo.dataset['pacote'] as Pacote;
    const ehPasta = alvo.dataset['tipo'] === 'pasta';
    const aberta = this.estaAberta(pacote);
    const irPara = (destino: HTMLElement | undefined): void => destino?.focus();

    switch (evento.key) {
      case 'ArrowDown':
        irPara(itens[Math.min(indice + 1, itens.length - 1)]);
        break;
      case 'ArrowUp':
        irPara(itens[Math.max(indice - 1, 0)]);
        break;
      case 'Home':
        irPara(itens[0]);
        break;
      case 'End':
        irPara(itens.at(-1));
        break;
      case 'ArrowRight':
        if (!ehPasta) return;
        if (aberta) irPara(itens[indice + 1]);
        else this.alternar(pacote);
        break;
      case 'ArrowLeft':
        if (ehPasta && aberta) this.alternar(pacote);
        else
          irPara(
            itens.find(
              (item) => item.dataset['tipo'] === 'pasta' && item.dataset['pacote'] === pacote,
            ),
          );
        break;
      case 'Enter':
      case ' ':
        if (!ehPasta) return;
        this.alternar(pacote);
        break;
      default:
        return;
    }
    evento.preventDefault();
  }
}
