## REMOVED Requirements

### Requirement: Design como referência
**Reason:** O portfólio deixa de seguir fielmente as telas de `design/telas/` (ADR que revisa o
ADR-0012); o requisito é substituído por "Linguagem mínima de IDE".
**Migration:** Usar "Linguagem mínima de IDE", e registrar desvios no ADR e no design da change.

## MODIFIED Requirements

### Requirement: Acento único e foco
Cada tema SHALL definir um acento próprio por token, usado de forma consistente dentro dele, e todo
controle focável MUST mostrar um anel de foco de 2px com contraste de pelo menos 3:1 contra o fundo
do tema ativo, sem depender só da cor.

#### Scenario: Foco no teclado
- **WHEN** o visitante navega com Tab pela árvore, pelas abas e pelos botões em seções de temas
  diferentes
- **THEN** cada controle focado mostra o anel de 2px com contraste de pelo menos 3:1 no tema da
  seção

## ADDED Requirements

### Requirement: Linguagem mínima de IDE
O portfólio SHALL manter uma linguagem de IDE mínima, com referências ao Java e ao IntelliJ IDEA
(projeto em pacotes, abas, barra de status com caminho e Git, ▶ Executar, sintaxe do Java), e MUST
NOT seguir fielmente as telas de `design/telas/`. Os desvios em relação ao design original MUST
constar no ADR que revisa o ADR-0012.

#### Scenario: Reconhecimento de IDE
- **WHEN** um visitante vê a página inicial
- **THEN** reconhece uma IDE pelo projeto em pacotes, pelas abas, pela barra de status e pelo
  código em Java, sem precisar que o visual coincida com uma tela do design

#### Scenario: Desvio registrado
- **WHEN** a interface adota uma forma, cor ou estrutura que difere de `design/telas/`
- **THEN** o desvio consta no ADR que revisa o ADR-0012 ou no design da change

### Requirement: Tokens de tema por seção
O sistema SHALL definir, para cada seção da página inicial, um conjunto de tokens (fundo, texto,
texto secundário, linha, acento, acento secundário e texto sobre o acento) e MUST validar em
teste que todo par de texto e fundo de cada conjunto tem contraste de pelo menos 4,5:1, inclusive
no tema claro.

#### Scenario: Novo tema reprovado
- **WHEN** um conjunto de tokens de seção tem um par de texto e fundo abaixo de 4,5:1
- **THEN** o teste de contraste falha e aponta a seção e o par
