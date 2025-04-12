
export interface Scammer {
  id: string;
  name: string;
  photo_url: string;
  accused_of: string;
  links: string[];
  aliases: string[];
  accomplices: string[];
  official_response: string;
  bounty_amount: number;
  wallet_addresses: string[];
  date_added: string;
  added_by: string;
  likes: number;
  dislikes: number;
  views: number;
  shares: number;
  comments: string[];
}

export interface Profile {
  id: string;
  wallet_address: string;
  display_name: string;
  username: string;
  profile_pic_url: string;
  created_at: string;
  x_link: string;
  website_link: string;
  bio: string;
  points: number;
  // Additional fields for leaderboard
  reports_count?: number;
  likes_count?: number;
  views_count?: number;
  comments_count?: number;
  bounty_amount?: number;
  bounties_raised?: number;
  last_activity?: string;
  total_bounty?: number; // Added field: sum of bounty_amount and bounties_raised
}

export interface Comment {
  id: string;
  scammer_id: string;
  content: string;
  author: string;
  author_name: string;
  author_profile_pic: string;
  created_at: string;
  likes: number;
  dislikes: number;
  views: number;
}

export interface BountyContribution {
  id: string;
  scammer_id: string;
  contributor_id: string;
  contributor_name: string;
  contributor_profile_pic?: string;
  amount: number;
  created_at: string;
  comment?: string;
  transaction_signature?: string;
  scammers?: Scammer;
  is_active?: boolean;
  transferred_from_id?: string;
  transferred_to_id?: string;
}

// Community feature types
export interface Announcement {
  id: string;
  content: string;
  author_id: string;
  author_name: string;
  author_username: string;
  author_profile_pic?: string;
  created_at: string;
}

export interface AnnouncementReply {
  id: string;
  announcement_id: string;
  content: string;
  author_id: string;
  author_name: string;
  author_username?: string;
  author_profile_pic?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  author_id: string;
  author_name: string;
  author_username?: string;
  author_profile_pic?: string;
  image_url?: string;
  created_at: string;
}

export interface MessageReaction {
  id: string;
  announcement_id?: string;
  message_id?: string;
  reply_id?: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}
