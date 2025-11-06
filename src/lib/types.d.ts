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
