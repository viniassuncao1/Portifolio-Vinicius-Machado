import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { EstrategiaDeTitulo } from '../../core/estrategia-de-titulo';
import { AbaDoEditor } from '../aba-do-editor/aba-do-editor';
import { BarraDeFerramentas } from '../barra-de-ferramentas/barra-de-ferramentas';
import { PainelLateral } from '../painel-lateral/painel-lateral';

/** Casca da IDE: barra de ferramentas, painel lateral e a aba com o editor onde as rotas entram. */
@Component({
  selector: 'app-casca',
  imports: [RouterOutlet, BarraDeFerramentas, PainelLateral, AbaDoEditor],
  templateUrl: './casca.html',
  styleUrl: './casca.scss',
})
export class Casca {
  protected readonly titulo = inject(EstrategiaDeTitulo).titulo;
}
