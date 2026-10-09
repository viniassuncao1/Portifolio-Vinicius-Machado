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
O sistema SHALL exibir o conteúdo da IDE numa fonte monoespaçada servida pelo próprio site, sem
requisições a serviços de fontes de terceiros.

#### Scenario: Carregamento da fonte
- **WHEN** a página inicial é carregada
- **THEN** a fonte monoespaçada vem do mesmo domínio do site e nenhuma requisição é feita a
  serviços externos de fontes

### Requirement: Movimento reduzido
Toda animação ou transição MUST ser desativada quando o usuário ativa a preferência de reduzir
movimento no sistema, exibindo o estado final diretamente.

#### Scenario: Preferência de reduzir movimento ativada
- **WHEN** o usuário com `prefers-reduced-motion: reduce` troca de seção ou expande a árvore
- **THEN** o novo estado aparece imediatamente, sem animação

### Requirement: Design como referência
As telas em `design/telas/` SHALL ser a referência da identidade visual (cores, tipografia,
proporções e estrutura de IDE). Desvios MUST ser permitidos quando melhoram a experiência de
IDE, a acessibilidade ou a modernidade do código, e MUST ser registrados no design da change.

#### Scenario: Comparação com a tela 01
- **WHEN** a página inicial é aberta numa janela de 1920x1080
- **THEN** a barra de ferramentas, o painel lateral e o editor mantêm as cores, as fontes e as
  proporções da `tela-01.png`

#### Scenario: Desvio intencional
- **WHEN** uma change acrescenta algo que não está nas telas, como a barra de status
- **THEN** o elemento usa os tokens do sistema visual e o desvio está descrito no design da
  change
