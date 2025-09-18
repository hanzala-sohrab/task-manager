export type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
  user_id: number;
  start_date: string;
  end_date: string;
  jira_link: string;
  created_by: number;
  pull_requests_links: string;
  username: string;
  priority: 'low' | 'medium' | 'high';
}

export type TasksResponse = {
  tasks: Task[];
}
