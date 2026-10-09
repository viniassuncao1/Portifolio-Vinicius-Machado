import {
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
  linha(0, palavraChave('import'), comum(' java.util.Map;')),
  vazia(),
  linha(0, palavraChave('public class'), comum('  Languages {')),
  vazia(),
  linha(1, palavraChave('enum'), comum(' Level {')),
  linha(2, declaracao('BASIC'), comum('('), literal('"Básico"'), comum('),')),
  linha(2, declaracao('INTERMEDIATE'), comum('('), literal('"Intermediário"'), comum('),')),
  linha(2, declaracao('ADVANCED'), comum('('), literal('"Avançado"'), comum('),')),
  linha(2, declaracao('FLUENT'), comum('('), literal('"Fluente"'), comum(');')),
  vazia(),
  linha(2, palavraChave('private final'), declaracao(' String label'), comum(';')),
  vazia(),
  linha(2, comum('Level('), declaracao('String label'), comum(') {')),
  linha(3, palavraChave('this'), comum('.label = label;')),
  linha(2, comum('}')),
  linha(1, comum('}')),
  vazia(),
  linha(
    1,
    palavraChave('static final'),
    declaracao(' Map<String, Level>'),
    comum(' SPOKEN = Map.of('),
  ),
  linha(3, literal('"Inglês"'), comum(', Level.BASIC,')),
  linha(3, literal('"Espanhol"'), comum(', Level.BASIC')),
  linha(1, comum(');')),
  vazia(),
  linha(0, comum('}')),
];
