import { RouterWrapper } from './app/router';
import { Toaster } from 'sonner';
import { useSocket } from './hooks/useSocket';
import { NotificationProvider } from './context/NotificationContext';

function AppContent() {
  useSocket();
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <RouterWrapper />
    </>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

export default App;
