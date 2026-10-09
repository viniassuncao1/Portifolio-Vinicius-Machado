import { Component, computed, inject } from '@angular/core';

import { AbasAbertas } from '../../core/abas-abertas';
import { EstadoDoEditor } from '../../core/estado-do-editor';
import { ARQUIVO_INICIO } from '../../core/secoes';

/**
 * Barra de status no rodapé da casca. É uma região `status`, mas só o nome do arquivo é lido:
 * a posição do cursor muda a cada clique e fica fora da leitura (`aria-hidden`).
 */
@Component({
  selector: 'app-barra-de-status',
  templateUrl: './barra-de-status.html',
  styleUrl: './barra-de-status.scss',
})
export class BarraDeStatus {
  private readonly abas = inject(AbasAbertas);
  private readonly editor = inject(EstadoDoEditor);

  protected readonly arquivo = computed(() => this.abas.ativa()?.arquivo ?? ARQUIVO_INICIO);
  protected readonly posicao = computed(() => `${this.editor.linha()}:${this.editor.coluna()}`);
  protected readonly codificacao = 'UTF-8';
  protected readonly versaoDoJava = 'Java 21';
  protected readonly ramo = 'main';
}
