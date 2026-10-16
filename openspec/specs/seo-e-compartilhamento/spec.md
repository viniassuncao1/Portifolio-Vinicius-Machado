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
(`twitter:card` = `summary_large_image`), com uma imagem de 2400x1260 (proporção 1,91:1,
resolução dupla para continuar nítida depois da compressão das redes) servida pelo próprio site
e com texto alternativo.

#### Scenario: Link compartilhado no LinkedIn
- **WHEN** o link da página inicial é colado no LinkedIn
- **THEN** a prévia mostra a imagem de compartilhamento, o título e a descrição do portfólio

### Requirement: Imagem com versão no endereço
A imagem de compartilhamento SHALL ficar num endereço com versão
(`/compartilhamento/portfolio-v2.png`), e a versão MUST subir a cada mudança da imagem, para as
redes não reaproveitarem a versão antiga do cache.

#### Scenario: Imagem nova
- **WHEN** o cartão muda
- **THEN** a imagem é publicada com a versão seguinte no nome e `og:image` aponta para ela

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
