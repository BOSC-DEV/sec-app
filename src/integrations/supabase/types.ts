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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      announcement_reactions: {
        Row: {
          announcement_id: string | null
          created_at: string | null
          id: string
          reaction_type: string
          user_id: string | null
        }
        Insert: {
          announcement_id?: string | null
          created_at?: string | null
          id?: string
          reaction_type: string
          user_id?: string | null
        }
        Update: {
          announcement_id?: string | null
          created_at?: string | null
          id?: string
          reaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcement_reactions_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcement_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          author_id: string | null
          author_name: string | null
          author_profile_pic: string | null
          author_username: string | null
          content: string
          created_at: string | null
          dislikes: number | null
          id: string
          likes: number | null
          survey_data: Json | null
          updated_at: string | null
          views: number | null
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          author_profile_pic?: string | null
          author_username?: string | null
          content: string
          created_at?: string | null
          dislikes?: number | null
          id?: string
          likes?: number | null
          survey_data?: Json | null
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          author_profile_pic?: string | null
          author_username?: string | null
          content?: string
          created_at?: string | null
          dislikes?: number | null
          id?: string
          likes?: number | null
          survey_data?: Json | null
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bounty_contributions: {
        Row: {
          amount: number
          comment: string | null
          contributor_id: string | null
          contributor_name: string | null
          contributor_profile_pic: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          scammer_id: string | null
          transaction_signature: string | null
          transferred_from_id: string | null
          transferred_to_id: string | null
        }
        Insert: {
          amount: number
          comment?: string | null
          contributor_id?: string | null
          contributor_name?: string | null
          contributor_profile_pic?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          scammer_id?: string | null
          transaction_signature?: string | null
          transferred_from_id?: string | null
          transferred_to_id?: string | null
        }
        Update: {
          amount?: number
          comment?: string | null
          contributor_id?: string | null
          contributor_name?: string | null
          contributor_profile_pic?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          scammer_id?: string | null
          transaction_signature?: string | null
          transferred_from_id?: string | null
          transferred_to_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bounty_contributions_contributor_id_fkey"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bounty_contributions_scammer_id_fkey"
            columns: ["scammer_id"]
            isOneToOne: false
            referencedRelation: "scammers"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_message_reactions: {
        Row: {
          created_at: string | null
          id: string
          message_id: string | null
          reaction_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message_id?: string | null
          reaction_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message_id?: string | null
          reaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_message_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          author_id: string | null
          author_name: string | null
          author_profile_pic: string | null
          author_sec_balance: number | null
          author_username: string | null
          content: string
          created_at: string | null
          dislikes: number | null
          id: string
          image_url: string | null
          likes: number | null
          user_id: string | null
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          author_profile_pic?: string | null
          author_sec_balance?: number | null
          author_username?: string | null
          content: string
          created_at?: string | null
          dislikes?: number | null
          id?: string
          image_url?: string | null
          likes?: number | null
          user_id?: string | null
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          author_profile_pic?: string | null
          author_sec_balance?: number | null
          author_username?: string | null
          content?: string
          created_at?: string | null
          dislikes?: number | null
          id?: string
          image_url?: string | null
          likes?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author: string
          author_name: string | null
          author_profile_pic: string | null
          content: string
          created_at: string | null
          dislikes: number | null
          id: string
          likes: number | null
          scammer_id: string
          views: number | null
        }
        Insert: {
          author: string
          author_name?: string | null
          author_profile_pic?: string | null
          content: string
          created_at?: string | null
          dislikes?: number | null
          id?: string
          likes?: number | null
          scammer_id: string
          views?: number | null
        }
        Update: {
          author?: string
          author_name?: string | null
          author_profile_pic?: string | null
          content?: string
          created_at?: string | null
          dislikes?: number | null
          id?: string
          likes?: number | null
          scammer_id?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_scammer_id_fkey"
            columns: ["scammer_id"]
            isOneToOne: false
            referencedRelation: "scammers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string
          points: number | null
          profile_pic_url: string | null
          sec_balance: number | null
          updated_at: string | null
          username: string | null
          wallet_address: string
          website_link: string | null
          x_link: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          points?: number | null
          profile_pic_url?: string | null
          sec_balance?: number | null
          updated_at?: string | null
          username?: string | null
          wallet_address: string
          website_link?: string | null
          x_link?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          points?: number | null
          profile_pic_url?: string | null
          sec_balance?: number | null
          updated_at?: string | null
          username?: string | null
          wallet_address?: string
          website_link?: string | null
          x_link?: string | null
        }
        Relationships: []
      }
      replies: {
        Row: {
          announcement_id: string | null
          author_id: string | null
          author_name: string | null
          author_profile_pic: string | null
          author_username: string | null
          content: string
          created_at: string | null
          dislikes: number | null
          id: string
          likes: number | null
        }
        Insert: {
          announcement_id?: string | null
          author_id?: string | null
          author_name?: string | null
          author_profile_pic?: string | null
          author_username?: string | null
          content: string
          created_at?: string | null
          dislikes?: number | null
          id?: string
          likes?: number | null
        }
        Update: {
          announcement_id?: string | null
          author_id?: string | null
          author_name?: string | null
          author_profile_pic?: string | null
          author_username?: string | null
          content?: string
          created_at?: string | null
          dislikes?: number | null
          id?: string
          likes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "replies_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reply_reactions: {
        Row: {
          created_at: string | null
          id: string
          reaction_type: string
          reply_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          reaction_type: string
          reply_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          reaction_type?: string
          reply_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reply_reactions_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reply_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      report_submissions: {
        Row: {
          created_at: string | null
          description: string
          id: string
          scammer_name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          scammer_name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          scammer_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scammers: {
        Row: {
          accomplices: string[] | null
          accused_of: string
          added_by: string | null
          aliases: string[] | null
          bounty_amount: number | null
          comments: string[] | null
          created_at: string | null
          date_added: string | null
          deleted_at: string | null
          dislikes: number | null
          id: string
          likes: number | null
          links: string[] | null
          name: string
          official_response: string | null
          photo_url: string | null
          shares: number | null
          updated_at: string | null
          views: number | null
          wallet_addresses: string[] | null
        }
        Insert: {
          accomplices?: string[] | null
          accused_of: string
          added_by?: string | null
          aliases?: string[] | null
          bounty_amount?: number | null
          comments?: string[] | null
          created_at?: string | null
          date_added?: string | null
          deleted_at?: string | null
          dislikes?: number | null
          id?: string
          likes?: number | null
          links?: string[] | null
          name: string
          official_response?: string | null
          photo_url?: string | null
          shares?: number | null
          updated_at?: string | null
          views?: number | null
          wallet_addresses?: string[] | null
        }
        Update: {
          accomplices?: string[] | null
          accused_of?: string
          added_by?: string | null
          aliases?: string[] | null
          bounty_amount?: number | null
          comments?: string[] | null
          created_at?: string | null
          date_added?: string | null
          deleted_at?: string | null
          dislikes?: number | null
          id?: string
          likes?: number | null
          links?: string[] | null
          name?: string
          official_response?: string | null
          photo_url?: string | null
          shares?: number | null
          updated_at?: string | null
          views?: number | null
          wallet_addresses?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "scammers_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_country_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          count: number
          country: string
        }[]
      }
      get_daily_visitors: {
        Args: Record<PropertyKey, never>
        Returns: {
          count: number
          date: string
        }[]
      }
      track_pageview: {
        Args: { pageview_data: Json }
        Returns: undefined
      }
      track_visitor: {
        Args: { visitor_data: Json }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
