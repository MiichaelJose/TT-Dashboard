export interface Ticket {
  id: string;
  protocol: number;
  subject: string;
  message: string;
  status: string;
  situation: string;
  priority: number;
  created_at: string;
  updated_at: string;
  operator: string;
  department: string;
  category: string;
  customer_name: string;
  customer_email: string;
}

export interface SyncResponse {
  status: 'synced' | 'cached' | 'error';
  timestamp?: number;
  error?: string;
  ticketsCount?: number;
}
