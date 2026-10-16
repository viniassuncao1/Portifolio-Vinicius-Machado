# Spec Delta

## MODIFIED Requirements

### Requirement: Três experiências em páginas
A seção Experiências SHALL mostrar num arquivo só, em `/experiencias`, as três experiências:
Memora (Desenvolvedor Full Stack Júnior, 08/2026 até hoje), estágio na Memora (Estagiário de
Desenvolvimento, 08/2025 a 07/2026) e Watts Company (Co-fundador e Desenvolvedor Full Stack,
02/2025 até hoje).

#### Scenario: Páginas
- **WHEN** o visitante abre Experiências
- **THEN** as três aparecem no mesmo arquivo, cada uma com a empresa, o cargo e o período

### Requirement: Destaques de cada experiência
Cada experiência SHALL incluir as responsabilidades e realizações das telas 07, 08 e 09, como
texto em bloco de comentário ou lista de destaques.

#### Scenario: Estágio na Memora
- **WHEN** o visitante chega ao estágio na Memora
- **THEN** ele cita a migração de Oracle para PostgreSQL, os scrapers em Java com Playwright e o AyoForms
