# ADR-0014: Tema claro

- **Status:** Aceito
- **Data:** 2026-10-14

## Contexto

O design original ([ADR-0012](0012-design-original-com-elementos-do-intellij.md)) só tem a versão
escura. O Vinicius pediu um tema claro. Todas as cores já vêm de tokens em
`src/styles/_tokens.scss`, e o site é pré-renderizado
([ADR-0003](0003-pre-renderizacao-estatica.md)), o que exige escolher o tema antes da primeira
pintura para não piscar.

## Decisão

1. **Dois temas por tokens:** o escuro continua o padrão do design; o claro redefine os mesmos
   tokens em `:root[data-tema='claro']`, derivado da paleta do design (mesmas proporções de
   cinzas, rosa do design escurecido para o contraste) e com as **cores de sintaxe do tema claro
   do IntelliJ** (IntelliJ Light), ajustadas para 4,5:1.
2. **Escolha:** na primeira visita segue `prefers-color-scheme`; o botão de tema na barra de
   ferramentas troca e a escolha fica no `localStorage`. Um script inline mínimo no `index.html`
   aplica `data-tema` antes da primeira pintura; sem JavaScript vale o tema do sistema via CSS.
3. **Ícones:** os do design servem nos dois temas; os da IntelliJ Platform usam a variante clara
   (arquivo sem `_dark`) no tema claro.
4. O botão de tema não existe no design nem no IntelliJ; usa um ícone simples desenhado no
   padrão dos demais (desvio registrado).

## Alternativas consideradas

- **Só `prefers-color-scheme`, sem botão.** Mais simples, mas não deixa escolher.
- **Tema claro do IntelliJ inteiro.** Destoaria do design autoral que predomina.

## Consequências

- Toda cor nova precisa existir nos dois temas, e os testes de contraste e o axe rodam nos dois.
- O `theme-color` e o `color-scheme` acompanham o tema.
- O script inline é a única exceção à regra de não ter JavaScript fora do Angular; ele só lê o
  `localStorage` e o `matchMedia`.
