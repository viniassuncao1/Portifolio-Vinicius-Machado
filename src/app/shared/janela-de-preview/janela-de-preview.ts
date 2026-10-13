import { NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import type { SafeResourceUrl } from '@angular/platform-browser';

import { JanelaDePreview as EstadoDaJanela } from '../../core/janela-de-preview';
import { GlifoFechar } from '../glifo-fechar/glifo-fechar';

/**
 * Janela de preview de um projeto, no estilo de uma janela de IDE, montada uma vez na Casca.
 * É um `<dialog>` modal: o foco fica preso dentro dela e Escape fecha.
 * Abre com a captura do site; o site real só carrega quando o visitante pede "Ver ao vivo".
 * O atributo `data-estado` (`aberto`) fica pronto para a animação do Compasso.
 */
@Component({
  selector: 'app-janela-de-preview',
  imports: [NgOptimizedImage, GlifoFechar],
  templateUrl: './janela-de-preview.html',
  styleUrl: './janela-de-preview.scss',
})
export class JanelaDePreviewComponente {
  protected readonly estado = inject(EstadoDaJanela);
  private readonly sanitizador = inject(DomSanitizer);
  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');

  protected readonly aoVivo = signal(false);

  constructor() {
    effect(() => {
      const dialogo = this.dialogo().nativeElement;
      if (this.estado.preview()) {
        this.aoVivo.set(false);
        if (!dialogo.open) dialogo.showModal();
      } else if (dialogo.open) {
        dialogo.close();
      }
    });
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
