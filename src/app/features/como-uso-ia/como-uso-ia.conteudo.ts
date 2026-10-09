import {
  anotacao,
  comum,
  declaracao,
  linha,
  linhaApertada,
  palavraChave,
  paragrafo,
  valor,
  vazia,
  vaziaApertada,
} from '../../shared/editor-de-codigo/conteudo';
import type { ConteudoDoEditor } from '../../shared/editor-de-codigo/conteudo';

/**
 * Conteúdo da tela 04 (design/telas/tela-04.png). Única exceção ao design, decidida pelo Vinicius:
 * a classe se chama `ArtificialIntelligence` (o design grafa `ArtificialItenligence`).
 */
export const CONTEUDO_COMO_USO_IA: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('public class'), comum('  ArtificialIntelligence {')),
  linhaApertada(1, declaracao('boolean modismo'), comum(' = '), valor('false'), comum(';')),
  linhaApertada(1, declaracao('boolean parteDoTrabalho'), comum(' = '), valor('true'), comum(';')),
  vaziaApertada(),
  linha(1, anotacao('@Override')),
  linha(1, palavraChave('public void'), comum(' comoEuUsoIA() {')),
  vaziaApertada(),
  vaziaApertada(),
  paragrafo(
    0,
    'Não vejo IA como modismo, é parte de como eu trabalho hoje, dos dois lados. Na Watts Company, desenvolvo agentes de IA que resolvem problema real pra cliente: a Ana, por exemplo, atende pacientes de uma clínica pelo WhatsApp, e boa parte deles nem imagina que está falando com uma IA. No dia a dia como desenvolvedor, uso Claude Code e Codex com metodologia SDD (Spec-Driven Development): deixou de ser “ferramenta a mais” e virou parte de como eu planejo e entrego código.',
  ),
  vazia(),
  vazia(),
  vaziaApertada(),
  linha(0, comum('}')),
];
