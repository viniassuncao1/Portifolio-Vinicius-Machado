import { SECOES, totalDePaginas } from './secoes';
import type { Secao } from './secoes';

/**
 * Seção que vem depois da aberta em `url`, na ordem da árvore, ou `null` quando não há link a
 * mostrar: no Início (que tem os próprios atalhos), na última seção e antes da última página de
 * uma seção paginada (ali o controle de páginas já leva adiante).
 */
export const proximaSecao = (url: string): Secao | null => {
  const [slug, pagina] = url.split(/[?#]/)[0].split('/').filter(Boolean);
  const indice = SECOES.findIndex((secao) => secao.slug === slug);
  if (indice === -1) return null;

  const numero = pagina ? Number(pagina) : 1;
  return numero < totalDePaginas(SECOES[indice]) ? null : (SECOES[indice + 1] ?? null);
};
