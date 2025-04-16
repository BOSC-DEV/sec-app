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
  deleted_at: string | null;
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
  sec_balance?: number;
  reports_count?: number;
  likes_count?: number;
  views_count?: number;
  comments_count?: number;
  bounty_amount?: number;
  bounties_raised?: number;
  last_activity?: string;
  total_bounty?: number;
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
  author_username?: string;
  author_profile_pic?: string;
  created_at: string;
  likes: number;
  dislikes: number;
  views: number;
  survey_data?: SurveyData | null;
}

export interface SurveyData {
  title: string;
  options: SurveyOption[];
}

export interface SurveyOption {
  text: string;
  votes: number;
  voters: SurveyVoter[];
}

export interface SurveyVoter {
  userId: string;
  badgeTier: string;
  username?: string;
  displayName?: string;
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
  likes: number;
  dislikes: number;
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
  likes: number;
  dislikes: number;
}

export enum NotificationType {
  LIKE = 'like',
  COMMENT = 'comment',
  BOUNTY = 'bounty',
  REACTION = 'reaction',
  MENTION = 'mention',
  SYSTEM = 'system',
  DISLIKE = 'dislike'
}

export enum EntityType {
  scammer = 'scammer',
  announcement = 'announcement',
  reply = 'reply',
  comment = 'comment',
  chat_message = 'chat_message',
  survey = 'survey'
}

export interface Notification {
  id: string;
  recipient_id: string;
  type: NotificationType;
  content: string;
  entity_id: string;
  entity_type: EntityType;
  actor_id?: string;
  actor_name?: string;
  actor_username?: string;
  actor_profile_pic?: string;
  created_at: string;
  is_read: boolean;
}
