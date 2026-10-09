import { Component } from '@angular/core';

import { Icone } from '../../shared/icone/icone';
import type { NomeDoIcone } from '../../shared/icone/icone';

interface BotaoDaBarra {
  readonly icone: NomeDoIcone;
  /** Distância do centro do ícone à borda esquerda, em rem, medida na tela 02. */
  readonly x: number;
}

const BOTOES: readonly BotaoDaBarra[] = [
  { icone: 'arquivo', x: 2.75 },
  { icone: 'pasta', x: 6 },
  { icone: 'projeto', x: 9.15 },
  { icone: 'executar', x: 11.95 },
  { icone: 'ferramenta', x: 14.55 },
  { icone: 'ia', x: 17.55 },
  { icone: 'relogio', x: 22.85 },
  { icone: 'monitor', x: 25.1 },
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
