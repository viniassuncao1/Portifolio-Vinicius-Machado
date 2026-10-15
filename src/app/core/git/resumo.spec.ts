import type { CommitDoHistorico } from './historico';
import { contarPorTipo, tipoDoCommit, ultimosCommitsDeCodigo, ultimosPrs } from './resumo';

const commit = (assunto: string, extra: Partial<CommitDoHistorico> = {}): CommitDoHistorico => ({
  sha: `sha-${assunto}`,
  pais: ['pai'],
  autor: 'Vinicius',
  data: '2026-10-14T10:00:00-03:00',
  assunto,
  ...extra,
});

const merge = (pr: number, titulo?: string): CommitDoHistorico =>
  commit(`Merge pull request #${pr} from u/feat/x-${pr}`, {
    pais: ['a', 'b'],
    pr,
    branch: `feat/x-${pr}`,
    ...(titulo ? { titulo } : {}),
  });

describe('tipoDoCommit', () => {
  it('lê o tipo com escopo e com "!"', () => {
    expect(tipoDoCommit('feat: adiciona abas')).toBe('feat');
    expect(tipoDoCommit('fix(editor): corrige foco')).toBe('fix');
    expect(tipoDoCommit('refactor!: muda a API')).toBe('refactor');
  });

  it('agrupa em "outros" o que não segue o padrão', () => {
    expect(tipoDoCommit('Merge branch main')).toBe('outros');
    expect(tipoDoCommit('wip: teste')).toBe('outros');
    expect(tipoDoCommit('sem tipo')).toBe('outros');
  });
});

describe('contarPorTipo', () => {
  it('não conta merges e ordena do mais frequente ao menos frequente', () => {
    const resumo = contarPorTipo([
      merge(1),
      commit('docs: a'),
      commit('feat: b'),
      commit('feat: c'),
      commit('Atualiza leia-me'),
      commit('fix: d'),
    ]);
    expect(resumo.map((r) => [r.tipo, r.quantidade])).toEqual([
      ['feat', 2],
      ['fix', 1],
      ['docs', 1],
      ['outros', 1],
    ]);
  });

  it('calcula porcentagens que somam 100', () => {
    const resumo = contarPorTipo([
      commit('feat: a'),
      commit('fix: b'),
      commit('docs: c'),
      commit('test: d'),
    ]);
    expect(resumo.every((r) => r.porcentagem === 25)).toBe(true);
  });

  it('devolve lista vazia sem commits ou só com merges', () => {
    expect(contarPorTipo([])).toEqual([]);
    expect(contarPorTipo([merge(1)])).toEqual([]);
  });
});

describe('ultimosPrs', () => {
  it('pega os 8 mais recentes e usa o título do PR', () => {
    const commits = [
      commit('feat: solto'),
      ...Array.from({ length: 10 }, (_, i) => merge(10 - i, `título ${10 - i}`)),
    ];
    const prs = ultimosPrs(commits);
    expect(prs).toHaveLength(8);
    expect(prs[0]).toMatchObject({ numero: 10, titulo: 'título 10', branch: 'feat/x-10' });
  });

  it('cai para o nome da branch quando o PR não tem título', () => {
    expect(ultimosPrs([merge(3)])[0].titulo).toBe('feat/x-3');
  });
});

describe('ultimosCommitsDeCodigo', () => {
  it('ignora merges e marcações de tarefa e limita a 5', () => {
    const commits = [
      merge(9, 'x'),
      commit('docs: marca a tarefa 1.1 como feita'),
      ...Array.from({ length: 7 }, (_, i) => commit(`feat: ${i}`)),
    ];
    const recentes = ultimosCommitsDeCodigo(commits);
    expect(recentes.map((c) => c.assunto)).toEqual([
      'feat: 0',
      'feat: 1',
      'feat: 2',
      'feat: 3',
      'feat: 4',
    ]);
  });

  it('mantém outros commits de docs', () => {
    expect(ultimosCommitsDeCodigo([commit('docs: atualiza leia-me')])).toHaveLength(1);
  });
});
