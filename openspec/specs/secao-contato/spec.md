# secao-contato Specification

## Purpose
Oferecer as formas de contato do Vinicius na seção Contato, com links que funcionam.

## Requirements

### Requirement: Formas de contato
A rota `/contato` SHALL mostrar o e-mail viniciusmassuncao@gmail.com, o telefone +55 61
98283-7805, o LinkedIn linkedin.com/in/viniassuncao e o GitHub github.com/viniassuncao1.

#### Scenario: Abertura
- **WHEN** o visitante abre a seção Contato
- **THEN** os quatro contatos aparecem no código

### Requirement: Links clicáveis
O e-mail, o telefone, o LinkedIn e o GitHub MUST ser links reais (`mailto:`, `tel:` e
endereços `https://`), e os externos MUST abrir em nova aba com `rel="noopener noreferrer"`.

#### Scenario: Clique no LinkedIn
- **WHEN** o visitante clica no endereço do LinkedIn
- **THEN** o perfil abre numa nova aba
