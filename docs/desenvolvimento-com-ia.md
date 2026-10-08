# Desenvolvimento com IA

Este portfólio é construído com o auxílio do [Claude Code](https://claude.com/claude-code), usando
**Spec-Driven Development (SDD)** com o [OpenSpec](https://github.com/Fission-AI/OpenSpec). A IA
acelera a implementação, mas cada decisão passa por planejamento, revisão e verificação
automática.

## O fluxo

```
  ideia ──► proposta ──► implementação ──► revisão ──► arquivamento
           (OpenSpec)    (Claude Code)    (PR + CI)    (OpenSpec)
```

1. **Proposta (`/opsx:propose`).** Descrevo o que quero, e a IA gera em
   `openspec/changes/<nome>/`:
   - `proposal.md`: por que a mudança existe e o que entra no escopo
   - `specs/`: o comportamento esperado, com cenários testáveis (WHEN/THEN)
   - `design.md`: as decisões técnicas e as alternativas descartadas
   - `tasks.md`: a lista de tarefas, cada uma com sua forma de verificação

   Reviso e ajusto esses arquivos **antes** de qualquer código ser escrito.

2. **Implementação (`/opsx:apply`).** A IA executa as tarefas em ordem, em commits pequenos,
   seguindo as convenções do projeto ([`CLAUDE.md`](../CLAUDE.md) e
   [`.claude/rules/ecc/`](../.claude/rules/ecc/)).

3. **Revisão.** Abro um Pull Request. O CI roda lint, testes com cobertura mínima de 80%, build
   e E2E. Eu reviso o código como reviso o de qualquer colega.

4. **Arquivamento (`/opsx:archive`).** Depois do merge, a change vai para
   `openspec/changes/archive/` e as specs consolidadas passam a viver em `openspec/specs/`. Essas
   specs viram a documentação viva do que o site faz.

## Por que trabalhar assim

- **Contexto para a IA:** specs e regras explícitas reduzem respostas genéricas e retrabalho.
- **Rastreabilidade:** cada commit se liga a uma tarefa, cada tarefa a uma spec e cada spec a
  uma proposta.
- **Qualidade verificável:** o que a IA escreve passa pelas mesmas barreiras que o código
  humano (hooks, CI e revisão).

## O que está versionado

| Caminho                                               | Conteúdo                                                               |
| ----------------------------------------------------- | ---------------------------------------------------------------------- |
| `openspec/`                                           | Configuração, specs consolidadas e histórico de changes                |
| `CLAUDE.md`                                           | Convenções do projeto que o agente de IA segue                         |
| `.claude/rules/ecc/`                                  | Regras de código (comum, TypeScript, Angular, Web)                     |
| `.claude/skills/openspec-*`, `.claude/commands/opsx/` | Comandos do fluxo OpenSpec no Claude Code                              |
| `.mcp.json`                                           | Servidor MCP do Angular CLI, que dá à IA acesso à documentação oficial |

O restante das ferramentas locais de IA fica fora do repositório (veja o `.gitignore`).
