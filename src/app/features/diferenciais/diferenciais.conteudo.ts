import {
  comentario,
  comum,
  declaracao,
  linha,
  literal,
  palavraChave,
  javadoc,
  valor,
  vazia,
} from '../../shared/editor-de-codigo/conteudo';
import type { ConteudoDoEditor } from '../../shared/editor-de-codigo/conteudo';

/** Conteúdo da tela 03 (design/telas/tela-03.png) em Java moderno: um record com Javadoc. */
export const CONTEUDO_DIFERENCIAIS: ConteudoDoEditor = [
  vazia(),
  javadoc(
    0,
    'Moro em Brasília há 20 anos. Sou mineiro, extrovertido, curioso e gosto de uma boa discussão, principalmente com quem sabe mais do que eu sobre algum assunto. Estou disposto a experiências novas e não me prendo só a back-end ou front-end: gosto de testar, aprender e encarar o que aparecer pela frente.',
  ),
  linha(0, palavraChave('public record'), comum(' PersonalData(')),
  linha(2, declaracao('String hometown'), comum(',')),
  linha(2, declaracao('String city'), comum(',')),
  linha(2, declaracao('int yearsInCity'), comum(',')),
  linha(2, declaracao('boolean extrovert'), comum(',')),
  linha(2, declaracao('boolean curious'), comum(',')),
  linha(2, declaracao('boolean loveToLearn')),
  linha(0, comum(') {')),
  vazia(),
  linha(1, comentario('// Quem sou eu, em dados')),
  linha(
    1,
    palavraChave('public static final'),
    comum(' PersonalData VINICIUS = '),
    palavraChave('new'),
    comum(' PersonalData('),
  ),
  linha(3, literal('"Mineiro"'), comum(',')),
  linha(3, literal('"Brasília"'), comum(',')),
  linha(3, valor('20'), comum(','), comentario(' // anos em Brasília')),
  linha(3, valor('true'), comum(','), comentario(' // extrovertido')),
  linha(3, valor('true'), comum(','), comentario(' // curioso')),
  linha(3, valor('true'), comentario('  // gosta de aprender')),
  linha(1, comum(');')),
  linha(0, comum('}')),
];
