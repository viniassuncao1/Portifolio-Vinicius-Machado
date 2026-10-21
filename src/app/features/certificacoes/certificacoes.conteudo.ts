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
import { CURSOS } from '../../core/perfil';
import type { CursoDoPerfil } from '../../core/perfil';
import type { ConteudoDoEditor, Linha } from '../../shared/editor-de-codigo/conteudo';

const curso = (c: CursoDoPerfil): readonly Linha[] => {
  const [ano, mes, dia] = c.concluidoEm;
  return [
    linha(
      1,
      declaracao('Certificacao'),
      comum(` ${c.variavel} = `),
      palavraChave('new'),
      comum(' Certificacao('),
    ),
    linha(2, literal(`"${c.nome}"`), comum(',')),
    linha(
      2,
      valor(String(c.horas)),
      comum(', LocalDate.of('),
      valor(String(ano)),
      comum(', '),
      valor(String(mes)),
      comum(', '),
      valor(String(dia)),
      comum('));'),
    ),
    vazia(),
  ];
};

/**
 * Conteúdo da seção (telas 19 a 21) num arquivo só: o cabeçalho e o record uma vez, e os nove
 * cursos num bloco, do mais recente para o mais antigo.
 */
export const CONTEUDO_CERTIFICACOES: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('package'), comum(' dev.vinicius.portfolio.formacao;')),
  vazia(),
  linha(0, palavraChave('import'), comum(' java.time.LocalDate;')),
  vazia(),
  linha(0, palavraChave('public class'), comum(' Certificacoes {')),
  vazia(),
  linha(1, comentario('// Cada curso tem o nome, as horas e a data de conclusão')),
  linha(
    1,
    palavraChave('record'),
    comum(' Certificacao('),
    declaracao('String curso'),
    comum(', '),
    declaracao('int horas'),
    comum(', '),
    declaracao('LocalDate concluidoEm'),
    comum(') {}'),
  ),
  vazia(),
  linha(1, comentario('// Cursos concluídos, do mais recente para o mais antigo')),
  ...CURSOS.flatMap(curso),
  linha(0, comum('}')),
];
