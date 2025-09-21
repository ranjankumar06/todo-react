// Todo item interface based on DummyJSON API
export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

// API response interface for getting all todos
export interface TodosResponse {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
}

// Interface for creating a new todo
export interface CreateTodoRequest {
  todo: string;
  completed: boolean;
  userId: number;
}

// Interface for updating a todo
export interface UpdateTodoRequest {
  completed?: boolean;
  todo?: string;
}

// Generic API error interface
export interface ApiError {
  message: string;
  status?: number;
}
