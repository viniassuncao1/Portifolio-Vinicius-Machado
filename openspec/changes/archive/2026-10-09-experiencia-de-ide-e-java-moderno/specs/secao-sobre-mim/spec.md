# Spec Delta

## ADDED Requirements

### Requirement: Apresentação em Java moderno
A rota `/sobre-mim` SHALL apresentar o Vinicius em Java moderno, preservando todas as
informações do parágrafo da tela 02: cerca de 2 anos de experiência como Full Stack com Java,
Spring Boot, Angular e SQL em sistemas críticos, a liderança de squad na Memora Processos
Inovadores com Scrum, a cofundação da Watts Company com CRM e agentes de IA, e o curso de Ciência
da Computação no UniCEUB com foco em Engenharia de Software, Sistemas Distribuídos e Arquitetura
de Software.

#### Scenario: Abertura da seção
- **WHEN** o visitante abre a seção "Sobre Mim"
- **THEN** o editor mostra a apresentação em Java moderno, com todas as informações do parágrafo da tela
  02

## REMOVED Requirements

### Requirement: Código da tela 02
**Reason**: O código exato das telas deu lugar a Java moderno (ADR-0010); as informações são
preservadas.
**Migration**: Usar o requisito "Apresentação em Java moderno" e a capacidade `conteudo-em-java-moderno`.

### Requirement: Parágrafo de apresentação
**Reason**: O código exato das telas deu lugar a Java moderno (ADR-0010); as informações são
preservadas.
**Migration**: Usar o requisito "Apresentação em Java moderno" e a capacidade `conteudo-em-java-moderno`.
