import { TestBed } from '@angular/core/testing';

import type { HistoricoDoGit } from '../../core/git/historico';
import { Repositorio } from './repositorio';

const commit = (n: number, assunto: string, extra: object = {}) => ({
  sha: String(n).padStart(40, '0'),
  pais: [String(n - 1).padStart(40, '0')],
  autor: 'Pessoa',
  data: `2026-10-${String(n).padStart(2, '0')}T10:00:00Z`,
  assunto,
  ...extra,
});

const HISTORICO: HistoricoDoGit = {
  geradoEm: '2026-10-14T12:00:00Z',
  repositorio: 'usuario/projeto',
  commits: [
    commit(14, 'Merge pull request #31', {
      pais: ['a', 'b'],
      pr: 31,
      branch: 'feat/fotos-de-perfil',
      titulo: 'feat: fotos de perfil no Javadoc',
    }),
    commit(13, 'docs: marca a tarefa 2.1'),
    commit(12, 'feat: mostra a foto'),
    commit(11, 'fix: corrige o foco'),
    commit(1, 'feat: primeiro commit'),
  ],
};

const respostaCom = (corpo: unknown, ok = true) =>
  Promise.resolve({ ok, status: ok ? 200 : 500, json: () => Promise.resolve(corpo) });

describe('Repositorio', () => {
  let fetchFalso: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchFalso = vi.fn(() => respostaCom(HISTORICO));
    vi.stubGlobal('fetch', fetchFalso);
  });

  afterEach(() => vi.unstubAllGlobals());

  async function abrir(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Repositorio);
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const texto = (raiz: HTMLElement, seletor: string) =>
    Array.from(raiz.querySelectorAll(seletor), (e) => e.textContent?.replace(/\s+/g, ' ').trim());

  it('explica o que o repositório mostra e liga ao GitHub em nova aba segura', async () => {
    const raiz = await abrir();
    const botao = raiz.querySelector<HTMLAnchorElement>('header a');

    expect(raiz.querySelector('.descricao')?.textContent).toContain('equipe de agentes de IA');
    expect(raiz.querySelector('.selo')?.textContent).toBe('Público');
    expect(botao?.getAttribute('href')).toBe('https://github.com/usuario/projeto');
    expect(botao?.getAttribute('target')).toBe('_blank');
    expect(botao?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('mostra os números: commits, pull requests, desde quando e último deploy', async () => {
    const raiz = await abrir();

    expect(texto(raiz, '.numero dt')).toEqual([
      'Commits',
      'Pull requests mesclados',
      'Desde',
      'Último deploy',
    ]);
    expect(texto(raiz, '.numero dd').slice(0, 3)).toEqual(['5', '1', '01/10/2026']);
  });

  it('mostra a divisão por tipo com legenda, quantidade e porcentagem em texto', async () => {
    const raiz = await abrir();

    expect(texto(raiz, '.item-da-legenda')).toEqual([
      'featfuncionalidade nova2 (50%)',
      'fixcorreção de erro1 (25%)',
      'docsdocumentação1 (25%)',
    ]);
    expect(raiz.querySelectorAll('.barra .trecho')).toHaveLength(3);
  });

  it('lista o PR #31 com título, branch e link para o GitHub', async () => {
    const raiz = await abrir();
    const pr = raiz.querySelector<HTMLAnchorElement>('#titulo-dos-prs ~ .lista a');

    expect(pr?.textContent).toContain('feat: fotos de perfil no Javadoc');
    expect(pr?.getAttribute('href')).toBe('https://github.com/usuario/projeto/pull/31');
    expect(raiz.querySelector('#titulo-dos-prs ~ .lista')?.textContent).toContain(
      'feat/fotos-de-perfil',
    );
  });

  it('lista os commits de código, sem as marcações de tarefa', async () => {
    const raiz = await abrir();
    const assuntos = texto(raiz, '#titulo-dos-commits ~ .lista .titulo-do-item');

    expect(assuntos.join('|')).toContain('feat: mostra a foto');
    expect(assuntos.join('|')).not.toContain('marca a tarefa');
  });

  it('termina com o link para o histórico completo no GitHub', async () => {
    const raiz = await abrir();
    const tudo = raiz.querySelector('.tudo');

    expect(tudo?.textContent).toContain('Ver todo o histórico no GitHub');
    expect(tudo?.getAttribute('href')).toBe('https://github.com/usuario/projeto/commits');
  });

  it('baixa o histórico uma vez só ao abrir', async () => {
    await abrir();

    expect(fetchFalso).toHaveBeenCalledTimes(1);
  });

  it('mostra o erro com "Tentar de novo"', async () => {
    fetchFalso.mockReturnValueOnce(respostaCom({}, false));
    const raiz = await abrir();

    expect(raiz.querySelector('[role="alert"]')?.textContent).toContain('Não foi possível');
    expect(raiz.querySelector('[role="alert"] button')?.textContent).toContain('Tentar de novo');
  });

  it('avisa que o histórico não está disponível quando vem vazio', async () => {
    fetchFalso.mockReturnValueOnce(respostaCom({ ...HISTORICO, commits: [] }));
    const raiz = await abrir();

    expect(raiz.textContent).toContain('não está disponível');
    expect(raiz.querySelector('.tudo')).not.toBeNull();
  });
});
