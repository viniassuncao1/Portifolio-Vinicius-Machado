import { Service } from '@angular/core';

/** Nome da View Transition que liga o cartão ao painel dos detalhes (ver `_movimento.scss`). */
export const NOME_DA_TRANSICAO_DO_PROJETO = 'projeto';

export type SentidoDaTransicao = 'abrir' | 'fechar';

/**
 * Combinado entre a vitrine e o handler de View Transition do roteador: antes de navegar, a vitrine
 * diz qual cartão é a origem (ou o destino) da expansão e em que sentido; o handler usa isso para
 * pôr o nome da transição no cartão só durante o intervalo certo e limpa o combinado no fim.
 * Navegações sem combinado (Voltar do navegador, trocar de projeto) não animam.
 */
@Service()
export class TransicaoDoProjeto {
  private pendente: { cartao: HTMLElement; sentido: SentidoDaTransicao } | null = null;
  /** `true` enquanto a View Transition corre: o nome fica no cartão até ela terminar. */
  emAndamento = false;

  preparar(cartao: HTMLElement, sentido: SentidoDaTransicao): void {
    this.pendente = { cartao, sentido };
    // Na ida o cartão já carrega o nome quando o roteador captura o estado de antes.
    if (sentido === 'abrir')
      cartao.style.setProperty('view-transition-name', NOME_DA_TRANSICAO_DO_PROJETO);
  }

  /** Lê e consome o combinado: uma navegação só anima uma vez. */
  consumir(): { cartao: HTMLElement; sentido: SentidoDaTransicao } | null {
    const atual = this.pendente;
    this.pendente = null;
    return atual;
  }

  /**
   * Fim de uma transição: o cartão dela larga o nome. Um combinado novo (o visitante já fechou
   * enquanto a expansão terminava) não é tocado, senão a volta perderia a animação.
   */
  terminar(cartao: HTMLElement): void {
    cartao.style.removeProperty('view-transition-name');
    if (this.pendente === null) this.emAndamento = false;
  }

  /** Fim da navegação sem animação (ou animação pulada): nada fica combinado nem no cartão. */
  limpar(cartao: HTMLElement | null): void {
    this.pendente = null;
    this.emAndamento = false;
    cartao?.style.removeProperty('view-transition-name');
  }
}
