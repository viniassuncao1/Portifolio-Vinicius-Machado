# Spec Delta

## MODIFIED Requirements

### Requirement: Apresentação em Java moderno
A rota `/sobre-mim` SHALL apresentar o Vinicius em Java moderno, com um resumo de quatro frases
nesta ordem: (1) a stack, Java 21 e Spring Boot no back-end e Angular no front-end, com cerca de
2 anos em sistemas de produção sobre Oracle, PostgreSQL e MySQL; (2) a efetivação de estágio para
Desenvolvedor Full Stack na Memora, com APIs REST em microsserviços e a liderança de squad no
Scrum; (3) a Watts Company, que ele co-fundou, com agentes de IA e CRM, e o uso de Claude Code
com SDD; (4) o curso de Ciência da Computação no UniCEUB, com foco em Engenharia de Software,
Sistemas Distribuídos e Arquitetura de Software.

#### Scenario: Abertura da seção
- **WHEN** o visitante abre a seção "Sobre Mim"
- **THEN** o resumo começa pela stack Java e Spring Boot e cita a Memora, a Watts Company e o
  UniCEUB, nessa ordem
