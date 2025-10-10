export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
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
