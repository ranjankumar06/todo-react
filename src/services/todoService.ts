import { Todo, TodosResponse, CreateTodoRequest, UpdateTodoRequest } from '../types/todo';

const BASE_URL = 'https://dummyjson.com';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const todoService = {
  // Get all todos with optional limit and skip parameters
  async getTodos(limit: number = 30, skip: number = 0): Promise<TodosResponse> {
    const response = await fetch(`${BASE_URL}/todos?limit=${limit}&skip=${skip}`);
    return handleResponse(response);
  },

  // Get a single todo by ID
  async getTodoById(id: number): Promise<Todo> {
    const response = await fetch(`${BASE_URL}/todos/${id}`);
    return handleResponse(response);
  },

  // Get todos by user ID
  async getTodosByUserId(userId: number): Promise<TodosResponse> {
    const response = await fetch(`${BASE_URL}/todos/user/${userId}`);
    return handleResponse(response);
  },

  // Create a new todo
  async createTodo(todoData: CreateTodoRequest): Promise<Todo> {
    const response = await fetch(`${BASE_URL}/todos/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    });
    return handleResponse(response);
  },

  // Update an existing todo
  async updateTodo(id: number, updates: UpdateTodoRequest): Promise<Todo> {
    const response = await fetch(`${BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    return handleResponse(response);
  },

  // Delete a todo
  async deleteTodo(id: number): Promise<Todo> {
    const response = await fetch(`${BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Get a random todo
  async getRandomTodo(): Promise<Todo> {
    const response = await fetch(`${BASE_URL}/todos/random`);
    return handleResponse(response);
  },
};
