import {
  comum,
  declaracao,
  linha,
  literal,
  palavraChave,
  valor,
  vazia,
} from '../../shared/editor-de-codigo/conteudo';
import type { ConteudoDoEditor } from '../../shared/editor-de-codigo/conteudo';

/** Conteúdo da parte "Education" da tela 28 (design/telas/tela-28.png). */
export const CONTEUDO_FORMACAO: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('import'), comum(' java.time.Year;')),
  vazia(),
  linha(0, palavraChave('public class'), comum('  Education {')),
  vazia(),
  linha(1, palavraChave('record'), comum(' Degree(')),
  linha(3, declaracao('String institution'), comum(',')),
  linha(3, declaracao('String course'), comum(',')),
  linha(3, declaracao('Year expectedGraduation'), comum(') {}')),
  vazia(),
  linha(
    1,
    palavraChave('static final'),
    declaracao(' Degree'),
    comum(' DEGREE = '),
    palavraChave('new'),
    comum(' Degree('),
  ),
  linha(3, literal('"UniCEUB"'), comum(',')),
  linha(3, literal('"Bacharelado em Ciência da Computação"'), comum(',')),
  linha(3, comum('Year.of('), valor('2027'), comum(')')),
  linha(1, comum(');')),
  vazia(),
  linha(0, comum('}')),
];
