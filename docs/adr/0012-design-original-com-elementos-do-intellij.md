# ADR-0012: Design original com elementos do IntelliJ

- **Status:** Aceito
- **Data:** 2026-10-14
- **Substitui em parte:** [ADR-0011](0011-identidade-visual-intellij-new-ui.md) (a identidade
  visual: paleta, barras e formas)

## Contexto

O [ADR-0011](0011-identidade-visual-intellij-new-ui.md) trocou a identidade visual pela do IntelliJ
IDEA New UI. Depois das duas primeiras changes (tokens e tipografia; barras e ícones), o Vinicius
viu o resultado e concluiu que o site ficou "literalmente o IntelliJ": perdeu a identidade do
design feito sob encomenda (`design/telas/`), que é o que diferencia o portfólio. Ao mesmo tempo,
gostou dos elementos de IDE de verdade: ícones de Java, projeto em pastas e pacotes, referências
ao Git e a fonte Inter com a escala compacta.

## Decisão

1. **O design original volta a ser a referência visual e predomina:** a paleta das telas (fundos
   `#2B2B2B`/`#1C1C1C`, palavras-chave em rosa `#DE60D2`, foco rosa), a barra de ferramentas com
   degradê e os controles de janela, o editor com cantos arredondados, as abas e o cabeçalho do
   painel `Portfolio_Vinicius`.
2. **Do IntelliJ ficam:** os ícones da IntelliJ Platform (Java, pastas, pacotes, executar,
   buscar, Git), a estrutura do projeto em pacotes, as referências ao Git (branch `master` e
   commit do deploy), a faixa de ferramentas à esquerda, a barra de status com o caminho do
   arquivo e a tipografia da change de tokens (Inter na interface, JetBrains Mono no código, na
   escala compacta).
3. Continua valendo o resto do ADR-0011: árvore Spring por funcionalidade, identificadores de
   domínio em português e as próximas changes (árvore de projeto, Executar na calha, janela de
   Run, reescrita do Java), sempre no visual do design original.

## Alternativas consideradas

- **Manter o IntelliJ puro.** Fiel à IDE, mas apaga o design que diferencia o portfólio.
- **Voltar ao design original sem nada do IntelliJ.** Recupera a identidade, mas perde os
  elementos de IDE real e a escala compacta, que resolveram o "tudo grande demais".

## Consequências

- Os tokens de cor, o degradê, os raios e as formas das abas e do cabeçalho voltam aos valores do
  design (com os ajustes de contraste já registrados na note "Design Tokens"); a tipografia e a
  densidade continuam as da change de tokens.
- Os ícones claros na barra de ferramentas (que tem fundo claro) usam a variante do tema claro da
  IntelliJ Platform; no resto da interface, a variante escura.
- O requisito "Design como referência" da spec `sistema-visual` volta a apontar para as telas.
