import {
  anotacao,
  comum,
  linha,
  palavraChave,
  paragrafo,
  vazia,
} from '../../shared/editor-de-codigo/conteudo';
import type { ConteudoDoEditor } from '../../shared/editor-de-codigo/conteudo';

/** Conteúdo da tela 02 (design/telas/tela-02.png): a interface e o resumo profissional. */
export const CONTEUDO_SOBRE_MIM: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('public interface'), comum('  ViniciusMachado {')),
  linha(1, palavraChave('void'), comum(' sobreMim();')),
  linha(0, comum('}')),
  vazia(),
  linha(1, anotacao('@Override')),
  linha(1, palavraChave('public void'), comum(' sobreMim() {')),
  paragrafo(
    0,
    'Sou desenvolvedor Full Stack com cerca de 2 anos de experiência, atuando com Java, Spring Boot, Angular e SQL em sistemas críticos de produção. Lidero um squad na Memora Processos Inovadores, atuando à frente de projetos, orientando o time nas demandas, tirando dúvidas técnicas e garantindo que sigamos Scrum, com dailies, previsões de conclusão e reviews. Também sou co-fundador da Watts Company, agência de automação e IA, onde desenvolvo sistemas de CRM e agentes de IA para atendimento. Curso Ciência da Computação no UniCEUB, com foco em Engenharia de Software, Sistemas Distribuídos e Arquitetura de Software.',
  ),
  vazia(),
  linha(0, comum('}')),
];
