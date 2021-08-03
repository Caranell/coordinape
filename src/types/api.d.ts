export interface PostProfileParam {
  bio?: string;
  skills?: string[];
  twitter_username?: string;
  github_username?: string;
  telegram_username?: string;
  discord_username?: string;
  medium_username?: string;
  website?: string;
}

export interface PostTokenGiftsParam {
  tokens: number;
  recipient_id: number;
  note?: string;
}

export interface PostUsersParam {
  name: string;
  address: string;
  non_giver?: number;
  fixed_non_receiver?: number;
  role?: number;
  starting_tokens?: number;
}

export interface UpdateUsersParam {
  name: string;
  address: string;
  non_giver?: number;
  fixed_non_receiver?: number;
  role?: number;
  starting_tokens?: number;
}

export interface PutUsersParam {
  name?: string;
  bio?: string;
  epoch_first_visit?: number;
  non_receiver?: number;
  non_giver?: number;
}

export interface PostCirclesParam {
  name: string;
}

export interface PutCirclesParam {
  name: string;
  token_name: string;
  team_sel_text?: string;
  alloc_text?: string;
}

export interface UpdateCreateEpochParam {
  start_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  repeat: number; // (0 = no repeat, 1 = weekly, 2 = monthly)
  days: number; // (minimum 1 - 100 maximum)
  grant?: number; // decimal
}

export interface NominateUserParam {
  name: string;
  address: string;
  description: string;
}
