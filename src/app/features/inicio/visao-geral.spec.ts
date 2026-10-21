import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PERFIL, PROVAS } from '../../core/perfil';
import { PROJETOS } from '../../core/projetos';
import { VisaoGeral } from './visao-geral';

async function montar(): Promise<HTMLElement> {
  TestBed.configureTestingModule({ providers: [provideRouter([{ path: '**', children: [] }])] });
  const fixture = TestBed.createComponent(VisaoGeral);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('VisaoGeral', () => {
  it('tem as seis faixas, cada uma com o seu tema e um nome acessível', async () => {
    const raiz = await montar();

    const faixas = Array.from(raiz.querySelectorAll('section.faixa'));
    expect(faixas.map((f) => f.getAttribute('aria-label'))).toEqual([
      'Apresentação',
      'Sobre',
      'Stack',
      'Experiência e formação',
      'Projetos',
      'Contato',
    ]);
  });

  it('começa pelo nome, o cargo e as ações, sem depender de JavaScript para o texto', async () => {
    const raiz = await montar();

    expect(raiz.querySelector('h2.nome')?.textContent).toBe(PERFIL.nome);
    expect(raiz.querySelector('.cargo')?.textContent).toBe(PERFIL.cargo);
    const ctas = Array.from(raiz.querySelectorAll('.ctas a'), (a) => a.textContent?.trim());
    expect(ctas[0]).toContain('Ver projetos');
    expect(ctas[1]).toContain('Baixar currículo');
  });

  it('o cartão da apresentação já está no HTML, com a foto e o estado "Disponível"', async () => {
    const raiz = await montar();

    expect(raiz.querySelector('.cartao img')?.getAttribute('alt')).toBe('Foto de Vinicius Machado');
    expect(raiz.querySelector('.cartao .status')?.textContent).toContain('Disponível');
    expect(raiz.querySelector('.janela-do-hero')?.getAttribute('data-fase')).toBe('cartao');
  });

  it('mostra as quatro provas, com os valores finais no texto', async () => {
    const raiz = await montar();

    const valores = Array.from(raiz.querySelectorAll('.prova .valor'), (v) => v.textContent);
    expect(valores).toEqual(PROVAS.map((p) => `${p.valor}${p.sufixo}`));
  });

  it('a barra de ações traz currículo, LinkedIn e GitHub, e o botão da outra visão', async () => {
    const raiz = await montar();

    const barra = raiz.querySelector('.barra') as HTMLElement;
    const links = Array.from(barra.querySelectorAll('a'), (a) => a.getAttribute('href'));
    expect(links).toEqual([
      'CV_Vinicius_Machado_Desenvolvedor_FullStack_Java.pdf',
      'https://linkedin.com/in/viniassuncao',
      'https://github.com/viniassuncao1',
    ]);
    expect(barra.querySelector('a[download]')).not.toBeNull();
    expect(barra.querySelector('app-alternar-visao button')?.textContent).toContain(
      'Ver como código',
    );
  });

  it('links de sites abrem em nova aba com rel seguro', async () => {
    const raiz = await montar();

    for (const link of Array.from(raiz.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]'))) {
      expect(link.rel).toBe('noopener noreferrer');
    }
  });

  it('a stack liga cada tecnologia ao projeto que a usa, quando há', async () => {
    const raiz = await montar();

    const link = raiz.querySelector<HTMLAnchorElement>('app-stack-em-gradle a.com-link');
    expect(link?.getAttribute('href')).toMatch(/^\/projetos\//);
    expect(link?.getAttribute('title')).toContain('Usado em:');
    expect(raiz.querySelectorAll('app-stack-em-gradle .item').length).toBeGreaterThan(15);
  });

  it('a experiência mostra as três em ordem, da mais recente à mais antiga', async () => {
    const raiz = await montar();

    const periodos = Array.from(raiz.querySelectorAll('.commit .periodo'), (p) => p.textContent);
    expect(periodos).toEqual(['08/2026 - Presente', '08/2025 - 07/2026', '02/2025 - Presente']);
  });

  it('os projetos em destaque são os seis, ligados à vitrine', async () => {
    const raiz = await montar();

    const links = Array.from(raiz.querySelectorAll('app-projetos-em-destaque a.cartao'), (a) =>
      a.getAttribute('href'),
    );
    expect(links).toEqual(PROJETOS.map((p) => `/projetos/${p.slug}`));
  });

  it('o contato lista os quatro contatos como links reais', async () => {
    const raiz = await montar();

    const hrefs = Array.from(raiz.querySelectorAll('app-contato-em-terminal .saida a'), (a) =>
      a.getAttribute('href'),
    );
    expect(hrefs).toEqual([
      'mailto:viniciusmassuncao@gmail.com',
      'tel:+5561982837805',
      'https://linkedin.com/in/viniassuncao',
      'https://github.com/viniassuncao1',
    ]);
  });
});
