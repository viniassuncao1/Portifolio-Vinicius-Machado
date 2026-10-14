import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';

import type { HistoricoDoGit } from '../../core/git/historico';
import { PainelDoGit } from '../../core/painel-do-git';
import { PainelDoGitComponente } from './painel-do-git';

const HISTORICO: HistoricoDoGit = {
  geradoEm: '2026-10-14T12:00:00Z',
  repositorio: 'usuario/projeto',
  commits: [
    {
      sha: 'b'.repeat(40),
      pais: ['a'.repeat(40), 'c'.repeat(40)],
      autor: 'Pessoa',
      data: '2026-10-14T10:00:00Z',
      assunto: 'Merge pull request #27 from usuario/feat/x',
      pr: 27,
      branch: 'feat/x',
    },
    {
      sha: 'a'.repeat(40),
      pais: [],
      autor: 'Outra',
      data: '2026-10-13T10:00:00Z',
      assunto: 'feat: primeiro',
    },
  ],
};

async function abrirPainel(corpo: unknown = HISTORICO, ok = true) {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve({ ok, status: ok ? 200 : 500, json: () => Promise.resolve(corpo) }),
    ),
  );
  const fixture = TestBed.createComponent(PainelDoGitComponente);
  TestBed.inject(PainelDoGit).abrir(null);
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r));
    fixture.detectChanges();
  }
  return { fixture, raiz: fixture.nativeElement as HTMLElement };
}

const teclar = (fixture: ComponentFixture<PainelDoGitComponente>, key: string) => {
  const lista = (fixture.nativeElement as HTMLElement).querySelector('[role="listbox"]')!;
  lista.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  fixture.detectChanges();
};

describe('PainelDoGitComponente', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('não mostra nada até o painel abrir', () => {
    const fixture = TestBed.createComponent(PainelDoGitComponente);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('section')).toBeNull();
    expect((fixture.nativeElement as HTMLElement).getAttribute('data-aberto')).toBe('false');
  });

  it('lista os commits como listbox com assunto, autor e data, e o grafo fora da leitura', async () => {
    const { raiz } = await abrirPainel();
    const opcoes = raiz.querySelectorAll('[role="option"]');

    expect(raiz.querySelector('[role="listbox"]')?.getAttribute('aria-label')).toBe('Commits');
    expect(opcoes).toHaveLength(2);
    expect(opcoes[0].textContent).toContain('Merge pull request #27');
    expect(opcoes[0].textContent).toContain('Pessoa');
    expect(opcoes[0].querySelector('time')?.getAttribute('datetime')).toBe('2026-10-14T10:00:00Z');
    expect(opcoes[0].querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('move o commit ativo com as setas por aria-activedescendant', async () => {
    const { fixture, raiz } = await abrirPainel();
    const lista = raiz.querySelector('[role="listbox"]')!;

    expect(lista.getAttribute('aria-activedescendant')).toBe('commit-bbbbbbb');
    teclar(fixture, 'ArrowDown');
    expect(lista.getAttribute('aria-activedescendant')).toBe('commit-aaaaaaa');
    teclar(fixture, 'ArrowDown');
    expect(lista.getAttribute('aria-activedescendant')).toBe('commit-aaaaaaa');
    teclar(fixture, 'Home');
    expect(lista.getAttribute('aria-activedescendant')).toBe('commit-bbbbbbb');
  });

  it('Enter mostra os detalhes do merge com os links do commit e do PR', async () => {
    const { fixture, raiz } = await abrirPainel();

    teclar(fixture, 'Enter');
    const links = Array.from(raiz.querySelectorAll<HTMLAnchorElement>('.detalhes a'));

    expect(raiz.querySelector('.detalhes')?.textContent).toContain('feat/x');
    expect(links.map((a) => a.href)).toEqual([
      `https://github.com/usuario/projeto/commit/${'b'.repeat(40)}`,
      'https://github.com/usuario/projeto/pull/27',
    ]);
    links.forEach((a) => expect(a.rel).toContain('noopener'));
    expect(raiz.querySelector('[role="option"]')?.getAttribute('aria-selected')).toBe('true');
  });

  it('não mostra link de PR num commit comum', async () => {
    const { fixture, raiz } = await abrirPainel();

    teclar(fixture, 'ArrowDown');
    teclar(fixture, 'Enter');

    expect(raiz.querySelectorAll('.detalhes a')).toHaveLength(1);
  });

  it('mostra a mensagem de histórico indisponível quando não há commits', async () => {
    const { raiz } = await abrirPainel({ ...HISTORICO, commits: [] });

    expect(raiz.textContent).toContain('histórico do Git não está disponível');
    expect(raiz.querySelector('[role="listbox"]')).toBeNull();
  });

  it('mostra o erro com o botão de tentar de novo', async () => {
    const { raiz } = await abrirPainel({}, false);

    expect(raiz.querySelector('[role="alert"]')?.textContent).toContain('Não foi possível');
    expect(raiz.querySelector('.tentar')?.textContent).toContain('Tentar de novo');
  });

  it('Esc fecha o painel e o botão de fechar também', async () => {
    const { fixture, raiz } = await abrirPainel();
    const painel = TestBed.inject(PainelDoGit);

    raiz.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(painel.aberto()).toBe(false);

    painel.abrir(null);
    fixture.detectChanges();
    raiz.querySelector<HTMLButtonElement>('.fechar')!.click();
    expect(painel.aberto()).toBe(false);
  });
});
