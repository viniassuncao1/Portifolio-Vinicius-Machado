# Spec Delta

## MODIFIED Requirements

### Requirement: Design como referência
As telas em `design/telas/` SHALL ser a referência das informações e da identidade visual
(paleta, degradê da barra de ferramentas, editor de cantos arredondados, abas e cabeçalho do
painel). Do IntelliJ IDEA ficam os ícones da IntelliJ Platform, o projeto em pacotes, as
referências ao Git, a faixa de ferramentas, a barra de status com o caminho do arquivo e a
tipografia compacta. Desvios MUST ser permitidos quando melhoram a experiência de IDE ou a
acessibilidade, e MUST ser registrados no design da change.

#### Scenario: Comparação com a tela 01
- **WHEN** a página inicial é aberta numa janela de 1920x1080
- **THEN** as informações e as cores batem com a `tela-01.png`: barra com degradê, painel e
  editor nos cinzas do design, editor com cantos arredondados e palavras-chave em rosa

#### Scenario: Desvio intencional
- **WHEN** uma change acrescenta algo que não existe no design
- **THEN** o elemento usa os tokens do sistema visual e o desvio está descrito no design da
  change

### Requirement: Acento único e foco
O sistema SHALL usar um único acento, o rosa do design (`#DE60D2`), e todo controle focável
MUST mostrar um anel de foco rosa de 2px.

#### Scenario: Foco no teclado
- **WHEN** o visitante navega com Tab pela árvore, pelas abas e pelos botões
- **THEN** cada controle focado mostra o anel rosa de 2px

### Requirement: Ajustes nativos do navegador
O sistema SHALL declarar `color-scheme: dark`, um `theme-color` igual ao fundo dos painéis do
design (`#2B2B2B`) e números tabulares nos números de linha e na posição do cursor.

#### Scenario: Controles nativos no escuro
- **WHEN** a página é aberta num navegador com tema claro
- **THEN** as barras de rolagem e os controles nativos aparecem no tema escuro

## ADDED Requirements

### Requirement: Ícones oficiais com créditos
Os ícones da interface SHALL vir da IntelliJ Platform (variante clara sobre a barra de
ferramentas, escura no resto), servidos pelo próprio site, com um arquivo de créditos que cita a
origem, o aviso de copyright e a licença Apache 2.0. Logotipos de produtos e marcas da JetBrains
MUST NOT ser usados.

#### Scenario: Créditos publicados
- **WHEN** alguém procura a origem dos ícones no repositório
- **THEN** encontra o arquivo de créditos com a origem, o copyright e a licença, citado no README
