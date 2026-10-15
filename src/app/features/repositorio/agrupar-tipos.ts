import type { ContagemPorTipo } from '../../core/git/resumo';
import { TIPO_OUTROS } from '../../core/git/resumo';

/** Fatia (em %) abaixo da qual um tipo entra em `outros`. */
export const LIMITE_DO_TIPO_PEQUENO = 3;

export interface TipoAgrupado extends ContagemPorTipo {
  /** Tipos reunidos em `outros`, em texto para a legenda ("ci, build, style e sem tipo"). */
  readonly reunidos?: string;
}

const emTexto = (nomes: readonly string[]): string =>
  nomes.length > 1 ? `${nomes.slice(0, -1).join(', ')} e ${nomes.at(-1)}` : (nomes[0] ?? '');

/**
 * Reúne em `outros` os tipos com menos de {@link LIMITE_DO_TIPO_PEQUENO}% dos commits (e os
 * commits sem tipo), para que cada cor da barra seja um tipo só. `outros` fica por último. Um tipo
 * pequeno sozinho, sem commits sem tipo, continua com o próprio nome.
 */
export function agruparTiposPequenos(tipos: readonly ContagemPorTipo[]): readonly TipoAgrupado[] {
  const pequenos = tipos.filter(
    (t) => t.tipo === TIPO_OUTROS || t.porcentagem < LIMITE_DO_TIPO_PEQUENO,
  );
  if (pequenos.length < 2) return tipos;

  const grandes = tipos.filter((t) => !pequenos.includes(t));
  const nomes = pequenos.map((t) => (t.tipo === TIPO_OUTROS ? 'sem tipo' : t.tipo));
  const outros: TipoAgrupado = {
    tipo: TIPO_OUTROS,
    quantidade: pequenos.reduce((soma, t) => soma + t.quantidade, 0),
    porcentagem: pequenos.reduce((soma, t) => soma + t.porcentagem, 0),
    reunidos: emTexto([
      ...nomes.filter((n) => n !== 'sem tipo'),
      ...nomes.filter((n) => n === 'sem tipo'),
    ]),
  };
  return [...grandes, outros];
}
