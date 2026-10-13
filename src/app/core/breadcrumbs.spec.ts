import { breadcrumbs } from './breadcrumbs';
import { SECOES } from './secoes';

describe('breadcrumbs', () => {
  it('monta o caminho do projeto até o arquivo, passando pelo pacote', () => {
    const skills = SECOES.find((secao) => secao.slug === 'skills')!;

    expect(breadcrumbs(skills)).toEqual([
      'portfolio-vinicius',
      'src',
      'main',
      'java',
      'dev',
      'vinicius',
      'portfolio',
      'skills',
      'Skills.java',
    ]);
  });

  it('deixa o arquivo na raiz do pacote do projeto quando não há pacote', () => {
    const segmentos = breadcrumbs({ arquivo: 'PortfolioApplication.java' });

    expect(segmentos.slice(-2)).toEqual(['portfolio', 'PortfolioApplication.java']);
    expect(segmentos).toHaveLength(8);
  });

  it('termina sempre no arquivo da seção', () => {
    for (const secao of SECOES) {
      expect(breadcrumbs(secao).at(-1)).toBe(secao.arquivo);
      expect(breadcrumbs(secao).at(-2)).toBe(secao.pacote);
    }
  });

  it('não altera os dados recebidos', () => {
    const entrada = { arquivo: 'Contato.java', pacote: 'contato' } as const;

    breadcrumbs(entrada);

    expect(entrada).toEqual({ arquivo: 'Contato.java', pacote: 'contato' });
  });
});
