import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';

/** Tempo mínimo em que a barra fica à vista, para uma navegação instantânea não parecer um pisca. */
const PERMANENCIA_MINIMA_MS = 420;

/**
 * Fio de acento no topo da casca que "compila" a cada troca de rota, como a barra de progresso de
 * uma IDE. É só feedback visual (decorativo, escondido de leitores de tela) e some com movimento
 * reduzido.
 */
@Component({
  selector: 'app-barra-de-carregamento',
  host: { 'aria-hidden': 'true', '[attr.data-estado]': 'estado()' },
  template: `<span class="fio"></span>`,
  styleUrl: './barra-de-carregamento.scss',
})
export class BarraDeCarregamento {
  protected readonly estado = signal<'parada' | 'correndo' | 'terminando'>('parada');
  private inicio = 0;
  private temporizador: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    const roteador = inject(Router);
    const destruir = inject(DestroyRef);
    roteador.events.pipe(takeUntilDestroyed(destruir)).subscribe((evento) => {
      if (evento instanceof NavigationStart) this.comecar();
      else if (
        evento instanceof NavigationEnd ||
        evento instanceof NavigationCancel ||
        evento instanceof NavigationError
      ) {
        this.terminar();
      }
    });
    destruir.onDestroy(() => clearTimeout(this.temporizador));
  }

  private comecar(): void {
    clearTimeout(this.temporizador);
    this.inicio = performance.now();
    this.estado.set('correndo');
  }

  private terminar(): void {
    const restante = Math.max(0, PERMANENCIA_MINIMA_MS - (performance.now() - this.inicio));
    clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => {
      this.estado.set('terminando');
      this.temporizador = setTimeout(() => this.estado.set('parada'), 260);
    }, restante);
  }
}
