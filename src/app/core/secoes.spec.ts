import { SECOES } from './secoes';

describe('SECOES', () => {
  it('lista as 15 seções na ordem do design', () => {
    expect(SECOES.map((secao) => secao.titulo)).toEqual([
      'Sobre Mim',
      'Diferenciais',
      'Como uso a IA',
      'Skills / STACK',
      'Experiências',
      'Projeto 1',
      'Projeto 2',
      'Projeto 3',
      'Projeto 4',
      'Certificações',
      'Eventos',
      'Formação',
      'Idiomas',
      'Depoimentos/Recomendações',
      'Contato',
    ]);
  });

  it('usa os slugs do design, sem repetição', () => {
    const slugs = SECOES.map((secao) => secao.slug);

    expect(slugs).toEqual([
      'sobre-mim',
      'diferenciais',
      'como-uso-ia',
      'skills',
      'experiencias',
      'projeto-1',
      'projeto-2',
      'projeto-3',
      'projeto-4',
      'certificacoes',
      'eventos',
      'formacao',
      'idiomas',
      'depoimentos',
      'contato',
    ]);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
