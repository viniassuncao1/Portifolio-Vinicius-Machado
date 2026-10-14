# Spec Delta

## MODIFIED Requirements

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
