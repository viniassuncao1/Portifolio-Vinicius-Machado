# Spec Delta

## ADDED Requirements

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
