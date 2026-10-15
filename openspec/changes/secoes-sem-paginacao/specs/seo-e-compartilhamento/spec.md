# Spec Delta

## MODIFIED Requirements

### Requirement: Sitemap e robots
O site SHALL servir `/sitemap.xml` com todas as páginas pré-renderizadas das seções, em endereços
absolutos e sem os endereços antigos de páginas (`/<seção>/<n>`), e `/robots.txt` permitindo a
indexação e apontando para o sitemap.

#### Scenario: Sitemap completo
- **WHEN** o sitemap é lido depois do build
- **THEN** ele lista a página inicial, cada seção e `/repositorio`, e nenhum endereço como `/skills/2`
