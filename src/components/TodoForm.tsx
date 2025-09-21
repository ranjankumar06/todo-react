import React, { useState } from 'react';
import { useCreateTodo } from '../hooks/useTodos';

export const TodoForm: React.FC = () => {
  const [todoText, setTodoText] = useState('');
  const [userId, setUserId] = useState(1);
  const createTodoMutation = useCreateTodo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoText.trim()) return;

    createTodoMutation.mutate(
      {
        todo: todoText.trim(),
        completed: false,
        userId: userId,
      },
      {
        onSuccess: () => {
          setTodoText('');
        },
      }
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Todo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="todo" className="block text-sm font-medium text-gray-700 mb-1">
            Todo Description
          </label>
          <input
            type="text"
            id="todo"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            placeholder="Enter your todo..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
            User ID
          </label>
          <input
            type="number"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
            min="1"
            max="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={createTodoMutation.isPending || !todoText.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createTodoMutation.isPending ? 'Adding...' : 'Add Todo'}
        </button>
        
        {createTodoMutation.isError && (
          <p className="text-red-600 text-sm">
            Failed to add todo. Please try again.
          </p>
        )}
      </form>
    </div>
  );
};
