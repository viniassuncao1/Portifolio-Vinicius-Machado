# Spec Delta

## ADDED Requirements

### Requirement: Próximo arquivo
O fim do editor de cada seção SHALL ter o link `Próximo: <arquivo> →` para a seção seguinte na
ordem da árvore; a última seção MUST NOT ter o link.

#### Scenario: Depois de Sobre Mim
- **WHEN** o visitante chega ao fim de "Sobre Mim" e ativa o próximo arquivo
- **THEN** a seção seguinte da árvore abre
