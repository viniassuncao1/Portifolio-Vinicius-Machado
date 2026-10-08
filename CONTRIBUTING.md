# Como contribuir

Este é um projeto pessoal, mas segue o mesmo fluxo de um time: branch, Pull Request e
verificações automáticas.

## Fluxo

1. **Planeje com o OpenSpec.** Toda funcionalidade nova começa com uma proposta em
   `openspec/changes/<nome>` (veja [desenvolvimento com IA](docs/desenvolvimento-com-ia.md)).
2. **Crie uma branch** a partir da `main`:
   - `feat/<assunto>` para funcionalidades
   - `fix/<assunto>` para correções
   - `chore/<assunto>`, `docs/<assunto>`, `ci/<assunto>` para o restante
3. **Implemente em commits pequenos**, um assunto por commit.
4. **Abra um Pull Request** usando o template. O CI precisa passar antes do merge.
5. **Arquive a change** do OpenSpec depois do merge (`openspec archive <nome>`).

## Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/pt-br/), validados pelo
commitlint no hook `commit-msg`:

```
<tipo>: <descrição no presente, em minúsculas>
```

| Tipo       | Quando usar                                 |
| ---------- | ------------------------------------------- |
| `feat`     | Nova funcionalidade visível no site         |
| `fix`      | Correção de bug                             |
| `refactor` | Mudança de código sem alterar comportamento |
| `style`    | Formatação, sem mudança de lógica           |
| `test`     | Testes novos ou ajustados                   |
| `docs`     | Documentação                                |
| `perf`     | Melhoria de desempenho                      |
| `build`    | Dependências e build                        |
| `ci`       | GitHub Actions                              |
| `chore`    | Configuração e manutenção                   |

Exemplos: `feat: adiciona árvore de navegação lateral`, `fix: corrige foco no menu mobile`.

## Antes de abrir o PR

O hook `pre-commit` já roda ESLint e Prettier nos arquivos alterados. Antes do PR, rode também:

```bash
npm run lint && npm run test:ci && npm run build && npm run e2e
```

## Padrões de código

- As convenções de Angular e TypeScript estão em [`CLAUDE.md`](CLAUDE.md) e em
  [`.claude/rules/ecc/`](.claude/rules/ecc/). Elas valem para humanos e para a IA.
- Cobertura mínima de testes: 80%.
- Acessibilidade: WCAG AA. O ESLint verifica as regras de acessibilidade nos templates.
