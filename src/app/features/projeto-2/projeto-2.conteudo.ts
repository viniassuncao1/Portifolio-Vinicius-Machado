import {
  comentario,
  comum,
  declaracao,
  javadoc,
  linha,
  linhaExecutavel,
  link,
  literal,
  palavraChave,
  vazia,
} from '../../shared/editor-de-codigo/conteudo';
import type { ConteudoDoEditor } from '../../shared/editor-de-codigo/conteudo';

/** Conteúdo das telas 11 a 13 (design/telas): a landing page da Dra. Juliana Maluhy. */
export const CONTEUDO_PROJETO_2: ConteudoDoEditor = [
  vazia(),
  linhaExecutavel(0, palavraChave('public class'), comum('  DraJulianaMaluhy {')),
  vazia(),
  linha(1, comentario('// Ficha do projeto')),
  linha(
    1,
    palavraChave('static final'),
    declaracao(' String'),
    comum(' TECHNOLOGY = '),
    literal('"HTML + JavaScript"'),
    comum(';'),
  ),
  linha(
    1,
    palavraChave('static final'),
    declaracao(' String'),
    comum(' TYPE = '),
    literal('"Landing Page"'),
    comum(';'),
  ),
  linha(
    1,
    palavraChave('static final'),
    declaracao(' String'),
    comum(' CTA = '),
    literal('"Agendar via WhatsApp"'),
    comum(';'),
  ),
  vazia(),
  linha(1, comentario('// Site no ar')),
  linha(
    1,
    palavraChave('static final'),
    declaracao(' String'),
    comum(' SITE = '),
    link(literal('"https://www.drajulianamaluhy.com/"'), 'https://www.drajulianamaluhy.com/'),
    comum(';'),
  ),
  vazia(),
  javadoc(
    1,
    'Landing page desenvolvida em HTML e JS puro, com design autoral do zero. Estrutura pensada pra conversão: hero com proposta de valor clara ("seu corpo não foi feito pra doer"), prova social com avaliação 5.0 no Doctoralia, seções de especialidades (RPG Souchard, ATM/DTM, Terapia Manual), convênios aceitos e depoimentos reais de pacientes. Paleta minimalista alinhada ao Instagram da médica. Todo o caminho do site converge pro WhatsApp, direcionando o visitante direto pra Ana.',
  ),
  linha(0, comum('}')),
];
