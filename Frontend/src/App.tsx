import { RouterWrapper } from "./app/router";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <RouterWrapper />
    </>
  );
}

export default App;