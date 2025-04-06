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
  wallet_address: string;
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

// Note: We're keeping the interface definitions for reference,
// but removing all the mock data and implementing real data services

// Service Functions
export const getScammers = () => {
  // This should be implemented with real data in scammerService.ts
  return Promise.resolve([]);
};

export const getScammerById = (id: string) => {
  // This should be implemented with real data in scammerService.ts
  return Promise.resolve(null);
};

export const getScammerComments = (scammerId: string) => {
  // This should be implemented with real data in commentService.ts
  return Promise.resolve([]);
};

export const getProfiles = () => {
  // This should be implemented with real data in profileService.ts
  return Promise.resolve([]);
};

export const getProfileByWallet = (walletAddress: string) => {
  // This should be implemented with real data in profileService.ts
  return Promise.resolve(null);
};

export const getTopScammers = (limit: number = 3) => {
  // This should be implemented with real data in scammerService.ts
  return Promise.resolve([]);
};
