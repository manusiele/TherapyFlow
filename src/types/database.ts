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
      farmers: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string
          location: string
          farm_size: number
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone: string
          location: string
          farm_size: number
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string
          location?: string
          farm_size?: number
        }
      }
      crops: {
        Row: {
          id: string
          farmer_id: string
          crop_type: string
          planted_date: string
          expected_harvest: string
          quantity: number
          status: string
        }
        Insert: {
          id?: string
          farmer_id: string
          crop_type: string
          planted_date: string
          expected_harvest: string
          quantity: number
          status?: string
        }
        Update: {
          id?: string
          farmer_id?: string
          crop_type?: string
          planted_date?: string
          expected_harvest?: string
          quantity?: number
          status?: string
        }
      }
      market_prices: {
        Row: {
          id: string
          crop_type: string
          price: number
          currency: string
          date: string
          location: string
        }
        Insert: {
          id?: string
          crop_type: string
          price: number
          currency?: string
          date: string
          location: string
        }
        Update: {
          id?: string
          crop_type?: string
          price?: number
          currency?: string
          date?: string
          location?: string
        }
      }
    }
  }
}
