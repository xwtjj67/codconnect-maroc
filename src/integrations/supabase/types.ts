export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      affiliate_links: {
        Row: {
          affiliate_id: string
          clicks: number
          code: string
          created_at: string
          id: string
          product_id: string
          sales: number
        }
        Insert: {
          affiliate_id: string
          clicks?: number
          code: string
          created_at?: string
          id?: string
          product_id: string
          sales?: number
        }
        Update: {
          affiliate_id?: string
          clicks?: number
          code?: string
          created_at?: string
          id?: string
          product_id?: string
          sales?: number
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_links_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      approvals: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string
          id: string
          notes: string | null
          target_id: string
          target_type: string
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          target_id: string
          target_type: string
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      commissions: {
        Row: {
          affiliate_id: string
          amount: number
          created_at: string
          id: string
          order_id: string
          status: string
        }
        Insert: {
          affiliate_id: string
          amount: number
          created_at?: string
          id?: string
          order_id: string
          status?: string
        }
        Update: {
          affiliate_id?: string
          amount?: number
          created_at?: string
          id?: string
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      distribution_logs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          sheet_index: number
          success: boolean
          user_name: string | null
          user_phone: string | null
          user_role: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          sheet_index: number
          success?: boolean
          user_name?: string | null
          user_phone?: string | null
          user_role?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          sheet_index?: number
          success?: boolean
          user_name?: string | null
          user_phone?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      distribution_state: {
        Row: {
          current_index: number
          id: string
          total_sheets: number
          updated_at: string
        }
        Insert: {
          current_index?: number
          id?: string
          total_sheets?: number
          updated_at?: string
        }
        Update: {
          current_index?: number
          id?: string
          total_sheets?: number
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          affiliate_id: string
          city: string
          client_name: string
          client_phone: string
          commission_amount: number
          cost_price: number
          created_at: string
          id: string
          merchant_id: string
          platform_profit: number
          product_id: string
          selling_price: number
          status: Database["public"]["Enums"]["order_status"]
          updated_at: string
        }
        Insert: {
          affiliate_id: string
          city: string
          client_name: string
          client_phone: string
          commission_amount?: number
          cost_price: number
          created_at?: string
          id?: string
          merchant_id: string
          platform_profit?: number
          product_id: string
          selling_price: number
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
        }
        Update: {
          affiliate_id?: string
          city?: string
          client_name?: string
          client_phone?: string
          commission_amount?: number
          cost_price?: number
          created_at?: string
          id?: string
          merchant_id?: string
          platform_profit?: number
          product_id?: string
          selling_price?: number
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          approval_status: Database["public"]["Enums"]["approval_status"]
          category: string | null
          clicks: number
          commission: number | null
          cost_price: number
          created_at: string
          description: string | null
          id: string
          image: string | null
          images: string[] | null
          is_active: boolean
          merchant_id: string
          name: string
          orders_count: number
          selling_price: number | null
          stock: number
          thumbnail: string | null
          updated_at: string
          video_url: string | null
          views: number
          visibility: Database["public"]["Enums"]["visibility_level"]
        }
        Insert: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          category?: string | null
          clicks?: number
          commission?: number | null
          cost_price: number
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          images?: string[] | null
          is_active?: boolean
          merchant_id: string
          name: string
          orders_count?: number
          selling_price?: number | null
          stock?: number
          thumbnail?: string | null
          updated_at?: string
          video_url?: string | null
          views?: number
          visibility?: Database["public"]["Enums"]["visibility_level"]
        }
        Update: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          category?: string | null
          clicks?: number
          commission?: number | null
          cost_price?: number
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          images?: string[] | null
          is_active?: boolean
          merchant_id?: string
          name?: string
          orders_count?: number
          selling_price?: number | null
          stock?: number
          thumbnail?: string | null
          updated_at?: string
          video_url?: string | null
          views?: number
          visibility?: Database["public"]["Enums"]["visibility_level"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string
          id: string
          name: string
          phone: string
          store_name: string | null
          updated_at: string
          username: string | null
          whatsapp: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          id: string
          name: string
          phone: string
          store_name?: string | null
          updated_at?: string
          username?: string | null
          whatsapp?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: string
          name?: string
          phone?: string
          store_name?: string | null
          updated_at?: string
          username?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referred_id: string
          referrer_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          referred_id: string
          referrer_id: string
        }
        Update: {
          created_at?: string
          id?: string
          referred_id?: string
          referrer_id?: string
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string
          role: string
          service_name: string
          status: Database["public"]["Enums"]["service_request_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone: string
          role: string
          service_name: string
          status?: Database["public"]["Enums"]["service_request_status"]
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string
          role?: string
          service_name?: string
          status?: Database["public"]["Enums"]["service_request_status"]
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          plan: Database["public"]["Enums"]["plan_type"] | null
          seller_plan: Database["public"]["Enums"]["seller_plan_type"] | null
          started_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          plan?: Database["public"]["Enums"]["plan_type"] | null
          seller_plan?: Database["public"]["Enums"]["seller_plan_type"] | null
          started_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          plan?: Database["public"]["Enums"]["plan_type"] | null
          seller_plan?: Database["public"]["Enums"]["seller_plan_type"] | null
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      training_content: {
        Row: {
          access_level: string
          category: string
          content: string | null
          created_at: string
          description: string | null
          id: string
          is_published: boolean
          read_time: string | null
          sort_order: number
          title: string
          type: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          access_level?: string
          category?: string
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          read_time?: string | null
          sort_order?: number
          title: string
          type?: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          access_level?: string
          category?: string
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          read_time?: string | null
          sort_order?: number
          title?: string
          type?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_statuses: {
        Row: {
          id: string
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_next_sheet_index: { Args: never; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "affiliate" | "product_owner" | "admin"
      approval_status: "pending" | "approved" | "rejected"
      order_status:
        | "pending"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled"
      plan_type: "standard" | "premium" | "vip"
      seller_plan_type: "basic" | "pro"
      service_request_status: "pending" | "contacted" | "closed"
      user_status: "pending" | "approved" | "active" | "suspended"
      visibility_level: "standard" | "premium" | "vip"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["affiliate", "product_owner", "admin"],
      approval_status: ["pending", "approved", "rejected"],
      order_status: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      plan_type: ["standard", "premium", "vip"],
      seller_plan_type: ["basic", "pro"],
      service_request_status: ["pending", "contacted", "closed"],
      user_status: ["pending", "approved", "active", "suspended"],
      visibility_level: ["standard", "premium", "vip"],
    },
  },
} as const
