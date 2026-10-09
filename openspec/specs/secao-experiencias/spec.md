# secao-experiencias Specification

## Purpose
Apresentar a experiência profissional do Vinicius na seção Experiências, em três páginas, como
records Java com cargo, período e destaques.

## Requirements

### Requirement: Três experiências em páginas
A seção Experiências SHALL ter três páginas: Memora (Desenvolvedor Full Stack Júnior, 08/2026
até hoje), estágio na Memora (Estagiário de Desenvolvimento, 08/2025 a 07/2026) e Watts Company
(Co-fundador e Desenvolvedor Full Stack, 02/2025 até hoje), nas rotas `/experiencias`,
`/experiencias/2` e `/experiencias/3`.

#### Scenario: Páginas
- **WHEN** o visitante percorre as três páginas de Experiências
- **THEN** cada uma mostra a empresa, o cargo e o período correspondentes

### Requirement: Destaques de cada experiência
Cada página SHALL incluir as responsabilidades e realizações das telas 07, 08 e 09, como texto
em bloco de comentário ou lista de destaques.

#### Scenario: Estágio na Memora
- **WHEN** a página 2 está aberta
- **THEN** ela cita a migração de Oracle para PostgreSQL, os scrapers em Java com Playwright e o AyoForms
