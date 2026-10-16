# Spec Delta

## ADDED Requirements

### Requirement: Ícone do site
O site SHALL ter um ícone próprio com as iniciais "VM" num quadrado arredondado na cor de acento,
servido como `favicon.svg`, com `favicon.ico` de reserva e `apple-touch-icon.png` de 180 px, todos
referenciados no HTML pré-renderizado, e MUST NOT usar o ícone padrão do Angular.

#### Scenario: Aba do navegador
- **WHEN** o visitante abre qualquer página
- **THEN** a aba mostra o ícone "VM"

#### Scenario: Atalho no iPhone
- **WHEN** o visitante adiciona o site à tela inicial do iPhone
- **THEN** o atalho usa o `apple-touch-icon.png` de 180 px
