import {
  comentario,
  comum,
  declaracao,
  linha,
  literal,
  palavraChave,
  vazia,
} from '../../shared/editor-de-codigo/conteudo';
import type { ConteudoDoEditor } from '../../shared/editor-de-codigo/conteudo';

/** Conteúdo da parte "Lenguages" da tela 28 (design/telas/tela-28.png). */
export const CONTEUDO_IDIOMAS: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('public class'), comum('  Languages {')),
  vazia(),
  linha(1, comentario('// Idiomas que eu falo e o nível de cada um')),
  linha(
    1,
    palavraChave('static final'),
    declaracao(' String'),
    comum(' ENGLISH = '),
    literal('"Básico"'),
    comum(';'),
  ),
  linha(
    1,
    palavraChave('static final'),
    declaracao(' String'),
    comum(' SPANISH = '),
    literal('"Básico"'),
    comum(';'),
  ),
  vazia(),
  linha(0, comum('}')),
];
