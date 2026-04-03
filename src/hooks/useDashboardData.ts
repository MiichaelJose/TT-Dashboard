import { useEffect, useState } from 'react';
import { useGetMetricsQuery, useTriggerSyncMutation } from '@/lib/redux/slices/tomTicketApi';

export function useDashboardData(companyId: string, period: string = 'current') {
  const { 
    data: details, 
    isLoading: isFetching, 
    isError,
    isUninitialized,
    refetch
  } = useGetMetricsQuery({ companyId, period }, { skip: !companyId });

  const [triggerSync, { isLoading: isSyncing }] = useTriggerSyncMutation();
  const [hasAttemptedFallback, setHasAttemptedFallback] = useState(false);

  // Fallback puro: caso a API de métricas não encontre dados no banco (ex: primeira vez),
  // dispara um Sync forçado e depois refaz a solicitação getMetrics.
  const isMissing = !details && !isFetching && !isUninitialized && !isError;
  const shouldFallback = isMissing && !hasAttemptedFallback;

  useEffect(() => {
    if (companyId && shouldFallback) {
      setHasAttemptedFallback(true);
      triggerSync(companyId)
        .unwrap()
        .then(() => refetch()) // Após sincronizar e salvar, refetch puxa os dados do banco
        .catch(console.error);
    }
  }, [companyId, shouldFallback, triggerSync, refetch]);

  const loading = isFetching || isSyncing || (isMissing && !hasAttemptedFallback);

  return {
    details: details || null,
    loading,
    isError,
  };
}
