import {
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

/**
 * Conteúdo da tela 04 (design/telas/tela-04.png) em Java moderno. A classe se chama
 * `ArtificialIntelligence` (o design grafa `ArtificialItenligence`).
 */
export const CONTEUDO_COMO_USO_IA: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('import'), comum(' java.util.List;')),
  vazia(),
  javadoc(
    0,
    'Não vejo IA como modismo, é parte de como eu trabalho hoje, dos dois lados. Na Watts Company, desenvolvo agentes de IA que resolvem problema real pra cliente: a Ana, por exemplo, atende pacientes de uma clínica pelo WhatsApp, e boa parte deles nem imagina que está falando com uma IA. No dia a dia como desenvolvedor, uso Claude Code e Codex com metodologia SDD (Spec-Driven Development): deixou de ser “ferramenta a mais” e virou parte de como eu planejo e entrego código.',
  ),
  linha(0, palavraChave('public final class'), comum(' ArtificialIntelligence {')),
  vazia(),
  linha(
    1,
    palavraChave('public static final'),
    comum(' '),
    declaracao('boolean FAD'),
    comum(' = '),
    valor('false'),
    comum(';'),
  ),
  linha(
    1,
    palavraChave('public static final'),
    comum(' '),
    declaracao('boolean PART_OF_THE_JOB'),
    comum(' = '),
    valor('true'),
    comum(';'),
  ),
  linha(
    1,
    palavraChave('public static final'),
    comum(' List<String> TOOLS = List.of('),
    literal('"Claude Code"'),
    comum(', '),
    literal('"Codex"'),
    comum(');'),
  ),
  linha(
    1,
    palavraChave('public static final'),
    comum(' String METHODOLOGY = '),
    literal('"SDD (Spec-Driven Development)"'),
    comum(';'),
  ),
  vazia(),
  linha(1, palavraChave('private'), comum(' ArtificialIntelligence() {}')),
  linha(0, comum('}')),
];
