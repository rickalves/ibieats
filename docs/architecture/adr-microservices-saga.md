# ADR: Adoção de Arquitetura em Microserviços com Padrão SAGA Orquestrado

## Status
Aceito

## Data
20 de janeiro de 2026

## Contexto
O sistema IBiEats é uma plataforma de entrega de comida que envolve múltiplos domínios de negócio, incluindo pedidos (orders), pagamentos (payments), entrega (delivery), notificações (notifications) e um gateway de API (api-gateway). Inicialmente, o sistema foi concebido como uma aplicação monolítica, mas com o crescimento da base de usuários e a necessidade de escalabilidade, independência de equipes e flexibilidade tecnológica, foi decidido migrar para uma arquitetura de microserviços.

A arquitetura monolítica apresentava desafios como:
- Dificuldade em escalar componentes específicos sem afetar o sistema inteiro.
- Dependências fortes entre módulos, levando a deployments complexos e riscos de falhas em cascata.
- Limitações na adoção de tecnologias diferentes para diferentes partes do sistema.
- Manutenção e evolução do código se tornavam mais complexas com o aumento do tamanho da base de código.

Para gerenciar transações distribuídas entre microserviços, especialmente em cenários como processamento de pedidos que envolvem pagamentos, entregas e notificações, é necessário um padrão para garantir consistência eventual e lidar com compensações em caso de falhas.

## Decisão
Adotamos uma arquitetura baseada em microserviços, onde cada domínio de negócio (orders, payments, delivery, notifications) é implementado como um serviço independente. Para coordenar transações distribuídas, utilizamos o padrão SAGA orquestrado, com um orquestrador central (possivelmente no serviço de orders ou um serviço dedicado) gerenciando o fluxo de execução e compensações.

### Justificativa para Microserviços
- **Escalabilidade Independente**: Cada microserviço pode ser escalado horizontalmente conforme a demanda específica do domínio, otimizando recursos e custos.
- **Independência de Deployments**: Equipes podem desenvolver, testar e implantar serviços de forma independente, reduzindo riscos e acelerando ciclos de release.
- **Flexibilidade Tecnológica**: Permite o uso de linguagens, frameworks e bancos de dados adequados para cada domínio (ex.: NestJS para APIs, diferentes bancos para persistência).
- **Manutenibilidade**: Código mais modular, facilitando testes, debugging e evolução.
- **Resiliência**: Falhas em um serviço não derrubam o sistema inteiro, permitindo isolamento de erros.

### Justificativa para SAGA Orquestrado
- **Consistência Eventual**: Em sistemas distribuídos, garante que transações complexas (ex.: pedido → pagamento → entrega) sejam executadas de forma consistente, com compensações automáticas em caso de falha.
- **Orquestração Centralizada**: Um orquestrador simplifica a lógica de coordenação, tornando o fluxo mais previsível e fácil de monitorar, comparado ao coreografia onde cada serviço gerencia seu próprio estado.
- **Adequação ao Domínio**: Para um sistema de e-commerce como iBeats, onde pedidos envolvem múltiplas etapas sequenciais, o SAGA orquestrado evita locks distribuídos e permite rollback granular.
- **Integração com Mensageria**: Utiliza um barramento de mensagens (ex.: RabbitMQ ou similar) para comunicação assíncrona, alinhando com a arquitetura de microserviços.

## Alternativas Consideradas
1. **Arquitetura Monolítica**: Rejeitada devido aos desafios de escalabilidade e manutenção mencionados no contexto.
2. **Microserviços com SAGA Coreografado**: Considerado, mas rejeitado porque a coreografia aumenta a complexidade de debugging e monitoramento, já que a lógica está distribuída entre serviços.
3. **Transações Distribuídas com Two-Phase Commit (2PC)**: Rejeitada por causar locks distribuídos, reduzindo disponibilidade e performance em sistemas de alta carga.
4. **Event Sourcing + CQRS**: Avaliado como complemento futuro, mas não substitui o SAGA para transações síncronas imediatas.

## Consequências
### Positivas
- Melhor escalabilidade e resiliência do sistema.
- Desenvolvimento mais ágil e paralelo entre equipes.
- Facilita a adoção de DevOps e CI/CD por serviço.
- Consistência garantida em transações distribuídas, melhorando a experiência do usuário (ex.: pedidos não ficam em estados inconsistentes).

### Negativas
- Complexidade operacional: Gerenciamento de múltiplos serviços, deployments, monitoramento e logging distribuído.
- Latência: Comunicação assíncrona pode introduzir delays, embora mitigada por orquestração eficiente.
- Custos de Infraestrutura: Mais recursos para rede, mensageria e orquestração.
- Debugging: Rastreamento de transações distribuídas requer ferramentas como distributed tracing (ex.: Jaeger).

### Riscos
- Acoplamento Acidental: Mesmo com microserviços, evitar dependências ocultas através de contratos bem definidos.
- Falhas de Compensação: Garantir que operações de rollback sejam implementadas corretamente em cada serviço.

## Implementação
- Cada microserviço é um app NestJS independente no monorepo.
- Orquestrador implementado no serviço de orders, utilizando uma biblioteca como @nestjs/cqrs para eventos.
- Diagrama de sequência SAGA disponível em docs/flows/saga-sequence.mmd.
- Monitoramento com ferramentas como Prometheus e Grafana para observar métricas de transações.

## Referências
- Documentação de Arquitetura: docs/architecture/architecture.md
- Diagramas C4: docs/architecture/c4*.mmd
- Padrão SAGA: https://microservices.io/patterns/data/saga.html