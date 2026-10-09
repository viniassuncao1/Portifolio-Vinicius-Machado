# secao-sobre-mim Specification

## Purpose
Apresentar o Vinicius na seção Sobre Mim, como na tela 02 do design, com o resumo profissional
escrito como a implementação de uma interface Java.

## Requirements

### Requirement: Código da tela 02
A rota `/sobre-mim` SHALL exibir no editor o código da tela 02: a interface `ViniciusMachado`
com o método `void sobreMim();`, a anotação `@Override` e o método `public void sobreMim() {`
com o parágrafo de apresentação, com os mesmos textos, recuos e cores do design.

#### Scenario: Abertura da seção
- **WHEN** o visitante abre a seção "Sobre Mim"
- **THEN** o editor mostra a interface, a anotação, o método e o parágrafo da tela 02

### Requirement: Parágrafo de apresentação
O parágrafo SHALL reproduzir o texto do design (experiência com Java, Spring Boot, Angular e SQL,
a liderança de squad na Memora, a Watts Company e o curso no UniCEUB) como bloco de comentário.

#### Scenario: Texto do parágrafo
- **WHEN** a seção "Sobre Mim" está aberta
- **THEN** o parágrafo começa com "Sou desenvolvedor Full Stack com cerca de 2 anos de
  experiência" e termina com "Sistemas Distribuídos e Arquitetura de Software."

### Requirement: Item atual na árvore
Na rota `/sobre-mim`, o item "Sobre Mim" SHALL aparecer destacado e expandido e MUST ser
anunciado como página atual.

#### Scenario: Árvore na seção
- **WHEN** a seção "Sobre Mim" está aberta
- **THEN** "Sobre Mim" tem `aria-current="page"` e a seta para baixo
