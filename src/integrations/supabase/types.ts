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
        Args: {
          p_scammer_id: string
          p_ip_hash: string
        }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
