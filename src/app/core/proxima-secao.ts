import { SECOES } from './secoes';
import type { Secao } from './secoes';

/**
 * Seção que vem depois da aberta em `url`, na ordem da árvore, ou `null` quando não há link a
 * mostrar: no Início (que tem os próprios atalhos) e na última seção. Cada seção é um arquivo só,
 * então o link leva sempre à seção seguinte.
 */
export const proximaSecao = (url: string): Secao | null => {
  const [slug] = url.split(/[?#]/)[0].split('/').filter(Boolean);
  const indice = SECOES.findIndex((secao) => secao.slug === slug);
  return indice === -1 ? null : (SECOES[indice + 1] ?? null);
};
