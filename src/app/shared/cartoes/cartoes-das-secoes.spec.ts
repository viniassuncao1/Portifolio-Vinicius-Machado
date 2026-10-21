import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import {
  COMO_USO_IA,
  CURSOS,
  DIFERENCIAIS,
  EVENTOS,
  IDIOMAS,
  RECOMENDACOES,
} from '../../core/perfil';
import { PROJETOS } from '../../core/projetos';
import { CertificacoesEmCartoes } from './certificacoes-em-cartoes';
import { DepoimentosEmCartoes } from './depoimentos-em-cartoes';
import { DiferenciaisEmCartoes } from './diferenciais-em-cartoes';
import { EventosEmCartoes } from './eventos-em-cartoes';
import { IaEmCartao } from './ia-em-cartao';
import { IdiomasEmCartoes } from './idiomas-em-cartoes';
import { ProjetoEmCartao } from './projeto-em-cartao';

describe('cartões das demais seções', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([{ path: '**', children: [] }])] });
  });

  async function montar<T>(componente: new () => T, entradas: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(componente);
    for (const [nome, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(nome, valor);
    }
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('Diferenciais mostra o texto do Javadoc e os dados pessoais', async () => {
    const raiz = await montar(DiferenciaisEmCartoes);

    expect(raiz.querySelector('.citacao')?.textContent).toBe(DIFERENCIAIS.texto);
    const dados = Array.from(raiz.querySelectorAll('.dados h4'), (h) => h.textContent?.trim());
    expect(dados).toEqual([
      DIFERENCIAIS.origem,
      String(DIFERENCIAIS.anosNaCidade),
      ...DIFERENCIAIS.tracos,
    ]);
  });

  it('Como uso a IA mostra o texto, as ferramentas, o método e o caminho para o Projeto 2', async () => {
    const raiz = await montar(IaEmCartao);

    expect(raiz.querySelector('.citacao')?.textContent).toBe(COMO_USO_IA.texto);
    expect(Array.from(raiz.querySelectorAll('.chips .chip'), (c) => c.textContent)).toEqual([
      ...COMO_USO_IA.ferramentas,
    ]);
    expect(raiz.textContent).toContain(COMO_USO_IA.metodologia);
    expect(raiz.querySelector('a.link-mais')?.getAttribute('href')).toBe('/projeto-2');
  });

  it('Certificações lista os nove cursos, com data em português e o total de horas', async () => {
    const raiz = await montar(CertificacoesEmCartoes);

    expect(raiz.querySelectorAll('.lista li')).toHaveLength(CURSOS.length);
    expect(raiz.querySelector('.lista li .rotulo-mono')?.textContent).toBe('19/12/2025');
    const horas = CURSOS.reduce((soma, c) => soma + c.horas, 0);
    expect(raiz.querySelector('.titulo-de-secao')?.textContent).toContain(`${horas} horas`);
  });

  it('Eventos mostra cada evento com o número de vezes', async () => {
    const raiz = await montar(EventosEmCartoes);

    expect(Array.from(raiz.querySelectorAll('.lista h4'), (h) => h.textContent)).toEqual(
      EVENTOS.map((e) => e.nome),
    );
    expect(raiz.textContent).toContain('2× presente');
  });

  it('Idiomas mostra cada idioma com o nível', async () => {
    const raiz = await montar(IdiomasEmCartoes);

    expect(Array.from(raiz.querySelectorAll('.lista h4'), (h) => h.textContent)).toEqual(
      IDIOMAS.map((i) => i.idioma),
    );
    expect(raiz.textContent).toContain('Básico');
  });

  it('Depoimentos mostra os parágrafos, a foto e o link da autora em nova aba', async () => {
    const raiz = await montar(DepoimentosEmCartoes);

    expect(raiz.querySelectorAll('blockquote p')).toHaveLength(RECOMENDACOES[0].paragrafos.length);
    expect(raiz.querySelector('figcaption img')?.getAttribute('alt')).toBe('Foto de Luana Porto');
    const link = raiz.querySelector('figcaption a')!;
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(raiz.querySelector('.apoio')?.textContent).toContain('22/09/2026');
  });

  for (const projeto of PROJETOS) {
    it(`Projeto ${projeto.numero} mostra título, papel, destaques e o caminho para a vitrine`, async () => {
      const raiz = await montar(ProjetoEmCartao, { secao: projeto.secao });

      expect(raiz.querySelector('.titulo-de-secao')?.textContent?.trim()).toBe(projeto.titulo);
      expect(raiz.textContent).toContain(projeto.papel);
      expect(raiz.querySelectorAll('.destaques li')).toHaveLength(projeto.destaques.length);
      expect(raiz.querySelector('a[href^="/projetos/"]')?.getAttribute('href')).toBe(
        `/projetos/${projeto.slug}`,
      );
      expect(raiz.querySelector('a[target="_blank"]') !== null).toBe(projeto.link !== undefined);
    });
  }

  it('um projeto inexistente não renderiza nada', async () => {
    const raiz = await montar(ProjetoEmCartao, { secao: 'projeto-99' });

    expect(raiz.querySelector('.titulo-de-secao')).toBeNull();
  });
});
