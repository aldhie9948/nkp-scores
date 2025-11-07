type AuthFormData = {
  fullname: string;
};

type User = {
  fullname: string;
};

type ParamAPI = {
  keyword?: string;
  take?: string;
  skip?: string;
  include?: string[];
  omit?: string[];
  start_data?: string;
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
  score_history?: any[];
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
  score_history?: any[];
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
