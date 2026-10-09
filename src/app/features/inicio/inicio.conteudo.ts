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

/** Conteúdo da tela 01 (design/telas/tela-01.png) em Java moderno: o perfil como um record. */
export const CONTEUDO_INICIO: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('package'), comum(' portfolio.viniciusmachado;')),
  vazia(),
  linha(0, palavraChave('import'), comum(' java.util.List;')),
  vazia(),
  linha(0, comentario('/** Desenvolvedor Full Stack Júnior: Java, Spring Boot, Angular e SQL. */')),
  linha(0, palavraChave('public record'), comum(' ViniciusMachado(')),
  linha(2, declaracao('String role'), comum(',')),
  linha(2, declaracao('List<String> stack')),
  linha(0, comum(') '), palavraChave('implements'), comum(' FullStackDeveloper {')),
  vazia(),
  linha(
    1,
    palavraChave('public static final'),
    comum(' ViniciusMachado PROFILE = '),
    palavraChave('new'),
    comum(' ViniciusMachado('),
  ),
  linha(3, literal('"Full Stack Júnior"'), comum(',')),
  linha(3, comum('List.of(')),
  linha(4, literal('"Java"'), comum(',')),
  linha(4, literal('"Spring Boot"'), comum(',')),
  linha(4, literal('"Angular"'), comum(',')),
  linha(4, literal('"SQL"')),
  linha(3, comum(')')),
  linha(1, comum(');')),
  linha(0, comum('}')),
];
