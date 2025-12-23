export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'backlog' | 'todo' | 'in-progress' | 'done';
export type DependencyType = 'FS' | 'SS' | 'FF';

export interface Dependency {
  taskId: string;
  type: DependencyType;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  priority: Priority;
  status: Status;
  category?: string;
  color: string;
  dependencies: Dependency[];
  createdAt: Date;
  updatedAt: Date;
}
