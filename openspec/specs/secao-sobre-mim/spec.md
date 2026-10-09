# secao-sobre-mim Specification

## Purpose
Apresentar o Vinicius na seção Sobre Mim, como na tela 02 do design, com o resumo profissional
escrito como a implementação de uma interface Java.

## Requirements

### Requirement: Item atual na árvore
Na rota `/sobre-mim`, o item "Sobre Mim" SHALL aparecer destacado e expandido e MUST ser
anunciado como página atual.

#### Scenario: Árvore na seção
- **WHEN** a seção "Sobre Mim" está aberta
- **THEN** "Sobre Mim" tem `aria-current="page"` e a seta para baixo

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
