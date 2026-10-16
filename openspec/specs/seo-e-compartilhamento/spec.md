# seo-e-compartilhamento Specification

## Purpose
Fazer o portfólio aparecer bem quando o link é compartilhado e quando é encontrado por
buscadores, com metadados corretos em cada página.

## Requirements

### Requirement: Metadados por página no HTML pré-renderizado
Cada página SHALL trazer no HTML entregue, sem depender de JavaScript, um título próprio, uma
descrição própria de até 160 caracteres em pt-BR e o endereço canônico absoluto da página, no
domínio próprio `https://vinimachado.wattscompany.com.br`.

#### Scenario: Página de Skills
- **WHEN** um robô baixa `/skills` sem executar JavaScript
- **THEN** o HTML tem o título "Skills / STACK | Vinicius Machado", a descrição da seção e o
  canônico `https://vinimachado.wattscompany.com.br/skills`

### Requirement: Cartão de compartilhamento
Cada página SHALL ter as marcações Open Graph (`og:title`, `og:description`, `og:url`,
`og:image` com largura e altura, `og:type`, `og:locale` = `pt_BR`, `og:site_name`) e Twitter/X
(`twitter:card` = `summary_large_image`), com uma imagem de 1200x630 servida pelo próprio site
e com texto alternativo.

#### Scenario: Link compartilhado no LinkedIn
- **WHEN** o link da página inicial é colado no LinkedIn
- **THEN** a prévia mostra a imagem de compartilhamento, o título e a descrição do portfólio

### Requirement: Dados estruturados
A página inicial SHALL trazer um JSON-LD `Person` com nome, cargo, endereço do site, os perfis do
LinkedIn e do GitHub em `sameAs` e a stack principal em `knowsAbout`.

#### Scenario: Validação dos dados
- **WHEN** o JSON-LD da página inicial é lido
- **THEN** ele é JSON válido do tipo `Person` com nome "Vinicius Machado"

### Requirement: Sitemap e robots
O site SHALL servir `/sitemap.xml` com todas as páginas pré-renderizadas das seções, em endereços
absolutos e sem os endereços antigos de páginas (`/<seção>/<n>`), e `/robots.txt` permitindo a
indexação e apontando para o sitemap.

#### Scenario: Sitemap completo
- **WHEN** o sitemap é lido depois do build
- **THEN** ele lista a página inicial, cada seção e `/repositorio`, e nenhum endereço como `/skills/2`
