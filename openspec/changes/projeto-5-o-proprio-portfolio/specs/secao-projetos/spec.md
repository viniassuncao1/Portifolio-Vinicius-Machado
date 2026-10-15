# Spec Delta

## ADDED Requirements

### Requirement: Projeto 5, este portfólio
A rota `/projeto-5` SHALL apresentar, em `Projeto5.java`, num arquivo só e em 4 partes, o próprio portfólio
como estudo de desenvolvimento com IA: o estudo, SDD com OpenSpec, o ECC de Affaan Mustafa
(vencedor do hackathon Anthropic x Forum Ventures em setembro de 2025) e o Maestri de Evert
Junior, desenvolvedor brasileiro, com links externos para o repositório, o ECC e o Maestri.

#### Scenario: Abrir o Projeto 5
- **WHEN** o visitante abre "Projeto 5" na árvore
- **THEN** o arquivo começa pelo estudo, com o link para o repositório no GitHub

#### Scenario: Página do Maestri
- **WHEN** o visitante chega à parte do Maestri no Projeto 5
- **THEN** o texto apresenta o Maestri, de Evert Junior, e a equipe de agentes do portfólio, com
  link para o Maestri em nova aba

#### Scenario: Code vision
- **WHEN** o visitante ativa `▶ Executar · Ver no GitHub` no Projeto 5
- **THEN** o repositório abre em nova aba com `rel="noopener noreferrer"`
