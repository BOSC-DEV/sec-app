
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

// Mock Scammers Data
export const mockScammers: Scammer[] = [
  {
    id: "scm-001",
    name: "Alexander 'Crypto King' Davis",
    photo_url: "https://picsum.photos/500/500?random=1",
    accused_of: "Running a fraudulent ICO that collected over $4.5 million from investors before disappearing. Created fake LinkedIn profiles and tech demos.",
    links: ["https://twitter.com/fakecryptodavis", "https://scamcoin.io"],
    aliases: ["Alex Davis", "Alexander K.", "Crypto Investment Advisor"],
    accomplices: ["Jane Smith", "Michael Roberts"],
    official_response: "Currently under investigation by the SEC for securities fraud.",
    bounty_amount: 25000,
    wallet_address: "0x1a2b3c4d5e6f7g8h9i0j",
    date_added: "2023-09-15T14:22:31Z",
    added_by: "0xabcdef1234567890",
    likes: 342,
    dislikes: 25,
    views: 7890,
    shares: 123,
    comments: ["cmt-001", "cmt-002"]
  },
  {
    id: "scm-002",
    name: "Rebecca 'Yield Queen' Johnson",
    photo_url: "https://picsum.photos/500/500?random=2",
    accused_of: "Created a Ponzi scheme DeFi platform that promised 300% APY. Collected over $2.8 million before the smart contract was drained.",
    links: ["https://yieldfarm.scam", "https://t.me/yieldscamgroup"],
    aliases: ["Becca J", "Yield Master", "DeFi Expert"],
    accomplices: ["Tom Wilson", "Sarah Parker"],
    official_response: "No formal charges yet, but multiple class-action lawsuits are pending.",
    bounty_amount: 15000,
    wallet_address: "0x9i8u7y6t5r4e3w2q1",
    date_added: "2023-10-22T09:12:45Z",
    added_by: "0xfedcba0987654321",
    likes: 289,
    dislikes: 31,
    views: 5432,
    shares: 95,
    comments: ["cmt-003"]
  },
  {
    id: "scm-003",
    name: "Carlos 'NFT Wizard' Mendez",
    photo_url: "https://picsum.photos/500/500?random=3",
    accused_of: "Sold fake 'exclusive' NFT access to celebrity content and events. None of the celebrities were involved or aware of the project.",
    links: ["https://celebnfts.fake", "https://opensea.io/fakecollection"],
    aliases: ["Carl M", "NFT Guru", "Celebrity Connector"],
    accomplices: ["David Lee"],
    official_response: "Under investigation for fraud and copyright infringement.",
    bounty_amount: 10000,
    wallet_address: "0x2w3e4r5t6y7u8i9o0p",
    date_added: "2023-11-05T16:45:12Z",
    added_by: "0x123456789abcdef0",
    likes: 178,
    dislikes: 42,
    views: 3567,
    shares: 67,
    comments: ["cmt-004", "cmt-005", "cmt-006"]
  },
  {
    id: "scm-004",
    name: "Elena 'Dex Master' Volkov",
    photo_url: "https://picsum.photos/500/500?random=4",
    accused_of: "Created a fake DEX with a backdoor that drained user's wallets when they approved token permissions.",
    links: ["https://swapxfast.io", "https://t.me/fakedexgroup"],
    aliases: ["EV Trader", "Swap Queen", "Liquidity Expert"],
    accomplices: ["Unknown"],
    official_response: "Multiple reports filed with the FBI's Internet Crime Complaint Center.",
    bounty_amount: 30000,
    wallet_address: "0x3e4r5t6y7u8i9o0p1q",
    date_added: "2023-12-18T11:32:56Z",
    added_by: "0xabcdef1234567890",
    likes: 423,
    dislikes: 19,
    views: 9876,
    shares: 215,
    comments: []
  },
  {
    id: "scm-005",
    name: "Marcus 'Lending Pro' Williams",
    photo_url: "https://picsum.photos/500/500?random=5",
    accused_of: "Operated a fraudulent crypto lending platform that collapsed after collecting over $7 million in deposits.",
    links: ["https://cryptolending.scam", "https://twitter.com/lendingpro"],
    aliases: ["Mark W", "Loan Expert", "Investment Manager"],
    accomplices: ["Patricia Brown", "James Taylor"],
    official_response: "Arrest warrant issued in multiple jurisdictions.",
    bounty_amount: 45000,
    wallet_address: "0x4r5t6y7u8i9o0p1q2w",
    date_added: "2024-01-10T08:23:45Z",
    added_by: "0xfedcba0987654321",
    likes: 531,
    dislikes: 37,
    views: 12453,
    shares: 287,
    comments: ["cmt-007", "cmt-008"]
  },
  {
    id: "scm-006",
    name: "Olivia 'Stake & Take' Chen",
    photo_url: "https://picsum.photos/500/500?random=6",
    accused_of: "Created a fake staking platform that promised 150% APY on stablecoins. Disappeared with over $3.5 million in user funds.",
    links: ["https://stablestake.io", "https://discord.gg/fakestaking"],
    aliases: ["Liv C", "Staking Expert", "Passive Income Guru"],
    accomplices: ["Kevin Zhang"],
    official_response: "Under investigation by multiple international agencies.",
    bounty_amount: 20000,
    wallet_address: "0x5t6y7u8i9o0p1q2w3e",
    date_added: "2024-02-05T15:11:23Z",
    added_by: "0x123456789abcdef0",
    likes: 267,
    dislikes: 29,
    views: 6789,
    shares: 142,
    comments: ["cmt-009"]
  }
];

