import { useMemo } from 'react';
import { useGetMetricsQuery, useGetTicketsQuery } from '@/lib/redux/slices/tomTicketApi';
import { buildDashboardMetrics } from '@/services/metrics.service';
import { DashboardMetrics } from '@/types/dashboard';

export function useDashboardData(companyId: string) {
  // Chamada teórica para a futura rota Server-Side de métricas
  const { 
    data: metricsData, 
    isLoading: isLoadingMetrics, 
    isError: isMetricsError 
  } = useGetMetricsQuery(companyId, { skip: !companyId });

  // Chamada de Fallback puxando array de `tickets` brutos
  // Só realiza a chamada se houver erro ao puxar metrics ou se estiver vazio.
  const shouldFallback = !metricsData || isMetricsError;
  const { 
    data: ticketsData, 
    isLoading: isLoadingTickets 
  } = useGetTicketsQuery(companyId, { skip: !companyId || !shouldFallback });

  const loading = isLoadingMetrics || (shouldFallback && isLoadingTickets);

  // Computa as métricas localmente caso fallback seja necessário
  // Memoizado para evitar lentidão em re-renders
  const finalMetrics: DashboardMetrics | null = useMemo(() => {
    if (metricsData) return metricsData;
    if (ticketsData) return buildDashboardMetrics(ticketsData);
    return null;
  }, [metricsData, ticketsData]);

  return {
    metrics: finalMetrics,
    loading,
    usingFallback: shouldFallback && !!ticketsData,
  };
}
