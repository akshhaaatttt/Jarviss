export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string;
  seller_address: string;
  created_at: string | null;
  status: string;
}

export interface TransactionStatus {
  status: 'idle' | 'processing' | 'success' | 'failed';
  message?: string;
}