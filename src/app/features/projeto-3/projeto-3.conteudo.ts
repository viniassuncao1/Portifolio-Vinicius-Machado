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

/** Conteúdo da tela 14 (design/telas/tela-14.png): a landing page da Watts Company. */
export const CONTEUDO_PROJETO_3: ConteudoDoEditor = [
  vazia(),
  linhaExecutavel(0, palavraChave('public class'), comum('  WattsCompany {')),
  vazia(),
  linha(1, comentario('// Ficha do projeto')),
  linha(
    1,
    palavraChave('static final'),
    declaracao(' String'),
    comum(' TECHNOLOGY = '),
    literal('"React"'),
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
  vazia(),
  linha(1, comentario('// Site no ar')),
  linha(
    1,
    palavraChave('static final'),
    declaracao(' String'),
    comum(' SITE = '),
    link(literal('"https://wattscompany.com.br/"'), 'https://wattscompany.com.br/'),
    comum(';'),
  ),
  vazia(),
  javadoc(
    1,
    'Landing page da própria Watts Company, desenvolvida em React, com foco em conversão de leads e venda direta dos serviços de automação e IA da agência. Traz uma proposta de valor direta ("Automatize. Escale. Domine."), destacando infraestrutura de IA e bots para WhatsApp, com CTA de diagnóstico gratuito guiando o visitante para o funil comercial.',
  ),
  linha(0, comum('}')),
];
