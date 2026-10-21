import { Component, computed, inject } from '@angular/core';

import { Abertura } from '../../core/abertura';
import { AbasAbertas } from '../../core/abas-abertas';
import { breadcrumbs } from '../../core/breadcrumbs';
import { SHA_CURTO_DO_BUILD, SHA_DO_BUILD } from '../../core/build.gerado';
import { EstadoDoEditor } from '../../core/estado-do-editor';
import { RelogioDeBrasilia } from '../../core/relogio-de-brasilia';
import { ARQUIVO_INICIO, SECOES } from '../../core/secoes';
import { Icone } from '../../shared/icone/icone';

const REPOSITORIO = 'https://github.com/viniassuncao1/Portifolio-Vinicius-Machado';

/**
 * Barra de status da New UI no rodapé da casca. É o landmark `contentinfo` (`<footer>`; `role=status` não
 * é permitido nele). Só o nome do arquivo e o aviso de inicialização são regiões `status`, lidas ao
 * mudar: o caminho e a posição do cursor (que muda a cada clique) ficam fora da leitura.
 */
@Component({
  selector: 'app-barra-de-status',
  imports: [Icone],
  templateUrl: './barra-de-status.html',
  styleUrl: './barra-de-status.scss',
})
export class BarraDeStatus {
  private readonly abas = inject(AbasAbertas);
  private readonly editor = inject(EstadoDoEditor);
  protected readonly hora = inject(RelogioDeBrasilia).hora;
  /** Aviso de inicialização, por 6 s depois das boas-vindas; vazio nas demais horas. */
  private readonly abertura = inject(Abertura);
  protected readonly aviso = this.abertura.aviso;
  /** Na revelação o aviso é o destino da janela de Run (View Transition `console-de-run`). */
  protected readonly nomeDaTransicao = computed(() =>
    this.abertura.fase() === 'revelando' ? 'console-de-run' : null,
  );

  private readonly segmentos = computed(() => {
    const arquivo = this.abas.ativa()?.arquivo ?? ARQUIVO_INICIO;
    return breadcrumbs({ arquivo, pacote: SECOES.find((s) => s.arquivo === arquivo)?.pacote });
  });

  /** Os segmentos antes do arquivo: o do meio encolhe com reticências quando falta espaço. */
  protected readonly projeto = computed(() => this.segmentos()[0]);
  protected readonly caminho = computed(() => this.segmentos().slice(1, -1).join(' › '));
  protected readonly arquivo = computed(() => this.segmentos().at(-1) ?? ARQUIVO_INICIO);
  protected readonly posicao = computed(() => `${this.editor.linha()}:${this.editor.coluna()}`);
  protected readonly quebraDeLinha = 'LF';
  protected readonly codificacao = 'UTF-8';
  protected readonly indentacao = '4 spaces';
  protected readonly ramo = 'master';
  /** Commit do deploy; sem ele (build local) o item não aparece. */
  protected readonly commit =
    SHA_DO_BUILD && SHA_CURTO_DO_BUILD
      ? { curto: SHA_CURTO_DO_BUILD, endereco: `${REPOSITORIO}/commit/${SHA_DO_BUILD}` }
      : null;
}
