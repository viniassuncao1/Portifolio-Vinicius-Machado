import { Component, inject } from '@angular/core';

import { JanelaDePreview } from '../../core/janela-de-preview';
import { Icone } from '../../shared/icone/icone';
import type { NomeDoIcone } from '../../shared/icone/icone';

interface BotaoDaBarra {
  readonly icone: NomeDoIcone;
  /** Distância do centro do ícone à borda esquerda, em rem, medida na tela 02. */
  readonly x: number;
}

const BOTOES: readonly BotaoDaBarra[] = [
  { icone: 'java', x: 2.75 },
  { icone: 'pasta', x: 6 },
  { icone: 'projeto', x: 9.15 },
  { icone: 'executar', x: 11.95 },
  { icone: 'configuracoes', x: 14.55 },
  { icone: 'buscar', x: 17.55 },
  { icone: 'depurar', x: 22.85 },
  { icone: 'estrutura', x: 25.1 },
];

/**
 * Barra de ferramentas da IDE: só imita o Eclipse, por isso fica fora da leitura e do foco.
 * A exceção é o play, que vira o botão "Executar o projeto" nas rotas com site para ver.
 */
@Component({
  selector: 'app-barra-de-ferramentas',
  imports: [Icone],
  host: { '[attr.aria-hidden]': "janela.previewDaRota() ? null : 'true'" },
  templateUrl: './barra-de-ferramentas.html',
  styleUrl: './barra-de-ferramentas.scss',
})
export class BarraDeFerramentas {
  protected readonly botoes = BOTOES;
  protected readonly janela = inject(JanelaDePreview);

  protected executar(evento: Event): void {
    const preview = this.janela.previewDaRota();
    if (preview) this.janela.abrir(preview, evento.currentTarget as HTMLElement);
  }
}
