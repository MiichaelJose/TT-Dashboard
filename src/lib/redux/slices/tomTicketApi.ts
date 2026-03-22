import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Example interfaces (to be expanded later in types/)
export interface OverviewMetrics {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  avgResolutionTime: number; // in hours or minutes
}

export const tomTicketApi = createApi({
  reducerPath: 'tomTicketApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/proxy-tomticket',
  }),
  // RTK Query Caching behavior (600 seconds = 10 minutes cache to avoid TomTicket API rate limits 429)
  keepUnusedDataFor: 600, 
  endpoints: (builder) => ({
    getOverviewMetrics: builder.query<OverviewMetrics, void>({
      query: () => '/overview',
      // Keep cached data for 10 minutes
      keepUnusedDataFor: 600,
    }),
    // Other endpoints can be added here
  }),
});

export const { useGetOverviewMetricsQuery } = tomTicketApi;
