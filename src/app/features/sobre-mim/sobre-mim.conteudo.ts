import {
  anotacao,
  comentario,
  comum,
  linha,
  literal,
  palavraChave,
  javadocComRetrato,
  vazia,
} from '../../shared/editor-de-codigo/conteudo';
import type { ConteudoDoEditor } from '../../shared/editor-de-codigo/conteudo';

/** Conteúdo da tela 02 (design/telas/tela-02.png) no estilo de leitura (ADR-0011): interface e classe em português. */
export const CONTEUDO_SOBRE_MIM: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('package'), comum(' dev.vinicius.portfolio.sobre;')),
  vazia(),
  linha(0, comentario('// Todo desenvolvedor sabe se apresentar')),
  linha(0, palavraChave('interface'), comum(' Desenvolvedor {')),
  linha(1, palavraChave('String'), comum(' sobreMim();')),
  linha(0, comum('}')),
  vazia(),
  linha(0, comentario('// Eu: Vinicius Machado')),
  linha(
    0,
    palavraChave('class'),
    comum(' ViniciusMachado '),
    palavraChave('implements'),
    comum(' Desenvolvedor {'),
  ),
  javadocComRetrato(
    1,
    'Sou desenvolvedor Full Stack com cerca de 2 anos de experiência, atuando com Java, Spring Boot, Angular e SQL em sistemas críticos de produção. Lidero um squad na Memora Processos Inovadores, atuando à frente de projetos, orientando o time nas demandas, tirando dúvidas técnicas e garantindo que sigamos Scrum, com dailies, previsões de conclusão e reviews. Também sou co-fundador da Watts Company, agência de automação e IA, onde desenvolvo sistemas de CRM e agentes de IA para atendimento. Curso Ciência da Computação no UniCEUB, com foco em Engenharia de Software, Sistemas Distribuídos e Arquitetura de Software.',
    { src: 'fotos/vinicius.webp', alt: 'Foto de Vinicius Machado', tamanho: 'grande' },
  ),
  linha(1, anotacao('@Override')),
  linha(1, palavraChave('public'), comum(' String sobreMim() {')),
  linha(
    2,
    palavraChave('return'),
    comum(' '),
    literal('"Full Stack: Java, Spring Boot, Angular e SQL"'),
    comum(';'),
  ),
  linha(1, comum('}')),
  linha(0, comum('}')),
];
