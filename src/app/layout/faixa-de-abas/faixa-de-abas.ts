import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import { Router } from '@angular/router';

import { AbasAbertas } from '../../core/abas-abertas';
import type { Aba } from '../../core/abas-abertas';
import { GlifoFechar } from '../../shared/glifo-fechar/glifo-fechar';
import { Icone } from '../../shared/icone/icone';

/**
 * Faixa de abas sobre o editor, no padrão `tablist` do WAI-ARIA: uma aba por arquivo aberto
 * (estado em `AbasAbertas`). Setas e Home/End movem o foco, Enter/Espaço abrem e Delete fecha.
 */
@Component({
  selector: 'app-faixa-de-abas',
  imports: [GlifoFechar, Icone],
  templateUrl: './faixa-de-abas.html',
  styleUrl: './faixa-de-abas.scss',
})
export class FaixaDeAbas {
  private readonly estado = inject(AbasAbertas);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly botoes = viewChildren<ElementRef<HTMLButtonElement>>('botaoAba');
  /** Aba que deve receber o foco quando ficar ativa, depois de fechar a ativa com Delete. */
  private focoPendente: string | undefined;

  protected readonly abas = this.estado.abas;
  protected readonly slugAtivo = computed(() => this.estado.ativa()?.slug);
  /** Posição e largura da aba ativa (px), medidas depois de cada renderização. */
  protected readonly indicador = signal({ x: 0, largura: 0 });

  constructor() {
    effect(() => {
      this.slugAtivo();
      this.abas();
      afterNextRender(
        () => {
          this.mostrarAbaAtiva();
          this.medirIndicador();
          if (this.focoPendente === undefined || this.slugAtivo() !== this.focoPendente) return;
          this.focoPendente = undefined;
          this.focarAbaAtiva();
        },
        { injector: this.injector },
      );
    });
  }

  protected abrir(aba: Aba): void {
    void this.router.navigateByUrl(aba.rota);
  }

  protected fechar(slug: string): void {
    this.estado.fechar(slug);
  }

  protected aoTeclar(evento: KeyboardEvent, indice: number): void {
    const total = this.abas().length;
    const destino = {
      ArrowRight: (indice + 1) % total,
      ArrowLeft: (indice - 1 + total) % total,
      Home: 0,
      End: total - 1,
    }[evento.key];

    if (destino !== undefined) {
      evento.preventDefault();
      this.botoes()[destino]?.nativeElement.focus();
      return;
    }
    if (evento.key === 'Delete') {
      evento.preventDefault();
      this.fecharPorTeclado(this.abas()[indice], indice);
    }
  }

  private fecharPorTeclado(aba: Aba, indice: number): void {
    if (aba.slug === this.slugAtivo()) {
      // A vizinha que o AbasAbertas vai ativar: à direita, senão à esquerda, senão o Início.
      const abas = this.abas();
      this.focoPendente = (abas[indice + 1] ?? abas[indice - 1])?.slug ?? '';
    } else {
      afterNextRender(
        () => this.botoes()[Math.min(indice, this.abas().length - 1)]?.nativeElement.focus(),
        {
          injector: this.injector,
        },
      );
    }
    this.estado.fechar(aba.slug);
  }

  /** Leva a aba ativa para a área visível da faixa, sem animar com movimento reduzido. */
  private mostrarAbaAtiva(): void {
    const indice = this.abas().findIndex((aba) => aba.slug === this.slugAtivo());
    const reduzido = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    this.botoes()[indice]?.nativeElement.scrollIntoView?.({
      block: 'nearest',
      inline: 'nearest',
      behavior: reduzido ? 'auto' : 'smooth',
    });
  }

  /** O indicador acompanha a aba ativa: só `transform` muda, então a animação não mexe no layout. */
  private medirIndicador(): void {
    const indice = this.abas().findIndex((aba) => aba.slug === this.slugAtivo());
    const botao = this.botoes()[indice]?.nativeElement;
    if (!botao) return;
    this.indicador.set({ x: botao.offsetLeft, largura: botao.offsetWidth });
  }

  private focarAbaAtiva(): void {
    const indice = this.abas().findIndex((aba) => aba.slug === this.slugAtivo());
    this.botoes()[Math.max(indice, 0)]?.nativeElement.focus();
  }
}
