
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
  last_activity?: string;
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
  amount: number;
  comment: string;
  contributor_id: string;
  contributor_name: string;
  contributor_profile_pic?: string;
  transaction_signature?: string;
  created_at: string;
  // Joined data
  scammers?: {
    id: string;
    name: string;
    photo_url: string;
  };
}
