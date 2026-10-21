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
import { COMO_USO_IA } from '../../core/perfil';
import type { ConteudoDoEditor } from '../../shared/editor-de-codigo/conteudo';

/** Conteúdo da tela 04 (design/telas/tela-04.png) no estilo de leitura (ADR-0011): a classe `InteligenciaArtificial`. */
export const CONTEUDO_COMO_USO_IA: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('package'), comum(' dev.vinicius.portfolio.sobre;')),
  vazia(),
  linha(0, palavraChave('import'), comum(' java.util.List;')),
  vazia(),
  javadoc(0, COMO_USO_IA.texto),
  linha(0, palavraChave('public class'), comum(' InteligenciaArtificial {')),
  vazia(),
  linha(1, comentario('// Minha visão: IA é parte do trabalho, não modismo')),
  linha(1, declaracao('boolean modismo'), comum(' = '), valor('false'), comum(';')),
  linha(1, declaracao('boolean parteDoTrabalho'), comum(' = '), valor('true'), comum(';')),
  vazia(),
  linha(1, comentario('// Ferramentas e método que uso no dia a dia')),
  linha(
    1,
    comum('List<String> ferramentas = List.of('),
    literal('"Claude Code"'),
    comum(', '),
    literal('"Codex"'),
    comum(');'),
  ),
  linha(1, comum('String metodologia = '), literal('"SDD (Spec-Driven Development)"'), comum(';')),
  linha(0, comum('}')),
];
