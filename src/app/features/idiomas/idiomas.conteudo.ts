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

/** Conteúdo da parte "Lenguages" da tela 28 (design/telas/tela-28.png), no estilo de leitura (ADR-0011). */
export const CONTEUDO_IDIOMAS: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('package'), comum(' dev.vinicius.portfolio.formacao;')),
  vazia(),
  linha(0, palavraChave('public class'), comum(' Idiomas {')),
  vazia(),
  linha(1, comentario('// Idiomas que eu falo e o nível de cada um')),
  linha(1, declaracao('String'), comum(' ingles = '), literal('"Básico"'), comum(';')),
  linha(1, declaracao('String'), comum(' espanhol = '), literal('"Básico"'), comum(';')),
  vazia(),
  linha(0, comum('}')),
];
