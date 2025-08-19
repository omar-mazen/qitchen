import { useAuth } from "./context/Auth";
import { RouterProvider } from "react-router";
import appRoutes from "./routes";
import Loader from "./components/Loader";

function App() {
  const { isLoading } = useAuth();
  if (isLoading) return <Loader />;
  return <RouterProvider router={appRoutes} />;
}

export default App;
