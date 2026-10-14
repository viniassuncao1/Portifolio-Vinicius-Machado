import {
  comentario,
  comum,
  declaracao,
  linha,
  literal,
  palavraChave,
  valor,
  vazia,
} from '../../shared/editor-de-codigo/conteudo';
import type { ConteudoDoEditor } from '../../shared/editor-de-codigo/conteudo';

/** Conteúdo da parte "Education" da tela 28 (design/telas/tela-28.png), no estilo de leitura (ADR-0011). */
export const CONTEUDO_FORMACAO: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('package'), comum(' dev.vinicius.portfolio.formacao;')),
  vazia(),
  linha(0, palavraChave('public class'), comum(' Formacao {')),
  vazia(),
  linha(1, comentario('// Graduação: instituição, curso e ano previsto de formatura')),
  linha(1, palavraChave('record'), comum(' Graduacao(')),
  linha(2, declaracao('String instituicao'), comum(',')),
  linha(2, declaracao('String curso'), comum(',')),
  linha(2, declaracao('int anoPrevistoDeFormatura'), comum(') {}')),
  vazia(),
  linha(1, comentario('// Minha graduação')),
  linha(
    1,
    declaracao('Graduacao'),
    comum(' graduacao = '),
    palavraChave('new'),
    comum(' Graduacao('),
  ),
  linha(2, literal('"UniCEUB"'), comum(',')),
  linha(2, literal('"Bacharelado em Ciência da Computação"'), comum(',')),
  linha(2, valor('2027')),
  linha(1, comum(');')),
  vazia(),
  linha(0, comum('}')),
];
