export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bounty_contributions: {
        Row: {
          amount: number
          comment: string | null
          contributor_id: string
          contributor_name: string
          contributor_profile_pic: string | null
          created_at: string
          id: string
          is_active: boolean
          scammer_id: string
          transaction_signature: string | null
          transferred_from_id: string | null
          transferred_to_id: string | null
        }
        Insert: {
          amount: number
          comment?: string | null
          contributor_id: string
          contributor_name: string
          contributor_profile_pic?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          scammer_id: string
          transaction_signature?: string | null
          transferred_from_id?: string | null
          transferred_to_id?: string | null
        }
        Update: {
          amount?: number
          comment?: string | null
          contributor_id?: string
          contributor_name?: string
          contributor_profile_pic?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          scammer_id?: string
          transaction_signature?: string | null
          transferred_from_id?: string | null
          transferred_to_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bounty_contributions_scammer_id_fkey"
            columns: ["scammer_id"]
            isOneToOne: false
            referencedRelation: "scammers"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author: string
          author_name: string
          author_profile_pic: string | null
          content: string
          created_at: string
          dislikes: number | null
          id: string
          likes: number | null
          scammer_id: string | null
          views: number | null
        }
        Insert: {
          author: string
          author_name: string
          author_profile_pic?: string | null
          content: string
          created_at?: string
          dislikes?: number | null
          id: string
          likes?: number | null
          scammer_id?: string | null
          views?: number | null
        }
        Update: {
          author?: string
          author_name?: string
          author_profile_pic?: string | null
          content?: string
          created_at?: string
          dislikes?: number | null
          id?: string
          likes?: number | null
          scammer_id?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_scammer_id_fkey"
            columns: ["scammer_id"]
            isOneToOne: false
            referencedRelation: "scammers"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_stats: {
        Row: {
          id: string
          last_updated: string
          total_bounty: number | null
          total_comments: number | null
          total_likes: number | null
          total_reports: number | null
          total_views: number | null
          wallet_address: string
        }
        Insert: {
          id?: string
          last_updated?: string
          total_bounty?: number | null
          total_comments?: number | null
          total_likes?: number | null
          total_reports?: number | null
          total_views?: number | null
          wallet_address: string
        }
        Update: {
          id?: string
          last_updated?: string
          total_bounty?: number | null
          total_comments?: number | null
          total_likes?: number | null
          total_reports?: number | null
          total_views?: number | null
          wallet_address?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          display_name: string
          id: string
          points: number | null
          profile_pic_url: string | null
          username: string | null
          wallet_address: string
          website_link: string | null
          x_link: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_name: string
          id: string
          points?: number | null
          profile_pic_url?: string | null
          username?: string | null
          wallet_address: string
          website_link?: string | null
          x_link?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          points?: number | null
          profile_pic_url?: string | null
          username?: string | null
          wallet_address?: string
          website_link?: string | null
          x_link?: string | null
        }
        Relationships: []
      }
      scammer_views: {
        Row: {
          created_at: string
          id: string
          ip_hash: string
          scammer_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_hash: string
          scammer_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_hash?: string
          scammer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scammer_views_scammer_id_fkey"
            columns: ["scammer_id"]
            isOneToOne: false
            referencedRelation: "scammers"
            referencedColumns: ["id"]
          },
        ]
      }
      scammers: {
        Row: {
          accomplices: string[] | null
          accused_of: string | null
          added_by: string | null
          aliases: string[] | null
          bounty_amount: number | null
          comments: string[] | null
          date_added: string
          deleted_at: string | null
          dislikes: number | null
          id: string
          likes: number | null
          links: string[] | null
          name: string
          official_response: string | null
          photo_url: string | null
          shares: number | null
          views: number | null
          wallet_addresses: string[] | null
        }
        Insert: {
          accomplices?: string[] | null
          accused_of?: string | null
          added_by?: string | null
          aliases?: string[] | null
          bounty_amount?: number | null
          comments?: string[] | null
          date_added?: string
          deleted_at?: string | null
          dislikes?: number | null
          id: string
          likes?: number | null
          links?: string[] | null
          name: string
          official_response?: string | null
          photo_url?: string | null
          shares?: number | null
          views?: number | null
          wallet_addresses?: string[] | null
        }
        Update: {
          accomplices?: string[] | null
          accused_of?: string | null
          added_by?: string | null
          aliases?: string[] | null
          bounty_amount?: number | null
          comments?: string[] | null
          date_added?: string
          deleted_at?: string | null
          dislikes?: number | null
          id?: string
          likes?: number | null
          links?: string[] | null
          name?: string
          official_response?: string | null
          photo_url?: string | null
          shares?: number | null
          views?: number | null
          wallet_addresses?: string[] | null
        }
        Relationships: []
      }
      user_comment_interactions: {
        Row: {
          comment_id: string
          disliked: boolean
          id: string
          last_updated: string
          liked: boolean
          user_id: string
        }
        Insert: {
          comment_id: string
          disliked?: boolean
          id?: string
          last_updated?: string
          liked?: boolean
          user_id: string
        }
        Update: {
          comment_id?: string
          disliked?: boolean
          id?: string
          last_updated?: string
          liked?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_comment_interactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_scammer_interactions: {
        Row: {
          disliked: boolean
          id: string
          last_updated: string
          liked: boolean
          scammer_id: string
          user_id: string
        }
        Insert: {
          disliked?: boolean
          id?: string
          last_updated?: string
          liked?: boolean
          scammer_id: string
          user_id: string
        }
        Update: {
          disliked?: boolean
          id?: string
          last_updated?: string
          liked?: boolean
          scammer_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_scammer_interactions_scammer_id_fkey"
            columns: ["scammer_id"]
            isOneToOne: false
            referencedRelation: "scammers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_duplicate_view: {
        Args: { p_scammer_id: string; p_ip_hash: string }
        Returns: boolean
      }
      upsert_profile: {
        Args: {
          profile_id: string
          profile_display_name: string
          profile_username: string
          profile_pic_url: string
          profile_wallet_address: string
          profile_created_at: string
          profile_x_link: string
          profile_website_link: string
          profile_bio: string
        }
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
