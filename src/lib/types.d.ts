type AuthFormData = {
  fullname: string;
};

type UserRole = 'user' | 'guest' | 'admin';

type User = {
  fullname: string;
  role: UserRole;
};

type ParamAPI = {
  keyword?: string;
  take?: string;
  skip?: string;
  include?: string[];
  omit?: string[];
  start_date?: string;
  end_date?: string;
  order_index?: string;
  order_sort?: 'asc' | 'desc';
};

type Employee = {
  fullname: string;
  departemen: string;
};

type SelectOptionType = { value: any; label: string };
type SelectOptionsType = SelectOptionType[];
type SelectGroupType = {
  label: string;
  options: SelectOptionsType;
};

type SimpleResponseAPI = { status: 'OK' };

type Team = {
  id: string;
  name: string;
  members: string[];
  created_at: string;
  updated_at: string;
  score_history?: ScoreHistory[];
};

type TeamFormData = Pick<Team, 'name' | 'members'>;

type GameFormData = Pick<Game, 'name'> & {
  scores: Pick<Score, 'range_start' | 'range_end' | 'value'>[];
};

type Game = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  score?: Score[];
  score_history?: ScoreHistory[];
};

type Score = {
  id: string;
  game_id: string;
  range_start: number;
  range_end: number;
  value: number;
  created_at: string;
  updated_at: string;
  game?: Game;
};

type ScoreHistory = {
  id: string;
  game_id: string;
  game_name: string;
  team_id: string;
  team_name: string;
  team_members: string[];
  score: number;
  value: number;
  ref?: string;
  created_at: string;
  updated_at: string;
  game?: Game;
  team?: Team;
  is_deleted: boolean;
};

type ScoreHistoryFormData = Pick<ScoreHistory, 'game_id' | 'team_id' | 'score' | 'value' | 'ref'>;

type ScoreDashboard = {
  score: number | null;
  value: number | null;
  team_id: string;
};
