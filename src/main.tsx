import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@style/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./context/Auth.tsx";
import CartProvider from "./context/CartContext/index.tsx";
import { LoadingProvider } from "./context/LoadingContext.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true,
    },
  },
});
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
  }
}
window.__TANSTACK_QUERY_CLIENT__ = queryClient;
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryDevtools client={queryClient} initialIsOpen={false} />
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <AuthProvider>
          <CartProvider>
            <ToastContainer toastClassName=" !bg-background-muted !text-primary" />
            <App />
          </CartProvider>
        </AuthProvider>
      </LoadingProvider>
    </QueryClientProvider>
  </StrictMode>
);