// Mock Profiles Data
export const mockProfiles: Profile[] = [
  {
    id: "prf-001",
    wallet_address: "0xabcdef1234567890",
    display_name: "Crypto Detective",
    username: "crypto_detective",
    profile_pic_url: "https://picsum.photos/200/200?random=101",
    created_at: "2023-08-12T10:23:45Z",
    x_link: "https://x.com/crypto_detective",
    website_link: "https://cryptodetective.io",
    bio: "Exposing scammers and protecting the crypto community since 2017.",
    points: 1250
  },
  {
    id: "prf-002",
    wallet_address: "0xfedcba0987654321",
    display_name: "Blockchain Guardian",
    username: "block_guardian",
    profile_pic_url: "https://picsum.photos/200/200?random=102",
    created_at: "2023-07-05T16:12:34Z",
    x_link: "https://x.com/block_guardian",
    website_link: "",
    bio: "Security researcher on a mission to make crypto safer for everyone.",
    points: 975
  },
  {
    id: "prf-003",
    wallet_address: "0x123456789abcdef0",
    display_name: "Crypto Watchdog",
    username: "cryptowatchdog",
    profile_pic_url: "https://picsum.photos/200/200?random=103",
    created_at: "2023-09-22T14:45:12Z",
    x_link: "https://x.com/cryptowatchdog",
    website_link: "https://cryptowatchdog.net",
    bio: "Former cybersecurity professional now tracking crypto scams full-time.",
    points: 1340
  }
];

