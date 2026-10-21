# sistema-visual Specification

## Purpose
Definir a linguagem visual do portfólio (cores, sintaxe, tipografia, espaçamentos e movimento)
num único conjunto de tokens, para que todas as telas fiquem fiéis ao design e acessíveis.

## Requirements

### Requirement: Estilos vêm dos design tokens
O sistema SHALL definir cores, tipografia, espaçamentos, raios, bordas, durações e curvas de
animação como design tokens globais, e os componentes MUST usar esses tokens em vez de valores
escritos diretamente.

#### Scenario: Troca de um token
- **WHEN** o valor do token de cor de fundo do editor é alterado
- **THEN** o fundo do editor muda em todas as telas, sem alterar nenhum componente

### Requirement: Contraste mínimo
Todo texto exibido MUST ter contraste de pelo menos 4,5:1 com o fundo (WCAG AA). Quando uma cor
do design não atingir esse mínimo, o token SHALL usar a cor mais próxima que atinja.

#### Scenario: Cor de sintaxe com contraste baixo
- **WHEN** uma cor de sintaxe extraída do design tem contraste menor que 4,5:1 com o fundo do
  editor
- **THEN** o token correspondente usa uma variação da mesma cor que atinge 4,5:1

### Requirement: Fonte monoespaçada servida pelo próprio site
O sistema SHALL exibir a interface da IDE (árvore, abas e barras) na fonte Inter e o código na
fonte JetBrains Mono, ambas servidas pelo próprio site, sem requisições a serviços de fontes de
terceiros.

#### Scenario: Carregamento da fonte
- **WHEN** a página inicial é carregada
- **THEN** a Inter e a JetBrains Mono vêm do mesmo domínio do site e nenhuma requisição é feita a
  serviços externos de fontes

### Requirement: Movimento reduzido
Toda animação ou transição MUST ser desativada quando o usuário ativa a preferência de reduzir
movimento no sistema, exibindo o estado final diretamente.

#### Scenario: Preferência de reduzir movimento ativada
- **WHEN** o usuário com `prefers-reduced-motion: reduce` troca de seção ou expande a árvore
- **THEN** o novo estado aparece imediatamente, sem animação

### Requirement: Escala da tipografia
Numa tela de desktop, a interface SHALL usar 13px (árvore com linhas de 24px, barra de status com
texto de 12px) e o código 14px com linhas de 22px e números de linha de 13px, com o painel
lateral de 280px, a barra superior de 40px e a barra de status de 24px, todos definidos por
tokens.

#### Scenario: Desktop de 1920x1080
- **WHEN** a seção Skills é aberta numa janela de 1920x1080
- **THEN** o código está em 14px com linhas de 22px, a árvore em 13px com linhas de 24px e o
  painel lateral tem 280px

### Requirement: Acento único e foco
Cada tema SHALL definir um acento próprio por token, usado de forma consistente dentro dele, e todo
controle focável MUST mostrar um anel de foco de 2px com contraste de pelo menos 3:1 contra o fundo
do tema ativo, sem depender só da cor.

#### Scenario: Foco no teclado
- **WHEN** o visitante navega com Tab pela árvore, pelas abas e pelos botões em seções de temas
  diferentes
- **THEN** cada controle focado mostra o anel de 2px com contraste de pelo menos 3:1 no tema da
  seção

### Requirement: Ajustes nativos do navegador
O sistema SHALL declarar `color-scheme` e `theme-color` de acordo com o tema ativo (`#2B2B2B` no
escuro, o fundo dos painéis claros no claro) e números tabulares nos números de linha e na
posição do cursor.

#### Scenario: Controles nativos no escuro
- **WHEN** a página está no tema escuro num navegador com o sistema no claro
- **THEN** as barras de rolagem e os controles nativos aparecem no tema escuro

#### Scenario: Controles nativos no claro
- **WHEN** o visitante troca para o tema claro
- **THEN** o `color-scheme` passa a `light` e o `theme-color` passa ao fundo dos painéis claros

### Requirement: Ícones oficiais com créditos
Os ícones da interface SHALL ser os do design (árvore, pastas, arquivos, abas e barra de
ferramentas). Onde o design não tem equivalente (▶ da calha, branch, faixa de ferramentas), os
ícones SHALL vir da IntelliJ Platform, na variante de cada tema, com um arquivo de créditos que
cita a origem, o copyright e a licença Apache 2.0. Logotipos da JetBrains MUST NOT ser usados.

#### Scenario: Créditos publicados
- **WHEN** alguém procura a origem dos ícones no repositório
- **THEN** encontra o arquivo de créditos com a origem, o copyright e a licença, citado no README

### Requirement: Cores de sintaxe do Java
O código SHALL usar as cores de sintaxe do Java do IntelliJ sobre o fundo do design:
palavras-chave `#CF8E6D`, textos `#6AAB73`, números `#2AACB8`, anotações `#B3AE60`, campos
`#C77DBA` e comentários `#8F939A` (clareado para passar em 4,5:1).

#### Scenario: Palavra-chave no editor
- **WHEN** o editor exibe `public class`
- **THEN** as palavras-chave aparecem em `#CF8E6D`, com contraste de pelo menos 4,5:1

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
