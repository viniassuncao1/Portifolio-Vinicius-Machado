import {
  anotacao,
  comum,
  declaracao,
  linha,
  linhaCompacta,
  literal,
  palavraChave,
  paragrafo,
  valor,
  vazia,
  vaziaCompacta,
} from '../../shared/editor-de-codigo/conteudo';
import type { ConteudoDoEditor } from '../../shared/editor-de-codigo/conteudo';

/**
 * Conteúdo da tela 03 (design/telas/tela-03.png). Reproduz o design como está: a classe não tem
 * a chave de fechamento final.
 */
export const CONTEUDO_DIFERENCIAIS: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('public class'), comum('  PersonalData {')),
  linhaCompacta(1, declaracao('String origem'), comum(' = '), literal('“Mineiro”'), comum(';')),
  linhaCompacta(1, declaracao('String cidade'), comum(' = '), literal('“Brasília”'), comum(';')),
  vaziaCompacta(),
  linhaCompacta(1, declaracao('boolean extrovertido'), comum(' = '), valor('true'), comum(';')),
  linhaCompacta(1, declaracao('boolean curioso'), comum(' = '), valor('true'), comum(';')),
  linhaCompacta(1, declaracao('boolean gostaDeAprender'), comum(' = '), valor('true'), comum(';')),
  vaziaCompacta(),
  linha(1, anotacao('@Override')),
  linha(1, palavraChave('public void'), comum(' diferenciais() {')),
  vaziaCompacta(),
  paragrafo(
    0,
    'Moro em Brasília há 20 anos. Sou mineiro, extrovertido, curioso e gosto de uma boa discussão, principalmente com quem sabe mais do que eu sobre algum assunto. Estou disposto a experiências novas e não me prendo só a back-end ou front-end: gosto de testar, aprender e encarar o que aparecer pela frente.',
  ),
  vaziaCompacta(),
  linha(0, comum('}')),
];
