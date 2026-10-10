import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Certificacoes } from './certificacoes';
import { CONTEUDOS_CERTIFICACOES } from './certificacoes.conteudo';

describe('Certificacoes', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  async function codigo(pagina?: number): Promise<string> {
    const fixture = TestBed.createComponent(Certificacoes);
    if (pagina) fixture.componentRef.setInput('pagina', pagina);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector('code')?.textContent ?? '';
  }

  it('divide os nove cursos em três páginas', () => {
    expect(CONTEUDOS_CERTIFICACOES).toHaveLength(3);
  });

  it('página 1 mostra o record e os três cursos mais recentes', async () => {
    const texto = await codigo();

    expect(texto).toContain(
      'record Certification(String course, int hours, LocalDate completedOn)',
    );
    expect(texto).toContain('Spring Boot 3: desenvolva uma API Rest em Java');
    expect(texto).toContain('10, LocalDate.of(2025, 12, 19)');
    expect(texto).toContain('Java: persistência de dados e consultas com Spring Data JPA');
    expect(texto).toContain('16, LocalDate.of(2025, 12, 9)');
    expect(texto).toContain('Java: consumindo API, gravando arquivos e lidando com erros');
    expect(texto).toContain('10, LocalDate.of(2025, 11, 5)');
  });

  it('página 2 mostra HTTP, Angular e TypeScript', async () => {
    const texto = await codigo(2);

    expect(texto).toContain('HTTP: entendendo a web por baixo dos panos');
    expect(texto).toContain('10, LocalDate.of(2025, 10, 14)');
    expect(texto).toContain('Angular: construa uma aplicação web com componentes, template e CLI');
    expect(texto).toContain('8, LocalDate.of(2025, 9, 22)');
    expect(texto).toContain('TypeScript na prática: implemente um projeto completo');
    expect(texto).toContain('12, LocalDate.of(2025, 9, 11)');
  });

  it('página 3 mostra Python e Git, do mais recente para o mais antigo', async () => {
    const texto = await codigo(3);

    expect(texto).toContain('10, LocalDate.of(2025, 4, 8)');
    expect(texto).toContain('8, LocalDate.of(2025, 3, 27)');
    expect(texto).toContain('8, LocalDate.of(2025, 3, 25)');
    expect(texto.indexOf('Python para Dados')).toBeLessThan(texto.indexOf('Git e GitHub'));
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
    const texto = [await codigo(1), await codigo(2), await codigo(3)].join('\n');
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

  it('cada página tem o comentário em pt-BR e o controle mostra X/3', async () => {
    for (const pagina of [1, 2, 3]) {
      expect(await codigo(pagina)).toContain('// Cursos concluídos');
    }
  });

  it('declara o record só na página 1', async () => {
    expect(await codigo(2)).not.toContain('record Certification');
  });
});
