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

  it('declara o record só na página 1', async () => {
    expect(await codigo(2)).not.toContain('record Certification');
  });
});
