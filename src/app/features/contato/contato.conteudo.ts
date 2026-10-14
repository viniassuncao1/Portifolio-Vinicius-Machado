import {
  comentario,
  comum,
  declaracao,
  linha,
  link,
  literal,
  palavraChave,
  vazia,
} from '../../shared/editor-de-codigo/conteudo';
import type { ConteudoDoEditor } from '../../shared/editor-de-codigo/conteudo';

/** Conteúdo da tela 30 (design/telas/tela-30.png), no estilo de leitura (ADR-0011); os quatro contatos são links reais. */
export const CONTEUDO_CONTATO: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('package'), comum(' dev.vinicius.portfolio.contato;')),
  vazia(),
  linha(0, palavraChave('public class'), comum(' Contato {')),
  vazia(),
  linha(1, comentario('// Como falar comigo: e-mail, telefone, LinkedIn e GitHub')),
  linha(1, palavraChave('record'), comum(' Contatos(')),
  linha(2, declaracao('String email'), comum(',')),
  linha(2, declaracao('String telefone'), comum(',')),
  linha(2, declaracao('String linkedin'), comum(',')),
  linha(2, declaracao('String github'), comum(') {}')),
  vazia(),
  linha(1, comentario('// Fale comigo: clique em qualquer contato abaixo')),
  linha(1, declaracao('Contatos'), comum(' vinicius = '), palavraChave('new'), comum(' Contatos(')),
  linha(
    2,
    link(literal('"viniciusmassuncao@gmail.com"'), 'mailto:viniciusmassuncao@gmail.com'),
    comum(','),
  ),
  linha(2, link(literal('"+55 61 98283-7805"'), 'tel:+5561982837805'), comum(',')),
  linha(
    2,
    link(literal('"linkedin.com/in/viniassuncao"'), 'https://linkedin.com/in/viniassuncao'),
    comum(','),
  ),
  linha(2, link(literal('"github.com/viniassuncao1"'), 'https://github.com/viniassuncao1')),
  linha(1, comum(');')),
  vazia(),
  linha(0, comum('}')),
];
