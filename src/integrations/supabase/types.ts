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
      analytics_pageviews: {
        Row: {
          id: string
          is_bounce: boolean | null
          page_path: string
          page_title: string | null
          session_id: string | null
          time_on_page: number | null
          visited_at: string
          visitor_id: string
        }
        Insert: {
          id?: string
          is_bounce?: boolean | null
          page_path: string
          page_title?: string | null
          session_id?: string | null
          time_on_page?: number | null
          visited_at?: string
          visitor_id: string
        }
        Update: {
          id?: string
          is_bounce?: boolean | null
          page_path?: string
          page_title?: string | null
          session_id?: string | null
          time_on_page?: number | null
          visited_at?: string
          visitor_id?: string
        }
        Relationships: []
      }
      analytics_visitors: {
        Row: {
          city: string | null
          country_code: string | null
          country_name: string | null
          first_visit_at: string
          id: string
          ip_address: string | null
          last_visit_at: string
          referrer: string | null
          user_agent: string | null
          visit_count: number
          visitor_id: string
        }
        Insert: {
          city?: string | null
          country_code?: string | null
          country_name?: string | null
          first_visit_at?: string
          id?: string
          ip_address?: string | null
          last_visit_at?: string
          referrer?: string | null
          user_agent?: string | null
          visit_count?: number
          visitor_id: string
        }
        Update: {
          city?: string | null
          country_code?: string | null
          country_name?: string | null
          first_visit_at?: string
          id?: string
          ip_address?: string | null
          last_visit_at?: string
          referrer?: string | null
          user_agent?: string | null
          visit_count?: number
          visitor_id?: string
        }
        Relationships: []
      }
      announcement_reactions: {
        Row: {
          announcement_id: string
          created_at: string
          id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          announcement_id: string
          created_at?: string
          id?: string
          reaction_type: string
          user_id: string
        }
        Update: {
          announcement_id?: string
          created_at?: string
          id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_reactions_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcement_replies: {
        Row: {
          announcement_id: string
          author_id: string
          author_name: string
          author_profile_pic: string | null
          author_username: string | null
          content: string
          created_at: string
          dislikes: number
          id: string
          likes: number
        }
        Insert: {
          announcement_id: string
          author_id: string
          author_name: string
          author_profile_pic?: string | null
          author_username?: string | null
          content: string
          created_at?: string
          dislikes?: number
          id?: string
          likes?: number
        }
        Update: {
          announcement_id?: string
          author_id?: string
          author_name?: string
          author_profile_pic?: string | null
          author_username?: string | null
          content?: string
          created_at?: string
          dislikes?: number
          id?: string
          likes?: number
        }
        Relationships: [
          {
            foreignKeyName: "announcement_replies_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          author_id: string
          author_name: string
          author_profile_pic: string | null
          author_username: string
          content: string
          created_at: string
          dislikes: number
          id: string
          likes: number
          survey_data: Json | null
          views: number
        }
        Insert: {
          author_id: string
          author_name: string
          author_profile_pic?: string | null
          author_username: string
          content: string
          created_at?: string
          dislikes?: number
          id?: string
          likes?: number
          survey_data?: Json | null
          views?: number
        }
        Update: {
          author_id?: string
          author_name?: string
          author_profile_pic?: string | null
          author_username?: string
          content?: string
          created_at?: string
          dislikes?: number
          id?: string
          likes?: number
          survey_data?: Json | null
          views?: number
        }
        Relationships: []
      }
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
      chat_message_reactions: {
        Row: {
          created_at: string
          id: string
          message_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          author_id: string
          author_name: string
          author_profile_pic: string | null
          author_sec_balance: number | null
          author_username: string | null
          content: string
          created_at: string
          dislikes: number
          id: string
          image_url: string | null
          likes: number
        }
        Insert: {
          author_id: string
          author_name: string
          author_profile_pic?: string | null
          author_sec_balance?: number | null
          author_username?: string | null
          content: string
          created_at?: string
          dislikes?: number
          id?: string
          image_url?: string | null
          likes?: number
        }
        Update: {
          author_id?: string
          author_name?: string
          author_profile_pic?: string | null
          author_sec_balance?: number | null
          author_username?: string | null
          content?: string
          created_at?: string
          dislikes?: number
          id?: string
          image_url?: string | null
          likes?: number
        }
        Relationships: []
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
      delegated_badges: {
        Row: {
          active: boolean
          created_at: string
          delegated_wallet: string
          delegator_wallet: string
          id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          delegated_wallet: string
          delegator_wallet: string
          id?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          delegated_wallet?: string
          delegator_wallet?: string
          id?: string
        }
        Relationships: []
      }
      key_updates: {
        Row: {
          category: string
          created_at: string | null
          description: string
          expires_at: string | null
          id: string
          importance: string | null
          is_pinned: boolean | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          expires_at?: string | null
          id?: string
          importance?: string | null
          is_pinned?: boolean | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          expires_at?: string | null
          id?: string
          importance?: string | null
          is_pinned?: boolean | null
          title?: string
        }
        Relationships: []
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
      notifications: {
        Row: {
          actor_id: string | null
          actor_name: string | null
          actor_profile_pic: string | null
          actor_username: string | null
          content: string
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          is_read: boolean | null
          recipient_id: string
          type: string
        }
        Insert: {
          actor_id?: string | null
          actor_name?: string | null
          actor_profile_pic?: string | null
          actor_username?: string | null
          content: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          is_read?: boolean | null
          recipient_id: string
          type: string
        }
        Update: {
          actor_id?: string | null
          actor_name?: string | null
          actor_profile_pic?: string | null
          actor_username?: string | null
          content?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          is_read?: boolean | null
          recipient_id?: string
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          delegation_limit: number | null
          display_name: string
          id: string
          is_admin: boolean | null
          points: number | null
          profile_pic_url: string | null
          sec_balance: number | null
          username: string | null
          wallet_address: string
          website_link: string | null
          x_link: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          delegation_limit?: number | null
          display_name: string
          id: string
          is_admin?: boolean | null
          points?: number | null
          profile_pic_url?: string | null
          sec_balance?: number | null
          username?: string | null
          wallet_address: string
          website_link?: string | null
          x_link?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          delegation_limit?: number | null
          display_name?: string
          id?: string
          is_admin?: boolean | null
          points?: number | null
          profile_pic_url?: string | null
          sec_balance?: number | null
          username?: string | null
          wallet_address?: string
          website_link?: string | null
          x_link?: string | null
        }
        Relationships: []
      }
      reply_reactions: {
        Row: {
          created_at: string
          id: string
          reaction_type: string
          reply_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reaction_type: string
          reply_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reaction_type?: string
          reply_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reply_reactions_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "announcement_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      report_submissions: {
        Row: {
          created_at: string
          id: string
          ip_hash: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_hash: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_hash?: string
          user_id?: string | null
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
          updated_at: string | null
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
          updated_at?: string | null
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
          updated_at?: string | null
          views?: number | null
          wallet_addresses?: string[] | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string
          id: string
          priority: string | null
          resolution_notes: string | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description: string
          id?: string
          priority?: string | null
          resolution_notes?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string
          id?: string
          priority?: string | null
          resolution_notes?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string
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
        Relationships: []
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
      analytics_country_stats: {
        Row: {
          country_code: string | null
          country_name: string | null
          visit_count: number | null
          visitor_count: number | null
        }
        Relationships: []
      }
      analytics_daily_visitors: {
        Row: {
          day: string | null
          total_visits: number | null
          unique_visitors: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_report_rate_limits: {
        Args: { p_user_id: string; p_ip_hash: string }
        Returns: {
          allowed: boolean
          message: string
        }[]
      }
      get_country_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          country_code: string
          country_name: string
          visitor_count: number
          visit_count: number
        }[]
      }
      get_daily_visitors: {
        Args: Record<PropertyKey, never>
        Returns: {
          day: string
          unique_visitors: number
          total_visits: number
        }[]
      }
      increment_announcement_views: {
        Args: { p_announcement_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: { username_param: string }
        Returns: boolean
      }
      is_duplicate_view: {
        Args: { p_scammer_id: string; p_ip_hash: string }
        Returns: boolean
      }
      record_report_submission: {
        Args: { p_user_id: string; p_ip_hash: string }
        Returns: string
      }
      track_pageview: {
        Args: {
          p_visitor_id: string
          p_page_path: string
          p_page_title?: string
          p_session_id?: string
        }
        Returns: string
      }
      track_visitor: {
        Args: {
          p_visitor_id: string
          p_ip_address: string
          p_user_agent: string
          p_country_code?: string
          p_country_name?: string
          p_city?: string
          p_referrer?: string
        }
        Returns: string
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
      validate_and_sanitize_text: {
        Args: { input_text: string }
        Returns: string
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
