# Spec Delta

## MODIFIED Requirements

### Requirement: Cartão de compartilhamento
Cada página SHALL ter as marcações Open Graph (`og:title`, `og:description`, `og:url`,
`og:image` com largura e altura, `og:type`, `og:locale` = `pt_BR`, `og:site_name`) e Twitter/X
(`twitter:card` = `summary_large_image`), com uma imagem de 2400x1260 (proporção 1,91:1, resolução dupla para continuar nítida depois da
compressão das redes) servida pelo próprio site
e com texto alternativo.

#### Scenario: Link compartilhado no LinkedIn
- **WHEN** o link da página inicial é colado no LinkedIn
- **THEN** a prévia mostra a imagem de compartilhamento, o título e a descrição do portfólio
