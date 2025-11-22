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
          {
            foreignKeyName: "announcement_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
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
          image_url: string | null
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
          image_url?: string | null
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
          image_url?: string | null
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
          {
            foreignKeyName: "announcements_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
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
            foreignKeyName: "bounty_contributions_contributor_id_fkey"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
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
          {
            foreignKeyName: "chat_message_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
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
            foreignKeyName: "chat_messages_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_reactions: {
        Row: {
          comment_id: string | null
          created_at: string | null
          id: string
          reaction_type: string
          user_id: string | null
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          reaction_type: string
          user_id?: string | null
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          reaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comment_reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_replies: {
        Row: {
          author: string
          author_name: string | null
          author_profile_pic: string | null
          comment_id: string
          content: string
          created_at: string | null
          dislikes: number | null
          id: string
          likes: number | null
        }
        Insert: {
          author: string
          author_name?: string | null
          author_profile_pic?: string | null
          comment_id: string
          content: string
          created_at?: string | null
          dislikes?: number | null
          id?: string
          likes?: number | null
        }
        Update: {
          author?: string
          author_name?: string | null
          author_profile_pic?: string | null
          comment_id?: string
          content?: string
          created_at?: string | null
          dislikes?: number | null
          id?: string
          likes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comment_replies_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_replies_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_replies_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_reply_reactions: {
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
            foreignKeyName: "comment_reply_reactions_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "comment_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_reply_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_reply_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
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
            foreignKeyName: "comments_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles_public"
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
      notifications: {
        Row: {
          actor_id: string | null
          actor_name: string | null
          actor_profile_pic: string | null
          actor_username: string | null
          content: string
          created_at: string | null
          entity_id: string | null
          id: string
          is_read: boolean | null
          recipient_id: string | null
          type: string
        }
        Insert: {
          actor_id?: string | null
          actor_name?: string | null
          actor_profile_pic?: string | null
          actor_username?: string | null
          content: string
          created_at?: string | null
          entity_id?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id?: string | null
          type: string
        }
        Update: {
          actor_id?: string | null
          actor_name?: string | null
          actor_profile_pic?: string | null
          actor_username?: string | null
          content?: string
          created_at?: string | null
          entity_id?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
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
          is_admin: boolean | null
          is_banned: boolean | null
          points: number | null
          profile_pic_url: string | null
          sec_balance: number | null
          suspended_until: string | null
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
          is_admin?: boolean | null
          is_banned?: boolean | null
          points?: number | null
          profile_pic_url?: string | null
          sec_balance?: number | null
          suspended_until?: string | null
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
          is_admin?: boolean | null
          is_banned?: boolean | null
          points?: number | null
          profile_pic_url?: string | null
          sec_balance?: number | null
          suspended_until?: string | null
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
          {
            foreignKeyName: "replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
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
          {
            foreignKeyName: "reply_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      report_submissions: {
        Row: {
          created_at: string | null
          description: string
          id: string
          resolution: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          scammer_name: string
          status: Database["public"]["Enums"]["report_status"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          resolution?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          scammer_name: string
          status?: Database["public"]["Enums"]["report_status"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          resolution?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          scammer_name?: string
          status?: Database["public"]["Enums"]["report_status"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_submissions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_submissions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      scammer_views: {
        Row: {
          created_at: string | null
          id: string
          scammer_id: string | null
          visitor_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          scammer_id?: string | null
          visitor_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          scammer_id?: string | null
          visitor_id?: string
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
          report_number: number
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
          report_number?: number
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
          report_number?: number
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
          {
            foreignKeyName: "scammers_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_scammer_interactions: {
        Row: {
          bookmarked: boolean | null
          created_at: string | null
          disliked: boolean | null
          id: string
          liked: boolean | null
          scammer_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bookmarked?: boolean | null
          created_at?: string | null
          disliked?: boolean | null
          id?: string
          liked?: boolean | null
          scammer_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bookmarked?: boolean | null
          created_at?: string | null
          disliked?: boolean | null
          id?: string
          liked?: boolean | null
          scammer_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_scammer_interactions_scammer_id_fkey"
            columns: ["scammer_id"]
            isOneToOne: false
            referencedRelation: "scammers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_scammer_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_scammer_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      profiles_public: {
        Row: {
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
          is_banned: boolean | null
          points: number | null
          profile_pic_url: string | null
          sec_balance: number | null
          suspended_until: string | null
          updated_at: string | null
          username: string | null
          website_link: string | null
          x_link: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          is_banned?: boolean | null
          points?: number | null
          profile_pic_url?: string | null
          sec_balance?: number | null
          suspended_until?: string | null
          updated_at?: string | null
          username?: string | null
          website_link?: string | null
          x_link?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          is_banned?: boolean | null
          points?: number | null
          profile_pic_url?: string | null
          sec_balance?: number | null
          suspended_until?: string | null
          updated_at?: string | null
          username?: string | null
          website_link?: string | null
          x_link?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      current_profile_id: { Args: never; Returns: string }
      get_country_stats: {
        Args: never
        Returns: {
          count: number
          country: string
        }[]
      }
      get_daily_visitors: {
        Args: never
        Returns: {
          count: number
          date: string
        }[]
      }
      get_public_statistics: {
        Args: never
        Returns: {
          reporters_count: number
          scammers_count: number
          total_bounty: number
          users_count: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_announcement_views: {
        Args: { announcement_id_param: string }
        Returns: undefined
      }
      is_current_user_admin: { Args: never; Returns: boolean }
      is_duplicate_view: {
        Args: { p_scammer_id: string; p_visitor_id: string }
        Returns: boolean
      }
      is_whale: { Args: { p_profile_id: string }; Returns: boolean }
      migrate_user_password: {
        Args: { p_signature_base64: string; p_wallet_address: string }
        Returns: boolean
      }
      toggle_announcement_reaction: {
        Args: {
          p_announcement_id: string
          p_reaction_type: string
          p_user_id: string
        }
        Returns: Json
      }
      toggle_chat_message_reaction: {
        Args: {
          p_message_id: string
          p_reaction_type: string
          p_user_id: string
        }
        Returns: Json
      }
      toggle_comment_reaction: {
        Args: {
          p_comment_id: string
          p_reaction_type: string
          p_user_id: string
        }
        Returns: Json
      }
      toggle_comment_reply_reaction: {
        Args: { p_reaction_type: string; p_reply_id: string; p_user_id: string }
        Returns: Json
      }
      toggle_reply_reaction: {
        Args: { p_reaction_type: string; p_reply_id: string; p_user_id: string }
        Returns: Json
      }
      toggle_scammer_reaction: {
        Args: {
          p_reaction_type: string
          p_scammer_id: string
          p_user_id: string
        }
        Returns: Json
      }
      track_pageview: { Args: { pageview_data: Json }; Returns: undefined }
      track_visitor: { Args: { visitor_data: Json }; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      report_status: "pending" | "approved" | "rejected"
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
      app_role: ["admin", "moderator", "user"],
      report_status: ["pending", "approved", "rejected"],
    },
  },
} as const
