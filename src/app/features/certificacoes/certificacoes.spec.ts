import { TestBed } from '@angular/core/testing';

import { Certificacoes } from './certificacoes';
import { VisaoDoConteudoEscolhida } from '../../core/visao-do-conteudo';

describe('Certificacoes', () => {
  // Estes testes cobrem a visão em código; o cartão tem os seus em `shared/cartoes` e nos E2E.
  beforeEach(() => TestBed.inject(VisaoDoConteudoEscolhida).escolher('codigo'));
  afterEach(() => localStorage.clear());

  async function codigo(): Promise<string> {
    const fixture = TestBed.createComponent(Certificacoes);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector('code')?.textContent ?? '';
  }

  it('mostra o record e os nove cursos num arquivo só, sem controle de páginas', async () => {
    const fixture = TestBed.createComponent(Certificacoes);
    await fixture.whenStable();
    const raiz = fixture.nativeElement as HTMLElement;
    const texto = raiz.querySelector('code')?.textContent ?? '';

    expect(texto).toContain('record Certificacao(String curso, int horas, LocalDate concluidoEm)');
    expect(texto.match(/new Certificacao\(/g)).toHaveLength(9);
    expect(raiz.querySelector('nav, [aria-current="page"]')).toBeNull();
  });

  it('lista os nomes dos cursos', async () => {
    const texto = await codigo();

    for (const nome of [
      'Spring Boot 3: desenvolva uma API Rest em Java',
      'Java: persistência de dados e consultas com Spring Data JPA',
      'Java: consumindo API, gravando arquivos e lidando com erros',
      'HTTP: entendendo a web por baixo dos panos',
      'Angular: construa uma aplicação web com componentes, template e CLI',
      'TypeScript na prática: implemente um projeto completo',
      'Python para Dados: primeiros passos',
      'Python: avance na Orientação a Objetos e consuma API',
      'Git e GitHub: repositório, commit e versões',
    ]) {
      expect(texto, nome).toContain(nome);
    }
  });

  it('lista os nove cursos com horas e data, do mais recente para o mais antigo', async () => {
    const esperado = [
      ['Spring Boot 3', 10, '2025-12-19'],
      ['Spring Data JPA', 16, '2025-12-09'],
      ['consumindo API', 10, '2025-11-05'],
      ['HTTP', 10, '2025-10-14'],
      ['Angular', 8, '2025-09-22'],
      ['TypeScript na prática', 12, '2025-09-11'],
      ['Python para Dados', 10, '2025-04-08'],
      ['Orientação a Objetos', 8, '2025-03-27'],
      ['Git e GitHub', 8, '2025-03-25'],
    ] as const;
    const texto = await codigo();
    const datas = Array.from(
      texto.matchAll(/(\d+),\s*LocalDate\.of\((\d{4}), (\d+), (\d+)\)/g),
      (m) => ({
        horas: Number(m[1]),
        data: `${m[2]}-${m[3].padStart(2, '0')}-${m[4].padStart(2, '0')}`,
      }),
    );

    expect(datas).toEqual(esperado.map(([, horas, data]) => ({ horas, data })));
    esperado.reduce((posicaoAnterior, [nome]) => {
      const posicao = texto.indexOf(nome);
      expect(posicao, nome).toBeGreaterThan(posicaoAnterior);
      return posicao;
    }, -1);
  });

  it('declara package, import, classe e record uma vez, com variáveis em português', async () => {
    const texto = await codigo();
    const vezes = (trecho: string): number => texto.split(trecho).length - 1;

    expect(vezes('package dev.vinicius.portfolio.formacao;')).toBe(1);
    expect(vezes('import java.time.LocalDate;')).toBe(1);
    expect(vezes('public class Certificacoes {')).toBe(1);
    expect(vezes('record Certificacao(')).toBe(1);
    expect(vezes('// Cursos concluídos, do mais recente para o mais antigo')).toBe(1);
    expect(texto).toContain('Certificacao springBoot = new Certificacao(');
    expect(texto).toContain('Certificacao gitEGithub = new Certificacao(');
    expect(texto).not.toContain('static final');
  });
});
