import React from 'react';
import { Todo } from '../types/todo';
import { useUpdateTodo, useDeleteTodo } from '../hooks/useTodos';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const handleToggleComplete = () => {
    updateTodoMutation.mutate({
      id: todo.id,
      updates: { completed: !todo.completed }
    });
  };

  const handleDelete = () => {
    deleteTodoMutation.mutate(todo.id);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          disabled={updateTodoMutation.isPending}
          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
        <span
          className={`text-sm font-medium ${
            todo.completed
              ? 'text-gray-500 line-through'
              : 'text-gray-900'
          }`}
        >
          {todo.todo}
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
          User {todo.userId}
        </span>
        <button
          onClick={handleDelete}
          disabled={deleteTodoMutation.isPending}
          className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded p-1 disabled:opacity-50"
          title="Delete todo"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
