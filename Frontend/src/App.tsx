import { RouterWrapper } from './app/router';
import { Toaster } from 'sonner';
import { useSocket } from './hooks/useSocket';
function App() {
  useSocket()
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <RouterWrapper />
    </>
  );
}

export default App;
