---
trigger: always_on
---

# Regras do Projeto: Dashboard TomTicket MVP

## Tech Stack Obrigatória
- **Frontend:** Next.js 14+ (App Router), TypeScript.
- **UI:** Tailwind CSS + shadcn/ui + Chart.js (react-chartjs-2).
- **Estado/Dados:** Redux Toolkit + RTK Query (Obrigatório para cache).
- **Backend/Auth:** Next.js Route Handlers (Proxy) + Firebase Auth/Firestore.

## Diretrizes de Implementação
1. **Segurança de API:** Nunca faça chamadas diretas à API do TomTicket pelo client. Use sempre as Route Handlers (`/api/...`) como proxy para proteger o Token.
2. **Performance:** Implemente cache agressivo via RTK Query para evitar erro 429 (Rate Limit) do TomTicket.
3. **Persistência:** Salve preferências de filtros no Firestore, mas use `debounce` para evitar excesso de escritas no Firebase.
4. **Arquitetura:** Siga a estrutura de pastas: `components/ui`, `app/api`, `lib/`, `hooks/`.

## Padrão de Componentes

* Sempre usar function components com TypeScript.
* Props devem ser tipadas explicitamente.
* Nunca misturar lógica de negócio com UI.
* Componentes devem ser pequenos e reutilizáveis.

```tsx
type Props = {
  title: string;
};

export function Example({ title }: Props) {
  return <div>{title}</div>;
}
```

---

## Data Fetching

* Proibido usar `fetch` ou `axios` diretamente em componentes.
* Sempre usar RTK Query (`tomTicketApi`).
* Nunca usar `useEffect` para buscar dados.

---

## Estado

* Estado global: Redux Toolkit
* Estado remoto/cache: RTK Query
* Estado local: useState (somente UI)
* Nunca duplicar dados do RTK Query no Redux

---

## Integrações externas

* Toda chamada externa deve passar por:

  * Route Handler (`/api`)
  * Depois RTK Query
* Nunca acessar Firebase diretamente em components

---

## UX padrão

* Loading: usar skeleton (shadcn/ui)
* Erro: exibir fallback amigável
* Nunca deixar tela em branco



---

## Naming Convention

* Componentes: PascalCase (MetricCard.tsx)
* Hooks: useSomething.ts
* Utils: camelCase
* Tipos: PascalCase

---


## Estrutura do projeto

── public/                    # Estáticos (imagens, favicon)
│   ├── favicon.ico
│   └── images/                # logos, ícones etc.
│
├── src/
│   ├── app/                   # Tudo de rotas e páginas (App Router)
│   │   ├── api/               # Proxy para TomTicket (esconde token)
│   │   │   └── proxy-tomticket/
│   │   │       └── route.ts
│   │   ├── dashboard/         # Rotas do dashboard principal
│   │   │   ├── page.tsx       # /dashboard (overview)
│   │   │   └── layout.tsx     # Layout compartilhado do dashboard (sidebar, header)
│   │   ├── login/             # Página de login
│   │   │   └── page.tsx
│   │   ├── layout.tsx         # Root layout global (html, body, providers)
│   │   ├── page.tsx           # Landing ou redirect para login/dashboard
│   │   └── globals.css        # Tailwind + estilos globais
│   │
│   ├── components/            # Todos os componentes aqui (sem subpastas pesadas)
│   │   ├── ui/                # Primitivos reutilizáveis (simples)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── ... (só o que usar)
│   │   ├── dashboard/         # Específicos do dashboard
│   │   │   ├── MetricCard.tsx
│   │   │   ├── ChartWrapper.tsx
│   │   │   ├── FilterSelect.tsx
│   │   │   ├── OperatorTable.tsx
│   │   │   └── Sidebar.tsx    # Menu lateral
│   │   └── AuthProvider.tsx   # Provider para auth (Firebase/Redux)
│   │
│   ├── lib/                   # Lógica de negócio e configs (leve)
│   │   ├── firebase.ts        # Config client + auth helpers
│   │   ├── redux/             # Redux centralizado
│   │   │   ├── store.ts
│   │   │   ├── hooks.ts       # useAppDispatch, useAppSelector
│   │   │   └── slices/        # Slices separados
│   │   │       ├── authSlice.ts
│   │   │       ├── filtersSlice.ts
│   │   │       └── tomTicketApi.ts  # RTK Query para API calls
│   │   └── utils/             # Funções helpers
│   │       ├── formatters.ts  # moeda, datas, números
│   │       └── date.ts
│   │
│   ├── types/                 # Tipos globais (evita duplicação)
│   │   ├── index.ts
│   │   ├── tomTicket.ts       # Interfaces da API
│   │   └── dashboard.ts       # Tipos de métricas/layout
│   │
│   └── hooks/                 # Hooks custom (opcional, se precisar)
│       └── useAuth.ts


## Comportamento do Agent
- Sempre escreva código com Type Hints (TypeScript).
- Ao sugerir componentes, priorize os do shadcn/ui.
- Se eu pedir uma nova feature, verifique se ela impacta o Rate Limit da API antes de codar.