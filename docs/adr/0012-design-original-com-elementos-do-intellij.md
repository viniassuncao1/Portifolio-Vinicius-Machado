# ADR-0012: Design original com elementos do IntelliJ

- **Status:** Aceito, substituído em parte pelo [ADR-0019](0019-experiencia-focada-em-recrutadores.md)
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

1. **O design original volta a ser a referência visual e predomina:** a paleta das telas na
   interface (fundos `#2B2B2B`/`#1C1C1C`, foco rosa `#DE60D2`), os **ícones do design** (pastas,
   arquivos e ferramentas no estilo das telas), os controles de janela, o editor com cantos
   arredondados, as abas e o cabeçalho do painel `Portfolio_Vinicius`.
2. **Do IntelliJ ficam:** a estrutura do projeto em pastas (pacotes), as cores de sintaxe do Java
   no código, as referências ao Git (branch `master` e commit do deploy), a faixa de ferramentas
   à esquerda, o Executar na calha, a barra de status com o caminho do arquivo e a tipografia da
   change de tokens (Inter na interface, JetBrains Mono no código, na escala compacta). Ícones da
   IntelliJ Platform só onde o design não tem equivalente (▶ da calha, branch, faixa de
   ferramentas), com créditos.
3. **Desvio do design:** a barra de ferramentas perde o degradê claro e passa a ser escura, nos
   cinzas do design, porque a faixa clara destoava do resto da interface escura.
4. Continua valendo o resto do ADR-0011: árvore Spring por funcionalidade, identificadores de
   domínio em português e as próximas changes (janela de Run, reescrita do Java), sempre no
   visual do design original.

## Alternativas consideradas

- **Manter o IntelliJ puro.** Fiel à IDE, mas apaga o design que diferencia o portfólio.
- **Voltar ao design original sem nada do IntelliJ.** Recupera a identidade, mas perde os
  elementos de IDE real e a escala compacta, que resolveram o "tudo grande demais".

## Consequências

- Os tokens de cor da interface, os raios e as formas das abas e do cabeçalho voltam aos valores
  do design (com os ajustes de contraste registrados na note "Design Tokens"); a tipografia e a
  densidade continuam as da change de tokens, e as cores de sintaxe são as do IntelliJ.
- A árvore em pastas usa os ícones do design; os SVGs do design (`public/icones/*.svg`) voltam a
  ser o conjunto principal, e os da IntelliJ Platform ficam restritos aos usos do item 2.
- O requisito "Design como referência" da spec `sistema-visual` volta a apontar para as telas.
