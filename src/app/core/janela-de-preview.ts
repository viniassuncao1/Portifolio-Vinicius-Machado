import { Router, NavigationEnd } from '@angular/router';
import { Service, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

import { PREVIEWS } from './previews';
import type { PreviewDeProjeto } from './previews';

/** Slug da seção de uma URL: `/projeto-2/3?x=1` vira `projeto-2`. */
const slugDaUrl = (url: string): string => url.split(/[?#]/)[0].split('/')[1] ?? '';

/**
 * Estado da janela de preview: qual projeto está aberto e quem pediu a abertura.
 * Guarda o elemento de origem para devolver o foco quando a janela fecha.
 */
@Service()
export class JanelaDePreview {
  private readonly router = inject(Router);
  private readonly origem = signal<HTMLElement | null>(null);
  private readonly aberto = signal<PreviewDeProjeto | null>(null);

  /** Preview aberto agora, ou `null` com a janela fechada. */
  readonly preview = this.aberto.asReadonly();

  private readonly slugAtual = toSignal(
    this.router.events.pipe(
      filter((evento) => evento instanceof NavigationEnd),
      startWith(null),
      map(() => slugDaUrl(this.router.url)),
    ),
    { requireSync: true },
  );

  /** Preview da rota atual, quando o projeto tem site; `undefined` nas demais seções. */
  readonly previewDaRota = computed<PreviewDeProjeto | undefined>(() => PREVIEWS[this.slugAtual()]);

  abrir(preview: PreviewDeProjeto, origem: HTMLElement): void {
    this.origem.set(origem);
    this.aberto.set(preview);
  }

  fechar(): void {
    if (!this.aberto()) return;
    this.aberto.set(null);
    this.origem()?.focus();
    this.origem.set(null);
  }
}
