import {
  comentario,
  comum,
  declaracao,
  javadocComRetrato,
  linha,
  literal,
  palavraChave,
  valor,
  vazia,
} from '../../shared/editor-de-codigo/conteudo';
import { RECOMENDACOES } from '../../core/perfil';
import type { ConteudoDoEditor } from '../../shared/editor-de-codigo/conteudo';

const LUANA = RECOMENDACOES[0];

/**
 * Conteúdo da seção Depoimentos/Recomendações (referência visual: design/telas/tela-29.png).
 * Para acrescentar uma recomendação: declare o campo com o Javadoc do texto e inclua o nome dele
 * em `todas`.
 */
export const CONTEUDO_DEPOIMENTOS: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('package'), comum(' dev.vinicius.portfolio.recomendacoes;')),
  vazia(),
  linha(0, palavraChave('import'), comum(' java.time.LocalDate;')),
  linha(0, palavraChave('import'), comum(' java.util.List;')),
  vazia(),
  linha(0, palavraChave('public class'), comum(' Recomendacoes {')),
  vazia(),
  linha(1, comentario('// Cada recomendação tem quem escreveu, o cargo, a relação e a data')),
  linha(
    1,
    palavraChave('record'),
    comum(' Recomendacao('),
    declaracao('String autora'),
    comum(', '),
    declaracao('String cargo'),
    comum(', '),
    declaracao('String relacao'),
    comum(', '),
    declaracao('LocalDate data'),
    comum(') {}'),
  ),
  vazia(),
  linha(1, comentario('// Recomendação recebida no LinkedIn')),
  javadocComRetrato(
    1,
    LUANA.paragrafos.join('\n\n'),
    { src: LUANA.foto.src, alt: LUANA.foto.alt, tamanho: 'pequeno' },
    { nome: LUANA.autora, href: LUANA.linkedin },
  ),
  linha(
    1,
    declaracao('Recomendacao'),
    comum(' luana = '),
    palavraChave('new'),
    comum(' Recomendacao('),
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
  linha(1, declaracao('List<Recomendacao>'), comum(' todas = List.of(luana);')),
  vazia(),
  linha(0, comum('}')),
];
