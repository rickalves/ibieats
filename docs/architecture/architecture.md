# 🏗️ Arquitetura do IbiEats

Este documento descreve a **arquitetura do IbiEats**, um **case de estudo técnico** focado em **sistemas distribuídos**, inspirado em plataformas modernas de **FoodTech**.

O objetivo é demonstrar **decisões arquiteturais reais**, trade-offs e aplicação prática de padrões utilizados em sistemas de grande escala.

---

## 🎯 Visão Geral

O **IbiEats** é construído seguindo os princípios de:

* **Microserviços**
* **Arquitetura Orientada a Eventos (EDA)**
* **SAGA Orquestrada**
* **Consistência Eventual**
* **Baixo acoplamento**
* **Alta observabilidade**

Cada serviço possui **responsabilidade única**, **banco de dados próprio** e se comunica de forma **assíncrona sempre que possível**.

---

## 🧩 Visão de Alto Nível

```text
Cliente
   |
   v
API Gateway (BFF)
   |
   v
Orders Service (SAGA Orchestrator)
   |
   +--> Inventory Service
   |
   +--> Payments Service
   |
   +--> Delivery Service
   |
   +--> Notifications Service
```

---

## 🧠 Estilo Arquitetural

### Microserviços

* Cada serviço:

  * É independente
  * Possui seu próprio banco de dados
  * Pode ser escalado separadamente
* Não há compartilhamento direto de banco entre serviços

---

### Event-Driven Architecture (EDA)

* Serviços **não se comunicam diretamente entre si**
* A comunicação ocorre por **eventos** via **RabbitMQ**
* Eventos representam **fatos do domínio**, não comandos

Exemplos:

* `order.created`
* `inventory.reserved`
* `payment.approved`
* `delivery.completed`

---

## 🔄 SAGA Orquestrada

O **Orders Service** atua como **orquestrador da SAGA**, sendo responsável por:

* Controlar o estado do pedido
* Emitir eventos de avanço
* Executar compensações em caso de falha

### Por que SAGA Orquestrada?

* Mais simples de entender e explicar
* Ideal para **cases de estudo e entrevistas**
* Centraliza regras críticas de negócio
* Facilita rastreabilidade do fluxo

---

## 🔁 Fluxo Completo do Pedido

### 1️⃣ Criação do Pedido

* Cliente faz requisição via **API Gateway**
* Gateway valida JWT e encaminha para Orders

```text
POST /orders
```

Orders:

* Cria pedido com status `CREATED`
* Emite evento `order.created`

---

### 2️⃣ Reserva de Itens (Inventory)

Inventory Service:

* Consome `order.created`
* Tenta reservar os itens

#### Sucesso:

* Emite `inventory.reserved`

#### Falha:

* Emite `inventory.failed`

Orders reage:

* Falha → cancela pedido

---

### 3️⃣ Pagamento

Payments Service:

* Consome `inventory.reserved`
* Processa pagamento (simulado)

#### Sucesso:

* Emite `payment.approved`

#### Falha:

* Emite `payment.failed`

Orders reage:

* Falha → cancela pedido + libera estoque

---

### 4️⃣ Entrega

Delivery Service:

* Consome `payment.approved`
* Cria entrega
* Atualiza status:

  * `WAITING_DRIVER`
  * `ON_THE_WAY`
  * `DELIVERED`

Emite eventos de progresso:

* `delivery.started`
* `delivery.completed`

Orders:

* Marca pedido como `DELIVERED`

---

### 5️⃣ Notificações

Notifications Service:

* Consome eventos relevantes
* Envia notificações (mock)

---

## 🛵 Delivery Service (Detalhamento)

O **Delivery Service** é isolado para refletir arquiteturas reais de apps de delivery.

Responsabilidades:

* Criar entregas
* Atribuir entregador (mock)
* Atualizar status
* Emitir eventos de progresso

Benefícios:

* Evita acoplamento com Orders
* Permite evolução futura:

  * Roteirização
  * ETA
  * Entregadores reais
  * Geolocalização

---

## 🔐 Autenticação e Segurança

* Autenticação via **JWT**
* API Gateway valida o token
* `userId` é propagado nos eventos
* Serviços internos **não validam JWT**, apenas confiam no contexto

---

## 📊 Observabilidade

### Correlation ID

* Cada requisição recebe um `correlationId`
* O ID é propagado:

  * HTTP headers
  * Eventos
  * Logs

Isso permite:

* Rastrear um pedido ponta a ponta
* Debug rápido em sistemas distribuídos

---

### Logs Estruturados

Formato JSON padronizado:

```json
{
  "service": "orders-service",
  "orderId": "123",
  "correlationId": "abc-xyz",
  "message": "Order confirmed"
}
```

---

## ♻️ Confiabilidade

### Idempotência

* Consumidores de eventos são idempotentes
* Um evento processado duas vezes **não gera efeitos colaterais**

---

### Retry e DLQ

* Falhas temporárias → retry com backoff
* Falhas permanentes → **Dead Letter Queue**
* Evita travamento do fluxo principal

---

## 🗄️ Banco de Dados

* **Banco por serviço**
* Nenhum serviço acessa banco de outro
* Consistência eventual entre dados

Exemplo:

* Orders DB → pedidos
* Payments DB → transações
* Delivery DB → entregas

---

## 🧪 Testabilidade

* Testes unitários:

  * Regras de negócio
  * Handlers
  * Orquestração da SAGA

* Testes E2E:

  * Fluxo completo do pedido
  * Pagamento aprovado
  * Pagamento recusado

---

## 📌 Trade-offs Assumidos

| Decisão            | Motivo                           |
| ------------------ | -------------------------------- |
| RabbitMQ           | Simplicidade e clareza didática  |
| SAGA Orquestrada   | Mais explicável em entrevistas   |
| Pagamento simulado | Foco em arquitetura              |
| Delivery mock      | Evita complexidade desnecessária |

---

## 🧠 Conclusão

O **IbiEats** demonstra como arquiteturas modernas de **apps de delivery** podem ser construídas de forma **escalável, resiliente e observável**, mesmo em um contexto regional.

Este projeto prioriza:

* Clareza arquitetural
* Boas práticas
* Decisões justificadas
* Valor educacional e profissional

---
