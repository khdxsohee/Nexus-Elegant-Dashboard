
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface StatItem {
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: string;
}

export interface Project {
  id: string;
  name: string;
  progress: number;
  status: 'In Progress' | 'Review' | 'Completed' | 'On Hold';
  priority: 'High' | 'Medium' | 'Low';
  team: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'away' | 'busy';
  avatar: string;
}

export interface SystemLog {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: string;
}

export interface CloudNode {
  region: string;
  load: number;
  latency: number;
  status: 'active' | 'maintenance' | 'offline';
}
