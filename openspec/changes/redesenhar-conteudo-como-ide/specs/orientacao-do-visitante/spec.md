# Spec Delta

## REMOVED Requirements

### Requirement: Cartão e código como duas visões do mesmo conteúdo
**Reason**: Decisão do Vinicius (21/10): cada seção já é um arquivo com forma própria de IDE
(`build.gradle`, `git log --graph`, terminal, janela de Run), então o controle Cartão ⇄ Código
perde o sentido.
**Migration**: A forma da seção é a única visão. Onde o Java completo agrega, ele aparece como uma
aba secundária do arquivo, sem botão de alternar; ver `conteudo-em-linguagem-de-ide`.

### Requirement: Código que vira cartão na abertura
**Reason**: O Início deixa de resolver a classe num cartão de apresentação.
**Migration**: Ver "Início como classe Java com Run" e "Primeira dobra para recrutadores" em
`conteudo-em-linguagem-de-ide`.
