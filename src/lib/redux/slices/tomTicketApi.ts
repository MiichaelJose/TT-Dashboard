import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { auth } from '@/lib/firebase';
import { Ticket, SyncResponse } from '@/types/tomTicket';

// Configurando BaseQuery com interceptador de token JWT
const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: async (headers) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const tomTicketApi = createApi({
  reducerPath: 'tomTicketApi',
  baseQuery,
  tagTypes: ['Tickets'],
  endpoints: (builder) => ({
    // Rota GET /api/tickets
    getTickets: builder.query<Ticket[], string>({
      query: (companyId) => `/tickets?companyId=${companyId}`,
      providesTags: ['Tickets'],
      keepUnusedDataFor: 600, // 10 minutes cache
    }),
    
    // Rota POST /api/sync
    triggerSync: builder.mutation<SyncResponse, string>({
      query: (companyId) => ({
        url: '/sync',
        method: 'POST',
        body: { companyId },
      }),
      // Quando finaliza o Sync com sucesso, invalida os tickets forçando re-fetch
      invalidatesTags: (result) => {
        if (result?.status === 'synced') {
          return ['Tickets'];
        }
        return [];
      },
    }),
  }),
});

export const { useGetTicketsQuery, useTriggerSyncMutation } = tomTicketApi;

