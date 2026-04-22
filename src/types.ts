export interface CommitFileInfo {
  path: string;
  added: number;
  deleted: number;
}

export type FileType = 'test' | 'plan' | 'impl' | 'config' | 'docs';

export interface CommitData {
  hash: string;
  timestamp: number;
  message: string;
  files: CommitFileInfo[];
  lines_added: number;
  lines_deleted: number;
  ai_detected: boolean;
  repoCIEnabled: boolean;
}

export interface CommitScore {
  think_score: number;
  test_score: number;
  verify_score: number;
  overall_score: number;
}

export interface CommitResult extends CommitData, CommitScore {
  xp_earned: number;
  hp_change: number;
  has_tests: boolean;
  has_plans: boolean;
}

export type Species = 'dragon' | 'cat' | 'owl' | 'octopus' | 'wolf';

export type Mood = 'happy' | 'hungry' | 'sick' | 'sleeping' | 'excited';

export type Stage = 1 | 2 | 3 | 4;

export interface PetState {
  id: string;
  species: Species;
  name: string;
  stage: Stage;
  evo_variant: string | null;
  hp: number;
  xp: number;
  level: number;
  coins: number;
  streak: number;
  longest_streak: number;
  last_commit_date: string | null;
  mood: Mood;
  created_at: string;
}

export interface Grade {
  grade: string;
  title: string;
  xp: number;
  hp: number;
}

export interface QuestState {
  quest_id: string;
  title: string;
  description: string;
  completed: boolean;
  progress: number;
  reward_coins: number;
  reward_xp: number;
}

export interface AchievementDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  check: (ctx: AchievementContext) => { unlocked: boolean; progress: number };
}

export interface AchievementContext {
  pet: PetState;
  totalCommits: number;
  highTestScoreCommits: number;
  highThinkScoreCommits: number;
  allQuestsCompletedToday: boolean;
}

export interface AchievementState {
  id: string;
  unlocked_at: string | null;
  progress: number;
}

export interface DailySummary {
  date: string;
  avg_score: number;
  commit_count: number;
  quests_completed: number;
  xp_earned: number;
}
