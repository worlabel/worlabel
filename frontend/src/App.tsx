import { RouterProvider } from 'react-router-dom';
import router from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={HTML5Backend}>
        <RouterProvider router={router} />
        <Toaster />
      </DndProvider>
    </QueryClientProvider>
  );
}

export default App;
