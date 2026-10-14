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

/** Conteúdo da tela 04 (design/telas/tela-04.png) no estilo de leitura (ADR-0011): a classe `InteligenciaArtificial`. */
export const CONTEUDO_COMO_USO_IA: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('package'), comum(' dev.vinicius.portfolio.sobre;')),
  vazia(),
  linha(0, palavraChave('import'), comum(' java.util.List;')),
  vazia(),
  javadoc(
    0,
    'Não vejo IA como modismo, é parte de como eu trabalho hoje, dos dois lados. Na Watts Company, desenvolvo agentes de IA que resolvem problema real pra cliente: a Ana, por exemplo, atende pacientes de uma clínica pelo WhatsApp, e boa parte deles nem imagina que está falando com uma IA. No dia a dia como desenvolvedor, uso Claude Code e Codex com metodologia SDD (Spec-Driven Development): deixou de ser “ferramenta a mais” e virou parte de como eu planejo e entrego código.',
  ),
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
