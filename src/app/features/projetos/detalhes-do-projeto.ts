import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  output,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { contadorDoProjeto } from '../../core/projetos';
import type { Projeto } from '../../core/projetos';
import { CapaEmCodigoDoProjeto } from './capa-em-codigo';

/**
 * Detalhes de um projeto num `<dialog>` modal nativo: o navegador prende o foco, trava o fundo
 * (`inert`) e trata o Esc. A vitrine decide quando abrir e fechar (e anima a expansão a partir do
 * cartão); aqui só o estado `projeto` liga e desliga o diálogo.
 */
@Component({
  selector: 'app-detalhes-do-projeto',
  host: { '(keydown)': 'aoTeclar($event)' },
  imports: [RouterLink, NgOptimizedImage, CapaEmCodigoDoProjeto],
  templateUrl: './detalhes-do-projeto.html',
  styleUrl: './detalhes-do-projeto.scss',
})
export class DetalhesDoProjeto {
  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');
  private readonly destruir = inject(DestroyRef);
  private readonly injector = inject(Injector);

  readonly projeto = input<Projeto | null>(null);
  readonly fechado = output<void>();
  /** -1 para o projeto anterior, 1 para o próximo. */
  readonly navegar = output<-1 | 1>();

  protected readonly contador = computed(() => {
    const projeto = this.projeto();
    return projeto ? contadorDoProjeto(projeto) : '';
  });
  /** Imagem da galeria; volta à primeira a cada projeto. */
  protected readonly indiceDaImagem = linkedSignal<Projeto | null, number>({
    source: this.projeto,
    computation: () => 0,
  });
  protected readonly imagem = computed(
    () => this.projeto()?.imagens[this.indiceDaImagem()] ?? null,
  );

  constructor() {
    effect(() => {
      const aberto = this.projeto() !== null;
      const dialogo = this.dialogo().nativeElement;
      if (aberto && !dialogo.open) {
        if (typeof dialogo.showModal === 'function') dialogo.showModal();
        else dialogo.setAttribute('open', '');
        // O conteúdo do @if só existe depois desta passada: o foco inicial vai para Fechar.
        afterNextRender(() => dialogo.querySelector<HTMLElement>('.fechar')?.focus(), {
          injector: this.injector,
        });
      } else if (!aberto && dialogo.open) {
        if (typeof dialogo.close === 'function') dialogo.close();
        else dialogo.removeAttribute('open');
      }
    });
    this.destruir.onDestroy(() => {
      const dialogo = this.dialogo().nativeElement;
      if (dialogo.open && typeof dialogo.close === 'function') dialogo.close();
    });
  }

  /** O Esc dispara `cancel`: a vitrine fecha com a animação, então o fechamento nativo é barrado. */
  protected aoCancelar(evento: Event): void {
    evento.preventDefault();
    this.fechado.emit();
  }

  protected aoTeclar(evento: KeyboardEvent): void {
    if (evento.key === 'Tab') {
      this.prenderFoco(evento);
      return;
    }
    if (evento.key === 'ArrowRight') this.navegar.emit(1);
    else if (evento.key === 'ArrowLeft') this.navegar.emit(-1);
  }

  /** Tab na última ação volta à primeira (e Shift+Tab na primeira vai à última): o foco não sai do diálogo. */
  private prenderFoco(evento: KeyboardEvent): void {
    const focaveis = Array.from(
      this.dialogo().nativeElement.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]'),
    );
    const primeiro = focaveis[0];
    const ultimo = focaveis.at(-1);
    const ativo = document.activeElement;
    if (!primeiro || !ultimo) return;
    if (evento.shiftKey && ativo === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && ativo === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  }

  protected escolherImagem(indice: number): void {
    this.indiceDaImagem.set(indice);
  }
}
