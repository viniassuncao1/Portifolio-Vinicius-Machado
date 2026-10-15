# Spec Delta

## ADDED Requirements

### Requirement: Quebra suave no celular
Abaixo de 768 px de largura, o código SHALL quebrar linha sem cortar texto, com recuo pendurado,
e a página MUST NOT ter rolagem horizontal.

#### Scenario: Projeto 2 no celular
- **WHEN** o Projeto 2 é aberto numa tela de 390x844
- **THEN** o endereço do site e as descrições aparecem inteiros, sem rolagem horizontal

### Requirement: Modo de leitura do Javadoc
Os Javadocs SHALL aparecer por padrão no modo de leitura do IntelliJ (Rendered View): texto
formatado em Inter, na cor de texto normal, com largura de leitura de ~65 caracteres, fundo
levemente destacado e sem os marcadores `/**`, `*` e `*/`. Cada Javadoc SHALL ter na calha um
botão "Alternar modo de leitura" que mostra o comentário cru, e a escolha vale para o site todo
na visita.

#### Scenario: Sobre Mim
- **WHEN** o visitante abre "Sobre Mim"
- **THEN** a apresentação aparece como texto formatado, sem `*` no começo das linhas

#### Scenario: Ver o comentário cru
- **WHEN** o visitante ativa "Alternar modo de leitura" num Javadoc
- **THEN** os Javadocs voltam a aparecer como comentário com `/**`, `*` e `*/`

#### Scenario: Retrato no modo de leitura
- **WHEN** o visitante abre Depoimentos no modo de leitura
- **THEN** a foto da Luana e o `@author` com o link continuam no Javadoc
