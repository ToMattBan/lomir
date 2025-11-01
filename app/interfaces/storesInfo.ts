export interface IUsersFileInfo {
  sha: string;
  content: { [key: string]: IUser; };
  refreshInfo: (() => Promise<void>) | null;
}

export interface IUser {
  name: string;
  race: string;
  image: string;
  backstory: string;
  attributes: {
    strength: number;
    agility: number;
    focus: number;
    resistency: number;
  };
  equipment: {
    gold: number;
    weapon: string;
    armor: string;
    other: string[];
  };
}

export interface ICampaignFileInfo {
  sha: string;
  checklist: string[];
  refreshInfo: (() => Promise<void>) | null;
}
