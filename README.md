# 🍔 IbiEats — Do pedido à entrega, com arquitetura de verdade

**IbiEats** é um **case de estudo técnico** que implementa um fluxo distribuído de **pedido, pagamento e entrega**, inspirado em arquiteturas utilizadas por grandes plataformas de **FoodTech**, mas com identidade e contexto da **Serra da Ibiapaba**.

O projeto demonstra, de forma prática, como construir um sistema moderno baseado em **microserviços**, **arquitetura orientada a eventos**, **SAGA orquestrada**, **mensageria**, **idempotência** e **observabilidade**, aplicando boas práticas de engenharia de software.

> 📍 *Arquitetura pensada para a Ibiapaba. Engenharia no nível das grandes.*

---

## 🎯 Objetivo do Projeto

Demonstrar domínio prático de:

* Arquitetura de **microserviços**
* Comunicação **event-driven**
* **Consistência eventual** com SAGA
* Tratamento de falhas em sistemas distribuídos
* Boas práticas com **NestJS + TypeScript**
* Modelagem de sistemas inspirados em **apps de delivery**

> ⚠️ Este projeto **não é um MVP comercial**, mas sim um **case técnico focado em arquitetura, engenharia e tomada de decisão técnica**, ideal para estudo, portfólio e entrevistas.

---

## 🧠 Visão Geral da Arquitetura

O **IbiEats** é composto por múltiplos serviços independentes, cada um com responsabilidade única, simulando o funcionamento interno de um app de delivery real.

### Serviços

* **API Gateway (BFF)**
  Entrada única do sistema, autenticação, validação e exposição da API

* **Orders Service**
  Orquestra o fluxo do pedido (**SAGA**)

* **Inventory Service**
  Reserva e libera itens do pedido (simulando estoque/cardápio)

* **Payments Service**
  Processa pagamentos (simulado, com aprovação/recusa)

* **Delivery Service** 🛵
  Responsável pela **gestão da entrega**, incluindo:

  * Criação da entrega após pedido confirmado
  * Atribuição de entregador (simulado)
  * Atualização de status (`WAITING_DRIVER`, `ON_THE_WAY`, `DELIVERED`)
  * Emissão de eventos de progresso da entrega

* **Notifications Service**
  Envia notificações ao usuário (mock)

---

### Comunicação

* **HTTP/REST**
  API Gateway → Orders Service

* **Eventos (RabbitMQ)**
  Comunicação assíncrona entre os serviços internos:

  * Pedido criado
  * Pagamento aprovado/recusado
  * Entrega iniciada/finalizada

---

## 🔄 Fluxo do Pedido e Entrega (Resumo)

1. Usuário cria um pedido via **API Gateway**
2. **Orders Service** cria o pedido (`CREATED`)
3. **Inventory Service** tenta reservar os itens

   * Se falhar → pedido é cancelado
4. **Payments Service** processa o pagamento

   * Se recusado → pedido cancelado e estoque liberado
   * Se aprovado → pedido confirmado
5. **Delivery Service** cria a entrega

   * Pedido entra em status `OUT_FOR_DELIVERY`
   * Entregador é atribuído (mock)
6. **Delivery Service** atualiza o status da entrega

   * `ON_THE_WAY`
   * `DELIVERED`
7. **Orders Service** recebe evento de entrega concluída
8. **Notifications Service** notifica o usuário em cada etapa

---

## 🧩 Padrões Arquiteturais Aplicados

* **SAGA Orquestrada** (Orders Service coordena pedido + pagamento + entrega)
* **Event-driven Architecture**
* **Idempotência** em consumidores de eventos
* **Retry com backoff**
* **Dead Letter Queue (DLQ)**
* **Correlation ID** ponta a ponta
* **Banco de dados por serviço**

---

## 🛠️ Tecnologias Utilizadas

### Backend

* **NestJS**
* **TypeScript**
* **PostgreSQL**
* **RabbitMQ**

### Infraestrutura

* **Docker**
* **Docker Compose**

### Qualidade e Observabilidade

* **JWT** para autenticação
* **Swagger / OpenAPI**
* **Logs estruturados (JSON)**
* **Healthcheck (`/health`)**
* **Testes unitários e E2E**

---

## 📁 Estrutura do Repositório

```txt
ibieats/
├─ apps/
│  ├─ api-gateway/
│  ├─ orders-service/
│  ├─ inventory-service/
│  ├─ payments-service/
│  ├─ delivery-service/
│  └─ notifications-service/
│
├─ libs/
│  ├─ common/
│  ├─ messaging/
│  ├─ logger/
│  ├─ config/
│
├─ infra/
│  └─ compose.yml
│
├─ docs/
│  └─ architecture.md
│
├─ .env.example
└─ README.md
```

---

## ▶️ Como Executar o Projeto

### Pré-requisitos

* Docker
* Docker Compose
* Node.js 18+
* pnpm (opcional)

### Subindo a stack completa

```bash
docker compose up --build
```

Após a inicialização:

* API Gateway: `http://localhost:3000`
* Swagger: `http://localhost:3000/docs`
* RabbitMQ UI: `http://localhost:15672`

---

## 🔐 Autenticação

* JWT para proteger endpoints
* Login simulado
* `userId` propagado nos eventos de pedido e entrega

---

## 🧪 Testes

* **Unitários**

  * Regras de negócio
  * Handlers de eventos
  * Idempotência

* **E2E**

  * Pedido completo com entrega
  * Pagamento aprovado
  * Pagamento recusado

```bash
pnpm test
pnpm test:e2e
```

---

## 📊 Observabilidade

* Logs estruturados em JSON
* Uso consistente de `correlationId`
* Rastreabilidade completa do pedido até a entrega

Exemplo:

```json
{
  "service": "delivery-service",
  "orderId": "789",
  "correlationId": "corr-456",
  "message": "Delivery completed successfully"
}
```

---

## 📌 Decisões Técnicas

### Por que um Delivery Service separado?

* Reflete arquitetura real de apps de delivery
* Evita acoplamento com Orders
* Facilita escalabilidade e regras próprias
* Permite futura evolução (roteirização, ETA, entregadores reais)

### Por que SAGA Orquestrada?

* Mais didática para estudo e entrevistas
* Centraliza regras críticas
* Facilita rollback de pagamento e entrega

---

## 🌱 Contexto Regional

Embora seja um **case técnico**, o IbiEats é inspirado em um cenário real de **delivery regional**, valorizando o comércio local da **Serra da Ibiapaba** e demonstrando como arquiteturas modernas podem ser aplicadas fora dos grandes centros.

---

© 2026. Todos os direitos reservados.

**IbiEats** é um projeto de estudo técnico, desenvolvido para fins educacionais e demonstração de arquitetura de software.
Não possui finalidade comercial.

---
