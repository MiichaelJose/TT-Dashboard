export interface OverviewMetrics {
  totalTickets: number;
  totalClosed: number;
  totalOpen: number;
  closureRate: number;

  sla: {
    attendedPercentage: number;
    overduePercentage: number;
  };

  time: {
    tme: string; // Temporarily keeping strings since mock is raw string or ms
    tma: string;
  };

  csat: {
    score: number;
    target: number;
    status: "below" | "ok" | "above";
  };
}

export type BarChartData = {
  label: string;
  value: number;
}[];

export type PieChartData = {
  name: string;
  value: number;
}[];

export type RankingData = {
  name: string;
  total: number;
}[];

export type TimeSeriesData = {
  period: string;
  opened: number;
  closed: number;
}[];

export interface DashboardMetrics {
  overview: OverviewMetrics;
  ticketsOpenVsClosed: TimeSeriesData;
  openTicketsByCategory: BarChartData;
  ticketsByCategory: BarChartData;
  ticketTypes: PieChartData;
  topRequesters: RankingData;
}
