# Decisões de arquitetura (ADRs)

Cada decisão importante do projeto é registrada num **ADR** (Architecture Decision Record): um
documento curto com o contexto, a decisão, as alternativas descartadas e as consequências.

Um ADR aceito não é editado. Se a decisão mudar, um novo ADR o substitui e o antigo passa a
"Substituído por ADR-XXXX".

| ADR                                                   | Decisão                                        | Status |
| ----------------------------------------------------- | ---------------------------------------------- | ------ |
| [0001](0001-registrar-decisoes-com-adrs.md)           | Registrar decisões com ADRs                    | Aceito |
| [0002](0002-angular-como-framework.md)                | Angular como framework                         | Aceito |
| [0003](0003-pre-renderizacao-estatica.md)             | Pré-renderização estática (SSG)                | Aceito |
| [0004](0004-vercel-com-deploy-pelo-github-actions.md) | Vercel com deploy pelo GitHub Actions          | Aceito |
| [0005](0005-desenvolvimento-orientado-a-specs.md)     | Desenvolvimento orientado a specs com OpenSpec | Aceito |
| [0006](0006-regras-de-codigo-com-ecc.md)              | Regras de código para a IA com o ECC           | Aceito |
| [0007](0007-equipe-de-agentes-no-maestri.md)          | Equipe de agentes de IA no Maestri             | Aceito |

## Modelo

```markdown
# ADR-XXXX: <decisão>

- **Status:** Proposto | Aceito | Substituído por ADR-YYYY
- **Data:** AAAA-MM-DD

## Contexto

## Decisão

## Alternativas consideradas

## Consequências
```
