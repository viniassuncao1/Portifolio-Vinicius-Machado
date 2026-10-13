import {
  comentario,
  comum,
  declaracao,
  javadoc,
  linha,
  literal,
  palavraChave,
  valor,
  vazia,
} from '../../shared/editor-de-codigo/conteudo';
import type { ConteudoDoEditor } from '../../shared/editor-de-codigo/conteudo';

/**
 * Texto da recomendação de Luana Porto, um item por parágrafo, como foi escrito no LinkedIn. Os
 * parágrafos formam um só Javadoc, separados por uma linha em branco.
 */
const TEXTO_LUANA_PORTO: readonly string[] = [
  'Tive a oportunidade de trabalhar com o Vinícius e acompanhar de perto seu trabalho no dia a dia. É um profissional muito comprometido, responsável e colaborativo, sempre disposto a ajudar o time e contribuir para que as entregas aconteçam da melhor forma possível.',
  'Além da parte técnica, se destaca pela facilidade de comunicação, organização e pela forma como lida com desafios e aprende novas tecnologias. É uma pessoa em quem o time pode confiar e que agrega muito ao ambiente de trabalho.',
  'Recomendo o Vinícius com muita tranquilidade e tenho certeza de que será uma ótima adição a qualquer equipe.',
];

/**
 * Conteúdo da seção Depoimentos/Recomendações (referência visual: design/telas/tela-29.png).
 * Para acrescentar uma recomendação: declare a constante com o Javadoc do texto e inclua o nome
 * dela em `ALL`.
 */
export const CONTEUDO_DEPOIMENTOS: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('import'), comum(' java.time.LocalDate;')),
  linha(0, palavraChave('import'), comum(' java.util.List;')),
  vazia(),
  linha(0, palavraChave('public class'), comum('  Recommendations {')),
  vazia(),
  linha(1, comentario('// Cada recomendação tem quem escreveu, o cargo, a relação e a data')),
  linha(
    1,
    palavraChave('record'),
    comum(' Recommendation('),
    declaracao('String author'),
    comum(', '),
    declaracao('String role'),
    comum(', '),
    declaracao('String relationship'),
    comum(', '),
    declaracao('LocalDate date'),
    comum(') {}'),
  ),
  vazia(),
  linha(1, comentario('// Recomendação recebida no LinkedIn')),
  javadoc(1, TEXTO_LUANA_PORTO.join('\n\n')),
  linha(
    1,
    palavraChave('static final'),
    declaracao(' Recommendation'),
    comum(' LUANA_PORTO = '),
    palavraChave('new'),
    comum(' Recommendation('),
  ),
  linha(2, literal('"Luana Porto"'), comum(',')),
  linha(2, literal('"Desenvolvedor Backend Java"'), comum(',')),
  linha(2, literal('"Trabalhou na mesma equipe"'), comum(',')),
  linha(
    2,
    comum('LocalDate.of('),
    valor('2026'),
    comum(', '),
    valor('9'),
    comum(', '),
    valor('22'),
    comum(')'),
  ),
  linha(1, comum(');')),
  vazia(),
  linha(1, comentario('// Todas as recomendações, na ordem em que aparecem')),
  linha(
    1,
    palavraChave('static final'),
    declaracao(' List<Recommendation>'),
    comum(' ALL = List.of('),
  ),
  linha(2, comum('LUANA_PORTO')),
  linha(1, comum(');')),
  vazia(),
  linha(0, comum('}')),
];
