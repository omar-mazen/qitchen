import { useAuth } from "@/hooks/useAuth";
import { RouterProvider } from "react-router";
import Loader from "./components/Loader";
import { dashboardRoutes, userRoutes } from "./routes";

function App() {
  const { isLoading, user, isAuthenticated } = useAuth();

  if (isLoading) return <Loader />;

  const router =
    user?.role === "User" || !isAuthenticated ? userRoutes : dashboardRoutes;

  return <RouterProvider router={router} />;
}

export default App;
