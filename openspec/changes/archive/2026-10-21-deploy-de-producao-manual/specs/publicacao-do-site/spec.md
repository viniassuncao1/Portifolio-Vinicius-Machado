# Spec Delta

## MODIFIED Requirements

### Requirement: Publicação contínua a partir da main
O sistema SHALL publicar o site em produção só quando o pipeline da `main` for disparado
manualmente (`workflow_dispatch`), e somente depois que todas as verificações do pipeline de
qualidade passarem. Um push ou merge na `main` MUST NOT publicar.

#### Scenario: Merge de PR na main
- **WHEN** um Pull Request é mesclado na `main`
- **THEN** o pipeline roda as verificações e a versão de produção não muda

#### Scenario: Verificação falhando
- **WHEN** alguma verificação do pipeline falha
- **THEN** nada é publicado e a versão anterior do site continua no ar

#### Scenario: Publicar
- **WHEN** o pipeline da `main` é disparado pelo botão Run workflow e as verificações passam
- **THEN** a versão da `main` fica disponível no endereço público de produção
