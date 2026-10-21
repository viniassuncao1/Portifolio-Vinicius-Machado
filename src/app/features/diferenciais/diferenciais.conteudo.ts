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
import { DIFERENCIAIS } from '../../core/perfil';
import type { ConteudoDoEditor } from '../../shared/editor-de-codigo/conteudo';

/** Conteúdo da tela 03 (design/telas/tela-03.png) no estilo de leitura (ADR-0011): dados pessoais em português. */
export const CONTEUDO_DIFERENCIAIS: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('package'), comum(' dev.vinicius.portfolio.sobre;')),
  vazia(),
  javadoc(0, DIFERENCIAIS.texto),
  linha(0, palavraChave('public class'), comum(' Diferenciais {')),
  vazia(),
  linha(1, comentario('// Os dados que me definem')),
  linha(1, palavraChave('record'), comum(' DadosPessoais(')),
  linha(3, declaracao('String origem'), comum(',')),
  linha(3, declaracao('String cidade'), comum(',')),
  linha(3, declaracao('int anosNaCidade'), comum(',')),
  linha(3, declaracao('boolean extrovertido'), comum(',')),
  linha(3, declaracao('boolean curioso'), comum(',')),
  linha(3, declaracao('boolean gostaDeAprender'), comum(') {}')),
  vazia(),
  linha(1, comentario('// Quem sou eu, em dados')),
  linha(1, comum('DadosPessoais vinicius = '), palavraChave('new'), comum(' DadosPessoais(')),
  linha(3, literal('"Mineiro"'), comum(',')),
  linha(3, literal('"Brasília"'), comum(',')),
  linha(3, valor('20'), comum(','), comentario(' // anos em Brasília')),
  linha(3, valor('true'), comum(','), comentario(' // extrovertido')),
  linha(3, valor('true'), comum(','), comentario(' // curioso')),
  linha(3, valor('true'), comentario('  // gosta de aprender')),
  linha(1, comum(');')),
  linha(0, comum('}')),
];
