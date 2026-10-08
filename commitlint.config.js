// Conventional Commits com os tipos definidos em .claude/rules/ecc/common/git-workflow.md
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'docs', 'test', 'chore', 'perf', 'ci', 'style', 'build'],
    ],
    // Mensagens em português começam com verbo no presente ("adiciona", "corrige").
    'subject-case': [0],
  },
};
