# Spec Delta

## ADDED Requirements

### Requirement: Diferenciais em Java moderno
A rota `/diferenciais` SHALL mostrar em Java moderno que o Vinicius é mineiro, mora em Brasília
há 20 anos, é extrovertido, curioso e gosta de aprender, e o texto da tela 03 sobre gostar de
boas discussões e não se prender só a back-end ou front-end.

#### Scenario: Abertura da seção
- **WHEN** o visitante abre a seção "Diferenciais"
- **THEN** o editor mostra essas informações, com os valores booleanos na cor de valor literal

## REMOVED Requirements

### Requirement: Código da tela 03
**Reason**: O código exato das telas deu lugar a Java moderno (ADR-0010); as informações são
preservadas.
**Migration**: Usar o requisito "Diferenciais em Java moderno" e a capacidade `conteudo-em-java-moderno`.

### Requirement: Parágrafo dos diferenciais
**Reason**: O código exato das telas deu lugar a Java moderno (ADR-0010); as informações são
preservadas.
**Migration**: Usar o requisito "Diferenciais em Java moderno" e a capacidade `conteudo-em-java-moderno`.
