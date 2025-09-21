import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoService } from '../services/todoService';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/todo';

// Query keys for React Query
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (limit?: number, skip?: number) => [...todoKeys.lists(), { limit, skip }] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
  byUser: (userId: number) => [...todoKeys.all, 'user', userId] as const,
};

// Hook to fetch all todos
export const useTodos = (limit?: number, skip?: number) => {
  return useQuery({
    queryKey: todoKeys.list(limit, skip),
    queryFn: () => todoService.getTodos(limit, skip),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch a single todo
export const useTodo = (id: number) => {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => todoService.getTodoById(id),
    enabled: !!id,
  });
};

// Hook to fetch todos by user ID
export const useTodosByUser = (userId: number) => {
  return useQuery({
    queryKey: todoKeys.byUser(userId),
    queryFn: () => todoService.getTodosByUserId(userId),
    enabled: !!userId,
  });
};

// Hook to create a new todo
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (todoData: CreateTodoRequest) => todoService.createTodo(todoData),
    onSuccess: (newTodo) => {
      // Update the todos list cache
      queryClient.setQueryData(todoKeys.list(), (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          todos: [newTodo, ...oldData.todos],
          total: oldData.total + 1,
        };
      });
      
      // Invalidate and refetch todos
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
};

// Hook to update a todo
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: UpdateTodoRequest }) =>
      todoService.updateTodo(id, updates),
    onSuccess: (updatedTodo) => {
      // Update the specific todo in cache
      queryClient.setQueryData(todoKeys.detail(updatedTodo.id), updatedTodo);
      
      // Update todos list cache
      queryClient.setQueryData(todoKeys.list(), (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          todos: oldData.todos.map((todo: Todo) =>
            todo.id === updatedTodo.id ? updatedTodo : todo
          ),
        };
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
};

// Hook to delete a todo
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => todoService.deleteTodo(id),
    onSuccess: (deletedTodo) => {
      // Remove todo from lists cache
      queryClient.setQueryData(todoKeys.list(), (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          todos: oldData.todos.filter((todo: Todo) => todo.id !== deletedTodo.id),
          total: oldData.total - 1,
        };
      });
      
      // Remove the specific todo from cache
      queryClient.removeQueries({ queryKey: todoKeys.detail(deletedTodo.id) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
};

// Hook to get a random todo
export const useRandomTodo = () => {
  return useQuery({
    queryKey: ['randomTodo'],
    queryFn: () => todoService.getRandomTodo(),
    enabled: false, // Manual fetch
  });
};
