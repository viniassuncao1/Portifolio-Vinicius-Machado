# Proposal

## Why

O Vinicius quer manter no ar o portfólio publicado até o PR #40 e refatorar tudo localmente,
publicando só quando gostar. O PR #41 já está na `main` sem deploy (o pipeline foi cancelado a
tempo), e hoje qualquer merge na `main` publicaria sozinho.

## What Changes

- O job **Deploy de produção** passa a rodar só pelo botão **Run workflow** (`workflow_dispatch`)
  na `main`; push e merge na `main` continuam testando, sem publicar.
- **ADR-0020** registra a decisão (substitui em parte o ADR-0004).
- `docs/deploy.md` e README explicam como publicar.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `publicacao-do-site`: a publicação em produção passa a ser manual.

## Impact

- `.github/workflows/ci.yml`, `docs/adr/`, `docs/deploy.md`, README e diário.
