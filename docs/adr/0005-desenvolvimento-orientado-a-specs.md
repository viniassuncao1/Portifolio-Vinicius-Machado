# ADR-0005: Desenvolvimento orientado a specs com OpenSpec

- **Status:** Aceito
- **Data:** 2026-10-08

## Contexto

Boa parte do código é escrita com agentes de IA. Sem um plano explícito, a IA tende a produzir
soluções genéricas, mudar o escopo no meio do caminho e deixar decisões sem registro.

## Decisão

Adotar **Spec-Driven Development (SDD)** com o [OpenSpec](https://github.com/Fission-AI/OpenSpec).
Toda funcionalidade começa como uma _change_ em `openspec/changes/<nome>/`, com:

- `proposal.md`: por que e o quê
- `specs/`: o comportamento esperado, em cenários testáveis (WHEN/THEN)
- `design.md`: as decisões técnicas e as alternativas
- `tasks.md`: as tarefas, cada uma com sua forma de verificação

A change é revisada **antes** do código. Depois do merge, ela é arquivada e as specs passam a
viver em `openspec/specs/` como documentação do comportamento atual do site.

## Alternativas consideradas

- **Prompts soltos para a IA:** rápido, mas sem rastreabilidade e com retrabalho frequente.
- **Issues do GitHub como especificação:** úteis para tarefas, mas sem estrutura para
  comportamento e design, e fora do repositório.

## Consequências

- Mais trabalho antes de codar, compensado por menos retrabalho e por um histórico que explica
  cada mudança.
- Os artefatos são escritos em pt-BR (`openspec/config.yaml`).
- O fluxo está descrito em [docs/desenvolvimento-com-ia.md](../desenvolvimento-com-ia.md).
