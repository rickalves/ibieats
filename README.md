# 💳 PayBite - Do pedido ao pagamento, sem complicação

**PayBite** é um **case de estudo técnico** que implementa um fluxo de **pedido e pagamento distribuído**, inspirado em arquiteturas usadas por empresas como no ramo de **FoodTech e Fintech**.

O projeto demonstra, de forma prática, como construir um sistema **orientado a eventos**, utilizando **microserviços**, **SAGA orquestrada**, **mensageria**, **idempotência** e **observabilidade**.

---

## 🎯 Objetivo do Projeto

Demonstrar domínio prático de:

* Arquitetura de **microserviços**
* Comunicação **event-driven**
* **Consistência eventual** com SAGA
* Tratamento de falhas em sistemas distribuídos
* Boas práticas com **NestJS + TypeScript**

> Este projeto **não é um MVP de produto**, mas sim um **case técnico focado em arquitetura e engenharia de software**.

---

## 🧠 Visão Geral da Arquitetura

O PayBite é composto por múltiplos serviços independentes, cada um com uma responsabilidade bem definida.

### Serviços

* **API Gateway (BFF)**
  Entrada única do sistema, autenticação e validação
* **Orders Service**
  Orquestra o fluxo do pedido (SAGA)
* **Inventory Service**
  Reserva e libera estoque
* **Payments Service**
  Processa pagamentos (simulado)
* **Notifications Service**
  Envia notificações ao usuário (mock)

### Comunicação

* **HTTP/REST**: Gateway → Orders
* **Eventos (RabbitMQ)**: Comunicação entre serviços internos

---

## 🔄 Fluxo do Pedido (Resumo)

1. Usuário cria um pedido via API Gateway
2. Orders Service cria o pedido (`CREATED`)
3. Inventory Service tenta reservar estoque

   * Se falhar → pedido é cancelado
4. Payments Service processa o pagamento

   * Se aprovado → pedido é confirmado
   * Se falhar → pedido é cancelado e estoque liberado
5. Notifications Service notifica o usuário

---

## 🧩 Padrões Arquiteturais Aplicados

* **SAGA Orquestrada** (Orders Service coordena o fluxo)
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
* **Swagger/OpenAPI**
* **Logs estruturados (JSON)**
* **Healthcheck (`/health`)**
* **Testes unitários e E2E**

---

## 📁 Estrutura do Repositório

```txt
paybite/
├─ apps/
│  ├─ api-gateway/
│  ├─ orders-service/
│  ├─ inventory-service/
│  ├─ payments-service/
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
* pnpm (opcional, para desenvolvimento local)

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

O projeto utiliza **JWT** para proteger os endpoints de pedido.

* Login simulado
* JWT enviado via `Authorization: Bearer <token>`
* `userId` propagado nos eventos

---

## 🧪 Testes

* **Unitários**: regras de negócio e handlers
* **E2E**: fluxo completo de pedido

  * pagamento aprovado
  * pagamento recusado

```bash
pnpm test
pnpm test:e2e
```

---

## 📊 Observabilidade

* Logs estruturados em JSON
* Todos os serviços utilizam `correlationId`
* Possível rastrear um pedido do início ao fim apenas pelos logs

Exemplo de log:

```json
{
  "service": "orders-service",
  "orderId": "123",
  "correlationId": "abc-xyz",
  "message": "Order confirmed successfully"
}
```

---

## 📌 Decisões Técnicas

### Por que RabbitMQ?

* Mais simples que Kafka para um case
* Muito usado em ambientes corporativos
* Facilita demonstração de retry e DLQ

### Por que SAGA Orquestrada?

* Fluxo mais fácil de explicar em entrevistas
* Centraliza regras de negócio críticas
* Evita acoplamento excessivo entre serviços
---
© 2026. Todos os direitos reservados.

PayBite é um projeto de estudo técnico, desenvolvido para fins educacionais e demonstração
de arquitetura de software. Não possui finalidade comercial.
