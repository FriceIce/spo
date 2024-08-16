import Sidebar from "./components/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-black h-screen">
        <Sidebar />
        <Home />
      </div>
    </QueryClientProvider>
  );
}

export default App;
