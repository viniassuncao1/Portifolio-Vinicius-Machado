# Decisões de arquitetura (ADRs)

Cada decisão importante do projeto é registrada num **ADR** (Architecture Decision Record): um
documento curto com o contexto, a decisão, as alternativas descartadas e as consequências.

Um ADR aceito não é editado. Se a decisão mudar, um novo ADR o substitui e o antigo passa a
"Substituído por ADR-XXXX".

| ADR                                                       | Decisão                                                      | Status                                         |
| --------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------- |
| [0001](0001-registrar-decisoes-com-adrs.md)               | Registrar decisões com ADRs                                  | Aceito                                         |
| [0002](0002-angular-como-framework.md)                    | Angular como framework                                       | Aceito                                         |
| [0003](0003-pre-renderizacao-estatica.md)                 | Pré-renderização estática (SSG)                              | Aceito                                         |
| [0004](0004-vercel-com-deploy-pelo-github-actions.md)     | Vercel com deploy pelo GitHub Actions                        | Aceito                                         |
| [0005](0005-desenvolvimento-orientado-a-specs.md)         | Desenvolvimento orientado a specs com OpenSpec               | Aceito                                         |
| [0006](0006-regras-de-codigo-com-ecc.md)                  | Regras de código para a IA com o ECC                         | Aceito                                         |
| [0007](0007-equipe-de-agentes-no-maestri.md)              | Equipe de agentes de IA no Maestri                           | Aceito                                         |
| [0008](0008-diario-de-desenvolvimento.md)                 | Diário de desenvolvimento                                    | Aceito                                         |
| [0009](0009-acessibilidade-automatizada-com-axe.md)       | Acessibilidade automatizada com axe nos E2E                  | Aceito                                         |
| [0010](0010-design-como-referencia-e-java-moderno.md)     | Design como referência e Java moderno                        | Aceito, substituído em parte pelo 0011         |
| [0011](0011-identidade-visual-intellij-new-ui.md)         | Identidade visual do IntelliJ IDEA New UI                    | Aceito, substituído em parte pelos 0012 e 0015 |
| [0012](0012-design-original-com-elementos-do-intellij.md) | Design original com elementos do IntelliJ                    | Aceito                                         |
| [0013](0013-historico-do-git-gerado-no-build.md)          | Histórico do Git gerado no build                             | Aceito, substituído em parte pelo 0016         |
| [0014](0014-tema-claro.md)                                | Tema claro                                                   | Aceito                                         |
| [0015](0015-tela-de-boas-vindas.md)                       | Tela de boas-vindas no lugar da abertura com a janela de Run | Aceito, substituído pelo 0017                  |
| [0016](0016-repositorio-no-estilo-do-github.md)           | Página do repositório no estilo do GitHub                    | Aceito                                         |
| [0017](0017-abertura-com-run.md)                          | Abertura com Run                                             | Aceito                                         |
| [0018](0018-secoes-num-arquivo-so.md)                     | Seções num arquivo só, sem paginação                         | Aceito                                         |

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
