import React, { useState } from 'react';
import { useTodos } from '../hooks/useTodos';
import { TodoItem } from './TodoItem';
import { TodoForm } from './TodoForm';

export const TodoList: React.FC = () => {
  const [limit, setLimit] = useState(30);
  const [currentPage, setCurrentPage] = useState(0);
  const skip = currentPage * limit;
  
  const { data, isLoading, isError, error } = useTodos(limit, skip);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    if (data && skip + limit < data.total) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 0;
  const currentPageNumber = currentPage + 1;

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Todos</h2>
          <p className="text-red-600">
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Todo App</h1>
        <p className="text-gray-600">Manage your tasks with React Query</p>
      </div>

      {/* Add Todo Form */}
      <TodoForm />

      {/* Todos List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              All Todos {data && `(${data.total} total)`}
            </h2>
            <div className="flex items-center space-x-2">
              <label htmlFor="limit" className="text-sm text-gray-600">Show:</label>
              <select
                id="limit"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setCurrentPage(0); // Reset to first page
                }}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : data && data.todos.length > 0 ? (
            <div className="space-y-3">
              {data.todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No todos found</h3>
              <p className="text-gray-500">Get started by adding your first todo!</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {data && data.total > limit && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {skip + 1} to {Math.min(skip + limit, data.total)} of {data.total} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPageNumber} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={skip + limit >= data.total}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
