import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./pages/App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Categories from "./pages/categories/Home.tsx";
import Products from "./pages/products/Home.tsx";
import OrderItemsPage from "./pages/order-items/Home.tsx";
import { ThemeProvider } from "./components/theme/ThemeProvider.tsx";
import Orders from "./pages/orders/Home.tsx";
import PageLayout from "./components/PageLayout.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <BrowserRouter>
          <PageLayout>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/products" element={<Products />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/order-items" element={<OrderItemsPage />} />
            </Routes>
          </PageLayout>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
