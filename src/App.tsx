import { useAuth } from "./context/Auth";
import { RouterProvider } from "react-router";
import Loader from "./components/Loader";
import { dashboardRoutes, userRoutes } from "./routes";

function App() {
  const { isLoading, user, isAuthenticated } = useAuth();
  if (isLoading) return <Loader />;
  return (
    <RouterProvider
      router={
        user?.role == "User" || !isAuthenticated ? userRoutes : dashboardRoutes
      }
    />
  );
}

export default App;
