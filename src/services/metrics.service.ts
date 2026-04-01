import { Ticket } from "@/types/tomTicket";
import { 
  BarChartData, 
  DashboardMetrics, 
  OverviewMetrics, 
  PieChartData, 
  RankingData, 
  TimeSeriesData 
} from "@/types/dashboard";

/**
 * Funções puras para processamento e redução de array de tickets
 * Pode rodar no Next API Route ou no Browser.
 */

export function buildOverviewMetrics(tickets: Ticket[]): OverviewMetrics {
  const total = tickets.length;
  const closed = tickets.filter(t => (t.status || '').toLowerCase().includes('fechado')).length;
  const open = total - closed;
  
  // Mock fallback logic or actual SLA logic later
  const closureRate = total > 0 ? Number(((closed / total) * 100).toFixed(1)) : 0;

  return {
    totalTickets: total,
    totalClosed: closed,
    totalOpen: open,
    closureRate,
    sla: {
      attendedPercentage: 76.8, // Replace with real SLA map if available in tickets
      overduePercentage: 23.2,
    },
    time: {
      tme: "02:45:12", // Placeholder for actual Time to Respond calculation
      tma: "01:53:09",
    },
    csat: {
      score: 91.7,
      target: 95.0,
      status: 91.7 >= 95.0 ? "ok" : "below",
    }
  };
}

export function buildTimeSeriesMetrics(tickets: Ticket[]): TimeSeriesData {
  const group: Record<string, { open: number; closed: number }> = {};

  tickets.forEach((t) => {
    const date = new Date(t.created_at);
    // Simple mock MM/YY bucket
    const monthStr = date.toLocaleString('pt-BR', { month: 'short' });
    const yearStr = date.toLocaleString('pt-BR', { year: '2-digit' });
    const label = `${monthStr.charAt(0).toUpperCase() + monthStr.slice(1)}/${yearStr}`;

    if (!group[label]) group[label] = { open: 0, closed: 0 };

    const isClosed = (t.status || '').toLowerCase().includes('fechado');
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
    validTickets = tickets.filter(t => !(t.status || '').toLowerCase().includes('fechado'));
  } else if (filterStatus === 'closed') {
    validTickets = tickets.filter(t => (t.status || '').toLowerCase().includes('fechado'));
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

export function buildDashboardMetrics(tickets: Ticket[]): DashboardMetrics {
  return {
    overview: buildOverviewMetrics(tickets),
    ticketsOpenVsClosed: buildTimeSeriesMetrics(tickets),
    openTicketsByCategory: buildCategoryMetrics(tickets, 'open'),
    ticketsByCategory: buildCategoryMetrics(tickets), // all
    ticketTypes: buildPieChartMetrics(tickets),
    topRequesters: buildRankingMetrics(tickets)
  };
}
