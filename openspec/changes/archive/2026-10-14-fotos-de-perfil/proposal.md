# Proposal

## Why

O portfólio ainda não tem rosto: quem visita não vê o Vinicius e a recomendação da Luana Porto
aparece só como texto. Uma foto aproxima o visitante, e a foto de quem recomenda reforça que a
recomendação é real. O design ([ADR-0012](../../../docs/adr/0012-design-original-com-elementos-do-intellij.md))
não prevê fotos, então elas precisam entrar sem quebrar a ideia de "código dentro da IDE".

## What Changes

- **Retrato no Javadoc:** o editor passa a aceitar um retrato (foto redonda) no Javadoc, como o
  IntelliJ mostra uma imagem num comentário de documentação renderizado (modo de leitura). A foto
  fica à esquerda do texto do Javadoc, sem mudar o código exibido.
- **Início:** foto do Vinicius no Javadoc de `PortfolioApplication`.
- **Sobre Mim:** foto do Vinicius no Javadoc da classe que o apresenta.
- **Depoimentos:** foto da Luana no Javadoc da recomendação, com o nome dela como link para o
  LinkedIn (https://www.linkedin.com/in/luana-porto-pereira-gomes/), em nova aba.
- Fotos otimizadas em `public/fotos/` com `NgOptimizedImage`, `alt` descritivo e tamanho fixo
  (sem deslocar o layout).
- Entrada do diário.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `editor-de-codigo`: Javadoc com retrato opcional.
- `secao-inicio`: foto do Vinicius.
- `secao-sobre-mim`: foto do Vinicius.
- `secao-depoimentos`: foto e link do LinkedIn de quem recomenda.

## Impact

- Código: `shared/editor-de-codigo/` (modelo `LinhaDeJavadoc`, template e estilos), conteúdo de
  `inicio`, `sobre-mim` e `depoimentos`.
- Arquivos: `public/fotos/vinicius.webp` e `public/fotos/luana-porto.webp` (originais 400x400 em
  `.maestri/fotos/`, fora do repositório).
- Testes: unitários do editor e das seções; E2E com axe nos dois temas, celular e sem deslocamento
  de layout.
