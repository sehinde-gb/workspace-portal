export interface Order {
  id: number;
  customerName: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  
}
