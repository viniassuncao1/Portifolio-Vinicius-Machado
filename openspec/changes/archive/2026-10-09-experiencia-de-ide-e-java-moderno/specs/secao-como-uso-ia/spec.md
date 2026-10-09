# Spec Delta

## ADDED Requirements

### Requirement: Uso de IA em Java moderno
A rota `/como-uso-ia` SHALL mostrar em Java moderno que IA não é modismo e é parte do trabalho,
e o texto da tela 04: agentes de IA na Watts Company (como a Ana, que atende pacientes de uma
clínica pelo WhatsApp) e o uso de Claude Code e Codex com SDD (Spec-Driven Development).

#### Scenario: Abertura da seção
- **WHEN** o visitante abre a seção "Como uso a IA"
- **THEN** o editor mostra essas informações em Java moderno

## REMOVED Requirements

### Requirement: Código da tela 04
**Reason**: O código exato das telas deu lugar a Java moderno (ADR-0010); as informações são
preservadas.
**Migration**: Usar o requisito "Uso de IA em Java moderno" e a capacidade `conteudo-em-java-moderno`.

### Requirement: Parágrafo sobre IA
**Reason**: O código exato das telas deu lugar a Java moderno (ADR-0010); as informações são
preservadas.
**Migration**: Usar o requisito "Uso de IA em Java moderno" e a capacidade `conteudo-em-java-moderno`.
