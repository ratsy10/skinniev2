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
      skin_analyses: {
        Row: {
          id: string
          created_at: string
          user_id: string
          severity_score: number
          description: string
          affected_area_percentage: number
          image_url: string
          lifestyle_factors: Json
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          severity_score: number
          description: string
          affected_area_percentage: number
          image_url: string
          lifestyle_factors?: Json
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          severity_score?: number
          description?: string
          affected_area_percentage?: number
          image_url?: string
          lifestyle_factors?: Json
        }
      }
      lifestyle_factors: {
        Row: {
          id: string
          created_at: string
          user_id: string
          sleep_hours: number
          stress_level: number
          diet_notes: string
          weather_conditions: string
          skincare_products: string[]
          additional_notes: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          sleep_hours: number
          stress_level: number
          diet_notes?: string
          weather_conditions?: string
          skincare_products?: string[]
          additional_notes?: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          sleep_hours?: number
          stress_level?: number
          diet_notes?: string
          weather_conditions?: string
          skincare_products?: string[]
          additional_notes?: string
        }
      }
    }
  }
} 