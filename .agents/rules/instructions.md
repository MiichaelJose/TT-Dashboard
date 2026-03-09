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

## Comportamento do Agent
- Sempre escreva código com Type Hints (TypeScript).
- Ao sugerir componentes, priorize os do shadcn/ui.
- Se eu pedir uma nova feature, verifique se ela impacta o Rate Limit da API antes de codar.