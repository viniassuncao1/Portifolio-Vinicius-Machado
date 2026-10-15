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

### Requirement: Contatos com cara de link
Os contatos SHALL parecer links (sublinhado pontilhado e ícone ↗ nos externos), MUST ter área de
toque de pelo menos 24 px (44 px no celular) e a seção SHALL ter o botão "Copiar e-mail", que
copia o endereço e anuncia "E-mail copiado".

#### Scenario: Copiar e-mail
- **WHEN** o visitante ativa "Copiar e-mail"
- **THEN** o e-mail vai para a área de transferência e "E-mail copiado" é anunciado

#### Scenario: Alvo de toque no celular
- **WHEN** a seção é aberta numa tela de 390x844
- **THEN** cada contato tem pelo menos 44 px de altura de toque e o axe não acusa `target-size`
