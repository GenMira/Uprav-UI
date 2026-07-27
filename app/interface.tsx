export interface TaskRequest {
  name: string;
  priority: number;
  deadline: string;
  is_everyday: boolean;
  tag?: string|null;
  description?: string| null;
  period?: string | null;
  group?: string | null;
  assignee?: number | null;
  assignGroup?: string | null;
}

export interface Task {
  id:number;
  name: string;
  priority: number;
  deadline: string;
  is_everyday: boolean;
  tag?: string|null;
  description?: string| null;
  period?: string | null;
  group?: string | null;
  assigner?: string | null;
  assign_group?: string | null;
}

export interface GroupMember {
  uid: number;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  members: [GroupMember, ...GroupMember[]]; 
}

export interface ShowTaskProps {
  setEditingTaskID: (id: number | null) => void;
  setActiveTab: (tab: string) => void;
}