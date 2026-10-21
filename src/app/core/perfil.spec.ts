/// <reference types="node" />
import { readFileSync } from 'node:fs';

import { CONTATOS, EXPERIENCIAS, FORMACAO, IDIOMAS, PERFIL, SOBRE, STACK } from './perfil';

const ler = (caminho: string): string => readFileSync(caminho, 'utf8');
const conteudo = (secao: string): string => ler(`src/app/features/${secao}/${secao}.conteudo.ts`);

describe('perfil: os mesmos fatos das seções em código', () => {
  it('cada experiência (empresa, cargo, período e destaques) está em Experiencias.java', () => {
    const codigo = conteudo('experiencias');

    for (const experiencia of EXPERIENCIAS) {
      expect(codigo, experiencia.empresa).toContain(`'${experiencia.empresa}'`);
      expect(codigo, experiencia.cargo).toContain(`'${experiencia.cargo}'`);
      expect(codigo, experiencia.periodo).toContain(`'${experiencia.periodo}'`);
      for (const destaque of experiencia.destaques) expect(codigo, destaque).toContain(destaque);
    }
  });

  it('cada tecnologia da stack está em Skills.java, no mesmo nível', () => {
    const codigo = conteudo('skills');

    for (const grupo of STACK) {
      for (const item of grupo.itens) expect(codigo, item).toContain(`'${item}'`);
    }
  });

  it('a formação e os idiomas batem com as seções', () => {
    expect(conteudo('formacao')).toContain(FORMACAO.instituicao);
    expect(conteudo('formacao')).toContain(FORMACAO.curso);
    expect(conteudo('formacao')).toContain(String(FORMACAO.previsao));
    for (const { nivel } of IDIOMAS) expect(conteudo('idiomas')).toContain(nivel);
  });

  it('os contatos são os do Contato.java', () => {
    const codigo = conteudo('contato');

    expect(codigo).toContain('+55 61 98283-7805');
    expect(codigo).toContain('linkedin.com/in/viniassuncao');
    expect(codigo).toContain('github.com/viniassuncao1');
    expect(CONTATOS.map((c) => c.rotulo)).toEqual(['E-mail', 'Telefone', 'LinkedIn', 'GitHub']);
  });

  it('o resumo cita a stack do Início e as quatro afirmações do Sobre existem', () => {
    for (const tecnologia of PERFIL.stack.slice(0, 2)) {
      expect(PERFIL.resumo).toContain(tecnologia);
    }
    expect(SOBRE).toHaveLength(4);
    expect(PERFIL.stack).toEqual(['Java', 'Spring Boot', 'Angular', 'SQL']);
  });

  it('os links externos abrem em nova aba e o e-mail e o telefone, não', () => {
    for (const contato of CONTATOS) {
      expect(contato.externo).toBe(contato.href.startsWith('https://'));
    }
  });
});
