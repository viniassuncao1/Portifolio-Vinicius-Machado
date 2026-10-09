# Spec Delta

## Purpose

Permitir que uma seção cujo conteúdo ocupa várias telas no design seja mostrada em páginas, cada
uma com endereço próprio, navegáveis por um controle no estilo da IDE.

## ADDED Requirements

### Requirement: Endereço por página
Uma seção com N páginas SHALL ter a primeira página no endereço da seção e as demais em
`/<seção>/<número>`, de 2 a N, e cada endereço SHALL ser entregue já renderizado no HTML.

#### Scenario: Acesso direto à segunda página
- **WHEN** o visitante abre `/skills/2`
- **THEN** o editor mostra a segunda página de Skills, já no HTML recebido

#### Scenario: Página inexistente
- **WHEN** o visitante abre `/skills/9`
- **THEN** ele é levado à página inicial, como em qualquer rota inexistente

### Requirement: Controle de páginas
Abaixo do código, uma seção com mais de uma página SHALL exibir um controle no formato
`◂ 1/2 ▸`, com links para a página anterior e a próxima. Na primeira página não há link para a
anterior, e na última não há link para a próxima.

#### Scenario: Ir para a próxima página
- **WHEN** o visitante está em `/skills` e ativa "Próxima página"
- **THEN** o endereço muda para `/skills/2` e o controle mostra `2/2`

#### Scenario: Seção de uma página só
- **WHEN** o visitante abre uma seção com uma única página
- **THEN** nenhum controle de páginas aparece

### Requirement: Controle acessível
O controle de páginas MUST ser uma navegação identificada ("Páginas da seção"), com links
nomeados "Página anterior" e "Próxima página", alcançáveis por teclado com foco visível, e a
página atual MUST ser anunciada.

#### Scenario: Leitor de tela no controle
- **WHEN** um leitor de tela percorre o controle em `/skills/2`
- **THEN** ele anuncia a navegação "Páginas da seção", o link "Página anterior" e "página 2 de
  2"

### Requirement: Seção atual em todas as páginas
O item da seção na árvore SHALL continuar destacado e marcado como página atual em todas as
páginas da seção, e o título da janela SHALL indicar a página a partir da segunda.

#### Scenario: Segunda página de Skills
- **WHEN** o visitante está em `/skills/2`
- **THEN** "Skills / STACK" está marcado como página atual e o título da janela é
  "Skills / STACK (2/2) | Vinicius Machado"
