import { useAuth } from "./context/Auth";
import { RouterProvider } from "react-router";
import appRoutes from "./routes";
import Loader from "./components/Loader";
import Error from "./components/Error";

function App() {
  const { isLoading, logout } = useAuth();
  // logout();
  // return <Error />;
  if (isLoading) return <Loader />;
  return <RouterProvider router={appRoutes} />;
}

export default App;
