import {
  comum,
  declaracao,
  linha,
  link,
  literal,
  palavraChave,
  vazia,
} from '../../shared/editor-de-codigo/conteudo';
import type { ConteudoDoEditor } from '../../shared/editor-de-codigo/conteudo';

/** Conteúdo da tela 30 (design/telas/tela-30.png); os quatro contatos são links reais. */
export const CONTEUDO_CONTATO: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('import'), comum(' java.net.URI;')),
  vazia(),
  linha(0, palavraChave('public record'), comum('  Contact(')),
  linha(2, declaracao('String email'), comum(',')),
  linha(2, declaracao('String phone'), comum(',')),
  linha(2, declaracao('URI linkedin'), comum(',')),
  linha(2, declaracao('URI github'), comum(') {')),
  vazia(),
  linha(
    1,
    palavraChave('public static final'),
    declaracao(' Contact'),
    comum(' VINICIUS = '),
    palavraChave('new'),
    comum(' Contact('),
  ),
  linha(
    3,
    link(literal('"viniciusmassuncao@gmail.com"'), 'mailto:viniciusmassuncao@gmail.com'),
    comum(','),
  ),
  linha(3, link(literal('"+55 61 98283-7805"'), 'tel:+5561982837805'), comum(',')),
  linha(
    3,
    comum('URI.create('),
    link(literal('"https://linkedin.com/in/viniassuncao"'), 'https://linkedin.com/in/viniassuncao'),
    comum('),'),
  ),
  linha(
    3,
    comum('URI.create('),
    link(literal('"https://github.com/viniassuncao1"'), 'https://github.com/viniassuncao1'),
    comum(')'),
  ),
  linha(1, comum(');')),
  vazia(),
  linha(0, comum('}')),
];
