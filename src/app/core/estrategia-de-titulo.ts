import { Service, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import type { DadosDePagina } from './secoes';
import { TITULO_DA_JANELA_INICIO, TITULO_DO_SITE, TITULO_INICIO } from './titulos';

/**
 * Título da rota atual: vai para o h1 da casca e, no formato "<seção> | Vinicius Machado", para a
 * janela do navegador. O Início mantém o título do index.html.
 */
@Service()
export class EstrategiaDeTitulo extends TitleStrategy {
  private readonly janela = inject(Title);
  private readonly tituloAtual = signal(TITULO_INICIO);

  readonly titulo = this.tituloAtual.asReadonly();

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const titulo = this.comPagina(this.buildTitle(snapshot) ?? TITULO_INICIO, snapshot);
    this.tituloAtual.set(titulo);
    this.janela.setTitle(
      titulo === TITULO_INICIO ? TITULO_DA_JANELA_INICIO : `${titulo} | ${TITULO_DO_SITE}`,
    );
  }

  /** A partir da página 2 de uma seção, o título leva "(X/N)". */
  private comPagina(titulo: string, snapshot: RouterStateSnapshot): string {
    let rota = snapshot.root;
    while (rota.firstChild) rota = rota.firstChild;
    const { pagina, totalDePaginas } = rota.data as Partial<DadosDePagina>;
    return pagina !== undefined && totalDePaginas !== undefined && pagina > 1
      ? `${titulo} (${pagina}/${totalDePaginas})`
      : titulo;
  }
}
