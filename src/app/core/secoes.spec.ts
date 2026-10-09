import { NOMES_DE_ICONE } from '../shared/icone/icone';
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

  it('dá a cada seção um ícone conhecido', () => {
    const nomes: readonly string[] = NOMES_DE_ICONE;

    expect(SECOES.every((secao) => nomes.includes(secao.icone))).toBe(true);
  });

  it('usa slugs seguros para endereço: minúsculos, sem acento nem espaço', () => {
    expect(SECOES.every((secao) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(secao.slug))).toBe(true);
  });
});
