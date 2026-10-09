import {
  comum,
  declaracao,
  linha,
  linhaCompacta,
  literal,
  palavraChave,
  vazia,
} from '../../shared/editor-de-codigo/conteudo';
import type { ConteudoDoEditor } from '../../shared/editor-de-codigo/conteudo';

/** Conteúdo da tela 01 (design/telas/tela-01.png): a classe do desenvolvedor. */
export const CONTEUDO_INICIO: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('package'), comum('   portfolio.viniciusmachado;')),
  linha(0, palavraChave('public class'), comum('  ViniciusMachado')),
  linha(0, comum('      '), palavraChave('extends'), comum('  DesenvolvedorFullStack {')),
  vazia(),
  linha(1, declaracao('String cargo'), comum('  = '), literal('“Full Stack Júnior”'), comum(';')),
  linha(1, comum('String[] stack = {')),
  linhaCompacta(2, literal('“Java”'), comum(',')),
  linhaCompacta(2, literal('“Spring Boot”'), comum(',')),
  linhaCompacta(2, literal('“Angular”'), comum(',')),
  linhaCompacta(2, literal('“SQL”')),
  vazia(),
  linha(1, comum('};')),
  vazia(),
  linha(0, comum('}')),
];
