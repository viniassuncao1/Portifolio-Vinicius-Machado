import { Service, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

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
    const titulo = this.buildTitle(snapshot) ?? TITULO_INICIO;
    this.tituloAtual.set(titulo);
    this.janela.setTitle(
      titulo === TITULO_INICIO ? TITULO_DA_JANELA_INICIO : `${titulo} | ${TITULO_DO_SITE}`,
    );
  }
}
