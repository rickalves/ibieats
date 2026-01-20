# ADR: Escolha do RabbitMQ como Event Broker para o IbiEats

## Status
Aceito

## Data
20 de janeiro de 2026

## Contexto
O sistema IbiEats adota uma arquitetura de microserviços, onde a comunicação assíncrona entre serviços é essencial para garantir desacoplamento, escalabilidade e resiliência. Em cenários como processamento de pedidos (orders), que envolvem notificações para pagamentos, entregas e usuários, é necessário um event broker confiável para publicar e consumir eventos de forma eficiente.

Inicialmente, o sistema utilizava comunicação síncrona via HTTP, mas isso introduzia dependências diretas, latência e riscos de falhas em cascata. Com a migração para microserviços e o padrão SAGA orquestrado, a necessidade de um barramento de mensagens assíncronas se tornou crítica para:
- Publicar eventos como "PedidoCriado", "PagamentoAprovado", etc.
- Consumir eventos de forma desacoplada, permitindo retries e dead-letter queues.
- Suportar alta disponibilidade e processamento distribuído.

## Decisão
Adotamos o RabbitMQ como event broker principal para o IbiEats. Ele será integrado aos microserviços via bibliotecas como @nestjs/microservices no NestJS, utilizando protocolos AMQP para troca de mensagens.

### Justificativa
- **Robustez e Confiabilidade**: RabbitMQ oferece garantias de entrega de mensagens (at-least-once), com suporte a acknowledgments, dead-letter exchanges e retries automáticos, essenciais para transações críticas como pagamentos.
- **Flexibilidade de Roteamento**: Exchanges (direct, topic, headers, fanout) permitem roteamento avançado de eventos, facilitando padrões como pub/sub e work queues.
- **Durabilidade e Persistência**: Mensagens podem ser persistidas em disco, garantindo sobrevivência a reinicializações do broker.
- **Escalabilidade**: Suporta clustering e load balancing, permitindo crescimento horizontal conforme a demanda.
- **Integração com NestJS**: Compatível com o ecossistema NestJS, facilitando implementação via módulos como ClientProxy.
- **Comunidade e Suporte**: Ampla adoção em projetos similares, com documentação rica e plugins para monitoramento (ex.: RabbitMQ Management Plugin).
- **Adequação ao Domínio**: Para um sistema de e-commerce como IbiEats, onde eventos precisam ser processados de forma ordenada e confiável, RabbitMQ supera alternativas mais simples em cenários de alta carga.

## Alternativas Consideradas
1. **Apache Kafka**: Rejeitado por ser mais adequado para streaming de alto volume e logs, com complexidade maior para cenários de mensagens ponto-a-ponto. Kafka não oferece roteamento nativo como exchanges, e sua configuração é mais pesada para microserviços leves.
2. **Redis Pub/Sub**: Considerado por simplicidade, mas rejeitado devido à falta de persistência nativa (mensagens são voláteis) e limitações em garantias de entrega, tornando-o inadequado para transações críticas.
3. **AWS SQS ou Google Pub/Sub**: Serviços gerenciados na nuvem, rejeitados por lock-in a provedores específicos e custos variáveis, além de menor controle sobre infraestrutura on-premise ou híbrida.
4. **NATS**: Avaliado por performance, mas rejeitado por menor maturidade em roteamento avançado e suporte a durabilidade comparado ao RabbitMQ.

## Consequências
### Positivas
- Comunicação assíncrona eficiente, reduzindo latência e acoplamento entre serviços.
- Melhor resiliência: Serviços podem falhar independentemente sem impactar o fluxo geral.
- Facilita implementação do SAGA orquestrado, com eventos para coordenar compensações.
- Monitoramento integrado via dashboard do RabbitMQ para observar filas e taxas de processamento.

### Negativas
- Complexidade Operacional: Requer configuração e manutenção de clusters RabbitMQ, incluindo backup e failover.
- Overhead de Infraestrutura: Adiciona dependência externa, necessitando de recursos para HA (ex.: mirrored queues).
- Curva de Aprendizado: Equipes precisam dominar conceitos AMQP, embora bibliotecas NestJS abstraiam boa parte.
- Custos: Licença comercial para versões enterprise, embora a open-source seja suficiente para muitos casos.

### Riscos
- Single Point of Failure: Mitigado com clustering e replicação.
- Acúmulo de Mensagens: Monitorar dead-letter queues para evitar congestionamento.
- Evolução: Garantir versionamento de eventos para compatibilidade futura.

## Implementação
- RabbitMQ será implantado via Docker Compose (infra/compose.yaml), com configuração de vhosts e usuários dedicados.
- Integração nos microserviços usando @nestjs/microservices, com exchanges para eventos de domínio.
- Monitoramento com Prometheus e Grafana para métricas de mensagens.
- Testes com bibliotecas como amqplib para simulação de cenários.

## Referências
- Documentação RabbitMQ: https://www.rabbitmq.com/
- Padrão SAGA: docs/architecture/adr-microservices-saga.md
- Arquitetura Geral: docs/architecture/architecture.md