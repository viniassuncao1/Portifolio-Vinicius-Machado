## MODIFIED Requirements

### Requirement: Estrutura fixa da IDE
Toda página SHALL exibir a casca da IDE com as mesmas partes nas mesmas posições: barra superior
com identidade do projeto, ações rápidas e a ação ▶ Executar, navegação do projeto em pacotes,
faixa de abas de arquivos abertos sobre a área de conteúdo, e barra de status no rodapé. O
desenho, as proporções e o ritmo dessas partes são definidos pelo design da change, sem seguir
fielmente as telas de `design/telas/`.

#### Scenario: Abertura de qualquer seção
- **WHEN** o visitante abre a página inicial ou a rota de qualquer seção
- **THEN** a barra superior, a navegação do projeto, a faixa de abas, a área de conteúdo e a
  barra de status aparecem nas mesmas posições

### Requirement: Adaptação a telas pequenas
Em telas com largura menor que 768px, a casca SHALL usar a barra de ações inferior da spec
`orientacao-do-visitante`, ocultar a faixa de ferramentas, abrir o projeto numa gaveta pelo botão
"Seções" (com todas as pastas abertas) e fazer a área de conteúdo ocupar a largura disponível sem
rolagem horizontal da página.

#### Scenario: Celular de 390px
- **WHEN** a página inicial é aberta numa tela de 390x844
- **THEN** a área de conteúdo ocupa a largura da tela, a página não rola na horizontal e a barra
  de ações oferece Seções, Projetos e Contato

#### Scenario: Escolha de seção no celular
- **WHEN** o visitante abre a gaveta por "Seções" e escolhe "Formação"
- **THEN** a seção "Formação" é aberta e a gaveta volta a ficar recolhida

## REMOVED Requirements

### Requirement: Seções fáceis de achar no celular
**Reason:** O requisito é absorvido por "Adaptação a telas pequenas" e pela barra de ações da spec
`orientacao-do-visitante`, que dão ao botão "Seções" o mesmo comportamento junto de Projetos e
Contato.
**Migration:** Usar "Adaptação a telas pequenas": o botão "Seções" tem texto visível e a gaveta abre
com as pastas abertas.
