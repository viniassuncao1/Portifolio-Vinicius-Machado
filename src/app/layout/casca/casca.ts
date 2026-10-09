import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { EstrategiaDeTitulo } from '../../core/estrategia-de-titulo';
import { AbaDoEditor } from '../aba-do-editor/aba-do-editor';
import { BarraDeFerramentas } from '../barra-de-ferramentas/barra-de-ferramentas';
import { PainelLateral } from '../painel-lateral/painel-lateral';

/**
 * Casca da IDE: barra de ferramentas, painel lateral e a aba com o editor onde as rotas entram.
 * Abaixo de 768px o painel vira uma gaveta aberta pelo botão "Seções" (o estado fica em
 * `data-aberta` no painel, para o Compasso animar).
 */
@Component({
  selector: 'app-casca',
  imports: [RouterOutlet, BarraDeFerramentas, PainelLateral, AbaDoEditor],
  templateUrl: './casca.html',
  styleUrl: './casca.scss',
  host: { '(keydown.escape)': 'fecharEDevolverFoco()' },
})
export class Casca {
  private readonly injector = inject(Injector);
  private readonly painel = viewChild.required(PainelLateral);
  private readonly botao = viewChild.required<ElementRef<HTMLButtonElement>>('botaoSecoes');

  protected readonly titulo = inject(EstrategiaDeTitulo).titulo;
  protected readonly gavetaAberta = signal(false);

  protected alternarGaveta(): void {
    if (this.gavetaAberta()) {
      this.fecharGaveta();
      return;
    }
    this.gavetaAberta.set(true);
    afterNextRender(() => this.painel().focarPrimeiroItem(), { injector: this.injector });
  }

  protected fecharGaveta(): void {
    this.gavetaAberta.set(false);
  }

  /** Fecha a gaveta (Escape ou escolha de seção) e devolve o foco ao botão "Seções". */
  protected fecharEDevolverFoco(): void {
    if (!this.gavetaAberta()) return;
    this.fecharGaveta();
    this.botao().nativeElement.focus();
  }
}
