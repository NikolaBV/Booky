import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./pages/App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Categories from "./pages/categories/Home.tsx";
import Products from "./pages/products/Home.tsx";
import { ThemeProvider } from "./components/theme/ThemeProvider.tsx";
import Orders from "./pages/orders/Home.tsx";
import PageLayout from "./components/PageLayout.tsx";
import SignIn from "./pages/auth/sign-in/SignIn.tsx";
import SignUp from "./pages/auth/sign-up/SignUp.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import OrderItems from "./pages/order-items/Home.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <BrowserRouter>
          <PageLayout>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/auth/signIn" element={<SignIn />} />
              <Route path="/auth/signUp" element={<SignUp />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/orders" element={<Orders />} />
                <Route path="/products" element={<Products />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/order-items" element={<OrderItems />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PageLayout>
          <Toaster position="top-center" />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
