import { Component, ElementRef, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { TransicaoDoProjeto } from '../../core/transicao-de-projeto';
import { PROJETOS, projetoDoSlug } from '../../core/projetos';
import type { Projeto } from '../../core/projetos';
import { ProximoArquivo } from '../../shared/proximo-arquivo/proximo-arquivo';
import { CarrosselDeProjetos } from './carrossel-de-projetos';
import { DetalhesDoProjeto } from './detalhes-do-projeto';

/** `/projetos/ana?x` -> `ana`; `/projetos` -> `null`. */
const slugDoProjeto = (url: string): string | null =>
  url.split(/[?#]/)[0].split('/').filter(Boolean)[1] ?? null;

/**
 * Vitrine dos seis projetos: carrossel (ou grade) de cartões e os detalhes em tela cheia. O projeto
 * aberto vem do endereço (`/projetos/<slug>`, compartilhável; Voltar fecha). Abrir e fechar
 * navegam pelo roteador, e a View Transition dele (ver `core/transicao-de-rota.ts`) expande o cartão
 * até a tela cheia e o recolhe de volta.
 */
@Component({
  selector: 'app-vitrine',
  imports: [CarrosselDeProjetos, DetalhesDoProjeto, ProximoArquivo],
  templateUrl: './vitrine.html',
  styleUrl: './vitrine.scss',
})
export class Vitrine {
  private readonly router = inject(Router);
  private readonly transicao = inject(TransicaoDoProjeto);
  private readonly elemento = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly projetos = PROJETOS;
  protected readonly modo = signal<'carrossel' | 'grade'>('carrossel');

  private readonly slugDoEndereco = toSignal(
    this.router.events.pipe(
      filter((evento) => evento instanceof NavigationEnd),
      startWith(null),
      map(() => slugDoProjeto(this.router.url)),
    ),
    { requireSync: true },
  );

  /** Projeto aberto: o do endereço. */
  protected readonly aberto = computed<Projeto | null>(
    () => projetoDoSlug(this.slugDoEndereco()) ?? null,
  );

  protected alternarModo(): void {
    this.modo.update((atual) => (atual === 'carrossel' ? 'grade' : 'carrossel'));
  }

  protected async abrir({
    projeto,
    origem,
  }: {
    projeto: Projeto;
    origem: HTMLElement;
  }): Promise<void> {
    this.transicao.preparar(origem, 'abrir');
    await this.router.navigate(['/projetos', projeto.slug]);
    // Com a transição correndo, quem limpa o nome do cartão é ela (ao terminar).
    if (!this.transicao.emAndamento) this.transicao.limpar(origem);
  }

  protected async fechar(): Promise<void> {
    const projeto = this.aberto();
    const cartao = projeto ? this.cartaoVisivel(projeto.slug) : null;
    if (cartao) this.transicao.preparar(cartao, 'fechar');
    await this.router.navigate(['/projetos'], { replaceUrl: true });
    if (!this.transicao.emAndamento) this.transicao.limpar(cartao);
    cartao?.focus({ preventScroll: true });
  }

  protected navegar(passo: -1 | 1): void {
    const atual = this.aberto();
    if (!atual) return;
    const indice = (PROJETOS.indexOf(atual) + passo + PROJETOS.length) % PROJETOS.length;
    void this.router.navigate(['/projetos', PROJETOS[indice].slug], { replaceUrl: true });
  }

  /** O cartão do projeto, só se estiver na janela: fora dela não há para onde recolher. */
  private cartaoVisivel(slug: string): HTMLElement | null {
    const cartao = this.elemento.querySelector<HTMLElement>(`a.cartao[data-slug="${slug}"]`);
    if (!cartao) return null;
    const caixa = cartao.getBoundingClientRect();
    const visivel =
      caixa.width > 0 &&
      caixa.right > 0 &&
      caixa.left < globalThis.innerWidth &&
      caixa.bottom > 0 &&
      caixa.top < globalThis.innerHeight;
    return visivel ? cartao : null;
  }
}
