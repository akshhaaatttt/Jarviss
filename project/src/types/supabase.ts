export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          image_url: string
          seller_address: string
          created_at: string | null
          status: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          image_url: string
          seller_address: string
          created_at?: string | null
          status?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string
          seller_address?: string
          created_at?: string | null
          status?: string
        }
      }
    }
  }
}