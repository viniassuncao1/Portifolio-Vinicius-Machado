# paginas-de-secao Specification

## Purpose
Mostrar cada seção inteira num arquivo só, levar os endereços antigos de página à seção e ligar o
fim de cada seção à seguinte.

## Requirements

### Requirement: Próximo arquivo
O fim do editor de cada seção SHALL ter o link `Próximo: <arquivo> →` para a seção seguinte na
ordem da árvore; a última seção MUST NOT ter o link.

#### Scenario: Depois de Sobre Mim
- **WHEN** o visitante chega ao fim de "Sobre Mim" e ativa o próximo arquivo
- **THEN** a seção seguinte da árvore abre

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
