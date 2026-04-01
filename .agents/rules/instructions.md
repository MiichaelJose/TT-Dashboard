---
trigger: always_on
---

# Regras do Projeto: Padrões de Arquitetura e Desenvolvimento

---

## 🧱 Tech Stack Obrigatória

* **Frontend:** Next.js 14+ (App Router), TypeScript
* **UI:** Tailwind CSS + shadcn/ui + Chart.js (react-chartjs-2)
* **Estado/Dados:** Redux Toolkit + RTK Query
* **Backend/Auth:** Next.js Route Handlers + Firebase (Auth/Firestore)

---

## 🔐 Segurança de API

* ❌ Nunca chamar APIs externas diretamente no client
* ✅ Sempre usar `/api/...` (Route Handlers como proxy)
* ❌ Nunca expor tokens no frontend

---

## ⚡ Performance

* ✅ Uso obrigatório de cache com RTK Query
* ❌ Evitar múltiplas chamadas duplicadas
* ❌ Evitar reprocessamento de dados no frontend

---

## 🧠 Arquitetura (REGRA PRINCIPAL)

A aplicação deve seguir SEMPRE a separação de responsabilidades:

```txt
Data Source (API / Firebase)
        ↓
RTK Query (cache)
        ↓
Custom Hooks (orquestração)
        ↓
Services (regras de negócio / transformação)
        ↓
UI Components (renderização)
```

---

## 🚨 Regra Crítica: Separação de Responsabilidades

### ❌ PROIBIDO em Components:

* Receber dados brutos (ex: arrays de entidades como `Ticket[]`)
* Executar lógica de negócio
* Usar `.map`, `.filter`, `.reduce` para transformar dados
* Fazer cálculos (métricas, agregações, etc)

---

### ✅ OBRIGATÓRIO:

* Components devem receber dados PRONTOS
* Toda transformação deve ocorrer em:

```txt
/src/services/
```

---

## 📦 Services (Camada de Regras de Negócio)

### Responsabilidade:

* Transformar dados
* Calcular métricas
* Adaptar formatos para UI

### Exemplo:

```ts
export function buildOverviewMetrics(data: Ticket[]): OverviewMetrics {
  // lógica aqui
}
```

---

### Regras:

* ❌ Não usar React
* ❌ Não acessar DOM
* ❌ Não fazer chamadas HTTP
* ✅ Funções puras (pure functions)

---

## 🪝 Hooks (Orquestração)

Local:

```txt
/src/hooks/
```

### Responsabilidade:

* Consumir RTK Query
* Chamar services
* Preparar dados para UI

---

### Exemplo padrão:

```ts
export function useDashboardData(companyId: string) {
  const { data } = useGetTicketsQuery(companyId);

  const overview = useMemo(() => buildOverviewMetrics(data || []), [data]);

  return { overview };
}
```

---

## 🧩 Components (UI)

Local:

```txt
/src/components/
```

---

### Regras obrigatórias:

* ❌ Não acessar API
* ❌ Não usar lógica de negócio
* ❌ Não transformar dados
* ❌ Não receber entidades cruas (ex: `Ticket[]`)

---

### ✅ Props devem ser específicas e tipadas:

```ts
type Props = {
  data: OverviewMetrics;
};
```

---

### ❌ Errado:

```ts
type Props = {
  tickets: Ticket[];
};
```

---

## 📊 Tipagem (OBRIGATÓRIO)

Local:

```txt
/src/types/
```

---

### Regras:

* Tipos devem representar:

  * Entidades (API)
  * Modelos de UI (View Models)

---

### Exemplo:

```ts
// entidade (API)
export interface Ticket {}

// modelo para UI
export interface OverviewMetrics {
  total: number;
  open: number;
  closed: number;
}
```

---

## 🔄 Data Fetching

* ❌ Proibido usar `fetch` ou `axios` em components
* ❌ Proibido usar `useEffect` para buscar dados
* ✅ Usar RTK Query

---

## 🧠 Estado

* Global → Redux Toolkit
* Server/cache → RTK Query
* Local → useState (apenas UI)

---

## 🔌 Integrações Externas

Fluxo obrigatório:

```txt
External API → /api → RTK Query → Hook → Service → UI
```

---

## 🎨 UX Padrão

* Loading → Skeleton (shadcn/ui)
* Error → fallback amigável
* ❌ Nunca deixar tela em branco

---

## 📛 Naming Convention

* Components → PascalCase
* Hooks → useSomething
* Services → something.service.ts
* Types → PascalCase
* Utils → camelCase

---

## 🧱 Estrutura de Pastas (Padrão)

* `/app` → rotas
* `/components` → UI
* `/services` → regras de negócio
* `/hooks` → orquestração
* `/types` → tipagem global
* `/lib` → configs/shared
* `/store` → Redux

---

## 🚨 Regra de Ouro

Se qualquer componente:

* recebe dados brutos (ex: arrays da API)
* faz transformação de dados
* contém lógica de negócio

👉 Está ERRADO e deve ser refatorado.

---

## 🧠 Diretriz para IA (CRÍTICO)

Sempre que gerar código:

1. Criar tipos primeiro (`/types`)
2. Criar service se houver transformação
3. Criar hook para orquestração
4. Criar component apenas para UI

---

## 🚀 Arquitetura Evolutiva (Escala)

A aplicação deve permitir evolução para:

```txt
Backend (processamento)
        ↓
Firebase (dados prontos)
        ↓
Frontend (apenas renderização)
```

O frontend NÃO deve depender de processamento pesado no estado final.

---
