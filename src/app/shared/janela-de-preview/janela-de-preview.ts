import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  DOCUMENT,
  ElementRef,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import type { SafeResourceUrl } from '@angular/platform-browser';

import { JanelaDePreview as EstadoDaJanela } from '../../core/janela-de-preview';
import type { PreviewDeProjeto } from '../../core/previews';
import { GlifoFechar } from '../glifo-fechar/glifo-fechar';

/**
 * Janela de preview de um projeto, no estilo de uma janela de IDE, montada uma vez na Casca.
 * É um `<dialog>` modal: o foco fica preso dentro dela e Escape fecha.
 * Abre com a captura do site; o site real só carrega quando o visitante pede "Ver ao vivo".
 * `data-estado` conduz a animação: `aberto` e `fechando` (estado de saída) animam `transform` e
 * `opacity`; o `<dialog>` só fecha de verdade quando a saída termina. Com movimento reduzido, fecha direto.
 */
const MOVIMENTO_REDUZIDO = '(prefers-reduced-motion: reduce)';
/** Teto da saída: se `animationend` não vier (aba oculta), a janela fecha mesmo assim. */
const LIMITE_DA_SAIDA_MS = 300;

@Component({
  selector: 'app-janela-de-preview',
  imports: [NgOptimizedImage, GlifoFechar],
  templateUrl: './janela-de-preview.html',
  styleUrl: './janela-de-preview.scss',
})
export class JanelaDePreviewComponente {
  protected readonly estado = inject(EstadoDaJanela);
  private readonly janela = inject(DOCUMENT).defaultView;
  private readonly sanitizador = inject(DomSanitizer);
  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');

  protected readonly aoVivo = signal(false);
  /** Preview exibido: acompanha o estado, mas só zera depois da animação de saída. */
  protected readonly exibido = signal<PreviewDeProjeto | null>(null);
  protected readonly saindo = signal(false);
  private limiteDaSaida: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    effect(() => {
      const preview = this.estado.preview();
      untracked(() => (preview ? this.abrir(preview) : this.sair()));
    });
  }

  /** Termina a saída: fecha o `<dialog>` e esvazia o conteúdo. */
  protected finalizarSaida(): void {
    clearTimeout(this.limiteDaSaida);
    if (!this.saindo()) return;
    this.saindo.set(false);
    this.exibido.set(null);
    this.fecharDialogo();
  }

  /** Escape: em vez do fechamento nativo imediato, passa pelo estado de saída. */
  protected aoCancelar(evento: Event): void {
    evento.preventDefault();
    this.fechar();
  }

  protected aoTerminarAnimacao(evento: AnimationEvent): void {
    if (evento.target === evento.currentTarget && this.saindo()) this.finalizarSaida();
  }

  private abrir(preview: PreviewDeProjeto): void {
    clearTimeout(this.limiteDaSaida);
    this.saindo.set(false);
    this.aoVivo.set(false);
    this.exibido.set(preview);
    const dialogo = this.dialogo().nativeElement;
    if (!dialogo.open) dialogo.showModal();
  }

  private sair(): void {
    if (!this.dialogo().nativeElement.open) return;
    const reduzido = this.janela?.matchMedia?.(MOVIMENTO_REDUZIDO).matches ?? true;
    if (reduzido) {
      this.saindo.set(true);
      this.finalizarSaida();
      return;
    }
    this.saindo.set(true);
    this.limiteDaSaida = setTimeout(() => this.finalizarSaida(), LIMITE_DA_SAIDA_MS);
  }

  private fecharDialogo(): void {
    const dialogo = this.dialogo().nativeElement;
    if (dialogo.open) dialogo.close();
  }

  /** A URL vem do registro `core/previews.ts` (nunca de entrada do visitante), por isso é confiável. */
  protected urlDoSite(url: string): SafeResourceUrl {
    return this.sanitizador.bypassSecurityTrustResourceUrl(url);
  }

  protected alternarAoVivo(): void {
    this.aoVivo.update((valor) => !valor);
  }

  protected fechar(): void {
    this.estado.fechar();
  }
}
