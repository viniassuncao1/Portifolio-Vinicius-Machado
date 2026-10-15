# Spec Delta

## ADDED Requirements

### Requirement: Seções fáceis de achar no celular
No celular, o botão que abre a árvore SHALL ter o texto visível "Seções" e as pastas da gaveta
SHALL começar abertas.

#### Scenario: Abrir a gaveta
- **WHEN** o visitante ativa "Seções" numa tela de 390x844
- **THEN** a gaveta abre com todas as pastas abertas

### Requirement: Decorativos discretos
Os ícones decorativos da barra superior SHALL ficar mais apagados que os botões reais e MUST NOT
ter efeito de hover.

#### Scenario: Passar o mouse num ícone decorativo
- **WHEN** o visitante passa o mouse num ícone decorativo da barra
- **THEN** nada muda no ícone
