import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { SECOES } from '../../core/secoes';
import { ArvoreDeSecoes } from './arvore-de-secoes';

@Component({ template: '' })
class Vazia {}

const PACOTES = [
  'sobre',
  'skills',
  'experiencias',
  'projetos',
  'formacao',
  'recomendacoes',
  'contato',
];

describe('ArvoreDeSecoes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: Vazia },
          ...SECOES.map((secao) => ({ path: secao.slug, component: Vazia })),
        ]),
      ],
    });
  });

  const abrir = async (url: string) => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url);
    const fixture = TestBed.createComponent(ArvoreDeSecoes);
    await fixture.whenStable();
    return { fixture, harness, raiz: fixture.nativeElement as HTMLElement };
  };

  const pasta = (raiz: HTMLElement, nome: string) =>
    raiz.querySelector<HTMLElement>(`[data-tipo=pasta][data-pacote=${nome}]`)!;

  const clicar = async (fixture: { whenStable(): Promise<unknown> }, alvo: HTMLElement) => {
    alvo.click();
    await fixture.whenStable();
  };

  it('mostra as 7 pastas na ordem definida, em minúsculas e com o ícone de pacote', async () => {
    const { raiz } = await abrir('/');
    const pastas = Array.from(raiz.querySelectorAll('[data-tipo=pasta]'));

    expect(pastas.map((p) => p.querySelector('.titulo')?.textContent)).toEqual(PACOTES);
    pastas.forEach((p) =>
      expect(p.querySelector('app-icone img')?.getAttribute('src')).toContain('pacote.svg'),
    );
  });

  it('é uma árvore ARIA com itens de dois níveis', async () => {
    const { raiz } = await abrir('/projeto-2');

    expect(raiz.querySelector('[role=tree]')).not.toBeNull();
    expect(pasta(raiz, 'projetos').getAttribute('aria-level')).toBe('1');
    expect(raiz.querySelector('a[role=treeitem]')?.getAttribute('aria-level')).toBe('2');
    expect(raiz.querySelector('nav')?.getAttribute('aria-label')).toBe('Seções do portfólio');
  });

  it('só a pasta da seção aberta começa expandida', async () => {
    const { raiz } = await abrir('/projeto-2');
    const abertas = Array.from(raiz.querySelectorAll('[data-tipo=pasta][aria-expanded=true]'));

    expect(abertas.map((p) => p.getAttribute('data-pacote'))).toEqual(['projetos']);
    expect(raiz.querySelectorAll('a')).toHaveLength(4);
  });

  it('clicar numa pasta recolhida expande e mostra Projeto1.java a Projeto4.java', async () => {
    const { fixture, raiz } = await abrir('/');

    await clicar(fixture, pasta(raiz, 'projetos'));

    expect(pasta(raiz, 'projetos').getAttribute('aria-expanded')).toBe('true');
    const arquivos = Array.from(
      raiz.querySelectorAll('#grupo-projetos a .titulo'),
      (t) => t.textContent,
    );
    expect(arquivos).toEqual(['Projeto1.java', 'Projeto2.java', 'Projeto3.java', 'Projeto4.java']);
  });

  it('clicar numa pasta aberta recolhe e esconde os arquivos', async () => {
    const { fixture, raiz } = await abrir('/projeto-2');

    await clicar(fixture, pasta(raiz, 'projetos'));

    expect(pasta(raiz, 'projetos').getAttribute('aria-expanded')).toBe('false');
    expect(raiz.querySelector('#grupo-projetos')).toBeNull();
  });

  it('os arquivos têm ícone de Java, nome do .java e nenhuma seta', async () => {
    const { raiz } = await abrir('/projeto-2');

    raiz.querySelectorAll('a').forEach((arquivo) => {
      expect(arquivo.querySelector('.seta')).toBeNull();
      expect(arquivo.querySelector('app-icone img')?.getAttribute('src')).toContain('java.svg');
    });
    expect(raiz.querySelector('a .titulo')?.textContent).toBe('Projeto1.java');
  });

  it('o nome acessível do arquivo traz o título e o nome do arquivo', async () => {
    const { raiz } = await abrir('/projeto-2');

    expect(raiz.querySelector('a')?.getAttribute('aria-label')).toBe('Projeto 1 (Projeto1.java)');
  });

  it('liga cada arquivo à rota da sua seção, sem mudar os slugs', async () => {
    const { fixture, raiz } = await abrir('/');
    for (const nome of PACOTES) {
      if (pasta(raiz, nome).getAttribute('aria-expanded') === 'false') {
        await clicar(fixture, pasta(raiz, nome));
      }
    }

    const hrefs = Array.from(raiz.querySelectorAll('a'), (a) => a.getAttribute('href'));

    expect(hrefs).toEqual(SECOES.map((secao) => `/${secao.slug}`));
  });

  it('destaca o arquivo da seção aberta e o anuncia como página atual', async () => {
    const { raiz } = await abrir('/projeto-2');
    const atual = raiz.querySelectorAll('[aria-current="page"]');

    expect(atual).toHaveLength(1);
    expect(atual[0].textContent).toContain('Projeto2.java');
    expect(atual[0].classList).toContain('atual');
    expect(atual[0].getAttribute('aria-selected')).toBe('true');
  });

  it('não marca página atual no Início', async () => {
    const { raiz } = await abrir('/');

    expect(raiz.querySelector('[aria-current]')).toBeNull();
  });

  it('abre a pasta da nova seção quando a rota muda, sem fechar as outras', async () => {
    const { fixture, harness, raiz } = await abrir('/sobre-mim');

    await harness.navigateByUrl('/contato');
    await fixture.whenStable();

    expect(pasta(raiz, 'contato').getAttribute('aria-expanded')).toBe('true');
    expect(pasta(raiz, 'sobre').getAttribute('aria-expanded')).toBe('true');
  });

  it('avisa quando uma seção é escolhida', async () => {
    const { fixture, raiz } = await abrir('/projeto-2');
    const escolhidas: unknown[] = [];
    fixture.componentInstance.secaoEscolhida.subscribe(() => escolhidas.push(true));

    raiz.querySelector('a')!.click();

    expect(escolhidas).toHaveLength(1);
  });

  it('foca o item que está na ordem de Tab', async () => {
    const { fixture, raiz } = await abrir('/projeto-2');
    document.body.append(raiz);

    fixture.componentInstance.focarPrimeiroItem();

    expect(document.activeElement).toBe(raiz.querySelector('[role=treeitem]'));
    raiz.remove();
  });

  describe('no Início', () => {
    it('expande "sobre" e destaca só "SobreMim.java", sem aria-current', async () => {
      const { fixture, raiz } = await abrir('/');
      fixture.componentRef.setInput('noInicio', true);
      await fixture.whenStable();

      const destacados = raiz.querySelectorAll('.destacado');
      expect(destacados).toHaveLength(1);
      expect(destacados[0].textContent).toContain('SobreMim.java');
      expect(pasta(raiz, 'sobre').getAttribute('aria-expanded')).toBe('true');
      expect(raiz.querySelector('[aria-current]')).toBeNull();
    });

    it('não destaca nada com o estado desligado', async () => {
      const { raiz } = await abrir('/');

      expect(raiz.querySelector('.destacado')).toBeNull();
    });
  });

  describe('movimento', () => {
    const css = () =>
      Array.from(document.head.querySelectorAll('style'))
        .map((estilo) => estilo.textContent ?? '')
        .join('\n');

    it('gira a seta da pasta aberta e anima a entrada dos arquivos com tokens', async () => {
      await abrir('/projeto-2');

      expect(css()).toMatch(/aria-expanded=["']?true["']?\][^{]*\.seta[^{]*\{[^}]*rotate:\s*90deg/);
      expect(css()).toMatch(/\.grupo[^{]*\{[^}]*animation:\s*\S*grupo-entrar\s+var\(--duracao-/);
    });

    it('desliga transições e animação com prefers-reduced-motion', async () => {
      await abrir('/projeto-2');

      expect(css()).toMatch(
        /prefers-reduced-motion:\s*reduce\)[^]*\.grupo[^{]*\{[^}]*animation:\s*none/,
      );
    });
  });
});
