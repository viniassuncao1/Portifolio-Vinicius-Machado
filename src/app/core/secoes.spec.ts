import { NOMES_DE_ICONE } from '../shared/icone/icone';
import { SECOES } from './secoes';

describe('SECOES', () => {
  it('lista as 16 seções na ordem do design', () => {
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
      'Projeto 5',
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
      'projeto-5',
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

  it('descreve cada seção em pt-BR com 80 a 160 caracteres, sem repetição', () => {
    const descricoes = SECOES.map((secao) => secao.descricao);

    for (const descricao of descricoes) {
      expect(descricao.length).toBeGreaterThanOrEqual(80);
      expect(descricao.length).toBeLessThanOrEqual(160);
    }
    expect(new Set(descricoes).size).toBe(SECOES.length);
  });

  it('agrupa as seções nos pacotes do ADR-0011', () => {
    const pacotes = Object.fromEntries(SECOES.map((secao) => [secao.slug, secao.pacote]));

    expect(pacotes).toEqual({
      'sobre-mim': 'sobre',
      diferenciais: 'sobre',
      'como-uso-ia': 'sobre',
      skills: 'skills',
      experiencias: 'experiencias',
      'projeto-1': 'projetos',
      'projeto-2': 'projetos',
      'projeto-3': 'projetos',
      'projeto-4': 'projetos',
      'projeto-5': 'projetos',
      certificacoes: 'formacao',
      eventos: 'formacao',
      formacao: 'formacao',
      idiomas: 'formacao',
      depoimentos: 'recomendacoes',
      contato: 'contato',
    });
  });
});
