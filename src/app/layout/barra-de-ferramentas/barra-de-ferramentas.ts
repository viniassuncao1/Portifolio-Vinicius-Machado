import { Component } from '@angular/core';

import { Icone } from '../../shared/icone/icone';
import type { NomeDoIcone } from '../../shared/icone/icone';

interface BotaoDaBarra {
  readonly icone: NomeDoIcone;
  /** Distância da borda esquerda, em rem, medida na tela 02. */
  readonly x: number;
}

const BOTOES: readonly BotaoDaBarra[] = [
  { icone: 'arquivo', x: 2 },
  { icone: 'pasta', x: 5.25 },
  { icone: 'projeto', x: 8.4 },
  { icone: 'executar', x: 11.2 },
  { icone: 'ferramenta', x: 13.8 },
  { icone: 'ia', x: 16.8 },
  { icone: 'relogio', x: 22.1 },
  { icone: 'monitor', x: 24.3 },
];

/** Barra de ferramentas da IDE: só imita o Eclipse, por isso fica fora da leitura e do foco. */
@Component({
  selector: 'app-barra-de-ferramentas',
  imports: [Icone],
  host: { 'aria-hidden': 'true' },
  templateUrl: './barra-de-ferramentas.html',
  styleUrl: './barra-de-ferramentas.scss',
})
export class BarraDeFerramentas {
  protected readonly botoes = BOTOES;
}
