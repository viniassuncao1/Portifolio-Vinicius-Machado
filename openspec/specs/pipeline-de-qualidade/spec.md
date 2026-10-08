# pipeline-de-qualidade Specification

## Purpose
Garantir que todo código que entra na branch `main` passou por verificações automáticas de
estilo, formatação, testes, cobertura e build, mantendo o projeto confiável como vitrine.

## Requirements

### Requirement: Verificação automática em Pull Requests
O sistema SHALL executar automaticamente lint, verificação de formatação, testes unitários,
build de produção e testes E2E em todo Pull Request aberto contra a `main` e em todo push na
`main`.

#### Scenario: PR com código válido
- **WHEN** um Pull Request é aberto com código que passa em todas as verificações
- **THEN** o pipeline termina com sucesso e o PR é marcado como aprovado nas checagens

#### Scenario: PR com erro de lint ou teste
- **WHEN** um Pull Request contém um erro de lint, de formatação ou um teste falhando
- **THEN** o pipeline falha e indica qual etapa falhou

### Requirement: Cobertura mínima de testes
O sistema MUST falhar a etapa de testes unitários quando a cobertura de linhas, funções,
branches ou statements ficar abaixo de 80%.

#### Scenario: Cobertura abaixo do mínimo
- **WHEN** os testes passam mas a cobertura de linhas fica abaixo de 80%
- **THEN** a etapa de testes falha informando a cobertura atingida

### Requirement: Mensagens de commit padronizadas
O sistema MUST rejeitar localmente commits cuja mensagem não siga o formato
`<tipo>: <descrição>`, com tipo em `feat`, `fix`, `refactor`, `docs`, `test`, `chore`,
`perf`, `ci`, `style` ou `build`.

#### Scenario: Commit fora do padrão
- **WHEN** o desenvolvedor tenta commitar com a mensagem "ajustes"
- **THEN** o commit é rejeitado com a explicação do formato esperado

#### Scenario: Commit no padrão
- **WHEN** o desenvolvedor commita com a mensagem "feat: adiciona seção de contato"
- **THEN** o commit é aceito

### Requirement: Formatação antes do commit
O sistema SHALL formatar e validar com lint os arquivos preparados para commit antes que o
commit seja criado.

#### Scenario: Arquivo mal formatado no commit
- **WHEN** um arquivo `.ts` preparado para commit está fora do padrão do Prettier
- **THEN** o arquivo é formatado automaticamente e incluído no commit já formatado
