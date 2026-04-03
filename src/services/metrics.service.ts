import { Ticket } from "@/types/tomTicket";
import { 
  BarChartData, 
  DashboardDetails, 
  PieChartData, 
  RankingData, 
  TimeSeriesData 
} from "@/types/dashboard";

/**
 * Funções puras para processamento e redução de array de tickets
 * Roda EXCLUSIVAMENTE no backend (Node via API Route)
 */

export function buildTimeSeriesMetrics(tickets: Ticket[]): TimeSeriesData {
  const group: Record<string, { open: number; closed: number }> = {};

  tickets.forEach((t) => {
    const date = new Date(t.created_at);
    const monthStr = date.toLocaleString('pt-BR', { month: 'short' });
    const yearStr = date.toLocaleString('pt-BR', { year: '2-digit' });
    const label = `${monthStr.charAt(0).toUpperCase() + monthStr.slice(1)}/${yearStr}`;

    if (!group[label]) group[label] = { open: 0, closed: 0 };

    const isClosed = String(t.status || '').toLowerCase().includes('fechado');
    if (isClosed) group[label].closed += 1;
    else group[label].open += 1;
  });

  const sortedLabels = Object.keys(group).sort((a,b) => a.localeCompare(b));

  return sortedLabels.map(label => ({
    period: label,
    opened: group[label].open,
    closed: group[label].closed
  }));
}

export function buildCategoryMetrics(tickets: Ticket[], filterStatus?: 'open' | 'closed'): BarChartData {
  const group: Record<string, number> = {};
  
  let validTickets = tickets;
  if (filterStatus === 'open') {
    validTickets = tickets.filter(t => !String(t.status || '').toLowerCase().includes('fechado'));
  } else if (filterStatus === 'closed') {
    validTickets = tickets.filter(t => String(t.status || '').toLowerCase().includes('fechado'));
  }

  validTickets.forEach(t => {
    const cat = t.category || "Sem Categoria";
    group[cat] = (group[cat] || 0) + 1;
  });

  const sortedCategories = Object.keys(group).sort((a, b) => group[b] - group[a]).slice(0, 10);

  return sortedCategories.map(cat => ({
    label: cat,
    value: group[cat]
  }));
}

export function buildPieChartMetrics(tickets: Ticket[]): PieChartData {
  const group: Record<string, number> = {};
  
  tickets.forEach(t => {
    const dept = t.department || "Sem Departamento";
    group[dept] = (group[dept] || 0) + 1;
  });

  return Object.keys(group).map(dept => ({
    name: dept,
    value: group[dept]
  }));
}

export function buildRankingMetrics(tickets: Ticket[]): RankingData {
  const group: Record<string, number> = {};
    
  tickets.forEach(t => {
    const customer = t.customer_name || "Sem Nome";
    group[customer] = (group[customer] || 0) + 1;
  });

  const sortedCustomers = Object.keys(group).sort((a, b) => group[b] - group[a]).slice(0, 10);

  return sortedCustomers.map(customer => ({
    name: customer,
    total: group[customer]
  }));
}

export function buildDashboardDetails(tickets: Ticket[], period: string = "current"): DashboardDetails {
  const total = tickets.length;
  const closed = tickets.filter(t => String(t.status || '').toLowerCase().includes('fechado')).length;
  const open = total - closed;
  const closureRate = total > 0 ? Number(((closed / total) * 100).toFixed(1)) : 0;

  return {
    summary: {
      totalTickets: total,
      totalClosed: closed,
      totalOpen: open,
      closureRate,
    },
    sla: {
      attendedPercentage: 76.8, // Fallback p/ demo
      overduePercentage: 23.2,
    },
    time: {
      tme: "02:45:12",
      tma: "01:53:09",
    },
    csat: {
      score: 91.7,
      target: 95.0,
      status: 91.7 >= 95.0 ? "ok" : "below",
    },
    charts: {
      timeSeries: buildTimeSeriesMetrics(tickets),
      categories: {
        open: buildCategoryMetrics(tickets, 'open'),
        all: buildCategoryMetrics(tickets),
      },
      distribution: buildPieChartMetrics(tickets),
      ranking: buildRankingMetrics(tickets),
    },
    meta: {
      generatedAt: Date.now(),
      period: period,
    }
  };
}