// Mock Comments Data
export const mockComments: Comment[] = [
  {
    id: "cmt-001",
    scammer_id: "scm-001",
    content: "I lost 2 ETH to this scammer. Their project website looked very professional, but all the team members were fake.",
    author: "0xfedcba0987654321",
    author_name: "Blockchain Guardian",
    author_profile_pic: "https://picsum.photos/200/200?random=102",
    created_at: "2023-09-16T09:34:21Z",
    likes: 45,
    dislikes: 2,
    views: 230
  },
  {
    id: "cmt-002",
    scammer_id: "scm-001",
    content: "I've been tracking this individual for months. They've operated under different names in at least 3 other scam projects.",
    author: "0x123456789abcdef0",
    author_name: "Crypto Watchdog",
    author_profile_pic: "https://picsum.photos/200/200?random=103",
    created_at: "2023-09-18T11:23:45Z",
    likes: 67,
    dislikes: 1,
    views: 312
  },
  {
    id: "cmt-003",
    scammer_id: "scm-002",
    content: "Classic Ponzi scheme structure. They used early investors' money to pay returns to create FOMO.",
    author: "0xabcdef1234567890",
    author_name: "Crypto Detective",
    author_profile_pic: "https://picsum.photos/200/200?random=101",
    created_at: "2023-10-23T15:45:12Z",
    likes: 38,
    dislikes: 3,
    views: 198
  },
  {
    id: "cmt-004",
    scammer_id: "scm-003",
    content: "Their Discord server disappeared overnight along with all the promises of celebrity collaborations.",
    author: "0xfedcba0987654321",
    author_name: "Blockchain Guardian",
    author_profile_pic: "https://picsum.photos/200/200?random=102",
    created_at: "2023-11-06T10:12:34Z",
    likes: 29,
    dislikes: 0,
    views: 167
  },
  {
    id: "cmt-005",
    scammer_id: "scm-003",
    content: "I reached out to one of the celebrities they claimed was involved, and they confirmed they had no connection to this project.",
    author: "0x123456789abcdef0",
    author_name: "Crypto Watchdog",
    author_profile_pic: "https://picsum.photos/200/200?random=103",
    created_at: "2023-11-07T14:23:45Z",
    likes: 52,
    dislikes: 1,
    views: 243
  },
  {
    id: "cmt-006",
    scammer_id: "scm-003",
    content: "Their contract had a hidden mint function that allowed them to create unlimited NFTs despite claiming a limited supply.",
    author: "0xabcdef1234567890",
    author_name: "Crypto Detective",
    author_profile_pic: "https://picsum.photos/200/200?random=101",
    created_at: "2023-11-09T16:34:21Z",
    likes: 41,
    dislikes: 2,
    views: 215
  },
  {
    id: "cmt-007",
    scammer_id: "scm-005",
    content: "This platform never had proper security audits despite claiming they did. Red flag from the beginning.",
    author: "0x123456789abcdef0",
    author_name: "Crypto Watchdog",
    author_profile_pic: "https://picsum.photos/200/200?random=103",
    created_at: "2024-01-12T09:45:12Z",
    likes: 33,
    dislikes: 4,
    views: 189
  },
  {
    id: "cmt-008",
    scammer_id: "scm-005",
    content: "I've been able to track some of the stolen funds to exchanges. Working with authorities to freeze the accounts.",
    author: "0xabcdef1234567890",
    author_name: "Crypto Detective",
    author_profile_pic: "https://picsum.photos/200/200?random=101",
    created_at: "2024-01-15T11:23:45Z",
    likes: 58,
    dislikes: 0,
    views: 276
  },
  {
    id: "cmt-009",
    scammer_id: "scm-006",
    content: "They copied another legitimate staking platform's UI to appear trustworthy. Always verify contract addresses!",
    author: "0xfedcba0987654321",
    author_name: "Blockchain Guardian",
    author_profile_pic: "https://picsum.photos/200/200?random=102",
    created_at: "2024-02-07T13:34:21Z",
    likes: 47,
    dislikes: 1,
    views: 231
  }
];

// Service Functions
export const getScammers = () => {
  return Promise.resolve(mockScammers);
};

export const getScammerById = (id: string) => {
  const scammer = mockScammers.find(s => s.id === id);
  return Promise.resolve(scammer);
};

export const getScammerComments = (scammerId: string) => {
  const comments = mockComments.filter(c => c.scammer_id === scammerId);
  return Promise.resolve(comments);
};

export const getProfiles = () => {
  return Promise.resolve(mockProfiles);
};

export const getProfileByWallet = (walletAddress: string) => {
  const profile = mockProfiles.find(p => p.wallet_address === walletAddress);
  return Promise.resolve(profile);
};

export const getTopScammers = (limit: number = 3) => {
  return Promise.resolve(
    [...mockScammers]
      .sort((a, b) => b.bounty_amount - a.bounty_amount)
      .slice(0, limit)
  );
};
