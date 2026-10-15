# Spec Delta

## REMOVED Requirements

### Requirement: Endereço por página
**Reason**: cada seção é um arquivo só, sem páginas.
**Migration**: ver "Endereços antigos".

### Requirement: Controle de páginas
**Reason**: o controle `◂ n/N ▸` sai do site.
**Migration**: o conteúdo inteiro aparece rolando.

### Requirement: Controle acessível
**Reason**: o controle saiu.
**Migration**: nenhuma.

### Requirement: Seção atual em todas as páginas
**Reason**: não há mais páginas.
**Migration**: ver "Seção numa tela só".

## ADDED Requirements

### Requirement: Seção numa tela só
Cada seção SHALL mostrar todo o seu conteúdo num único arquivo, rolando, e o site MUST NOT ter
controle de páginas.

#### Scenario: Experiências inteira
- **WHEN** o visitante abre `/experiencias`
- **THEN** Memora, o estágio na Memora e a Watts Company aparecem no mesmo arquivo, sem controle
  de páginas

### Requirement: Endereços antigos
Os endereços `/<seção>/<n>` das antigas páginas SHALL levar à seção (`/<seção>`) e MUST NOT
aparecer no sitemap.

#### Scenario: Link antigo
- **WHEN** o visitante abre `/skills/3`
- **THEN** ele chega a `/skills`, com os níveis de conhecimento no mesmo arquivo
