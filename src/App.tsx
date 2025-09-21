import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TodoList } from './components/TodoList';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <TodoList />
      </div>
    </QueryClientProvider>
  );
}

export default App;
