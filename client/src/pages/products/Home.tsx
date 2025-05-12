import { ThemeProvider } from "../../components/theme/ThemeProvider";
import { ThemeToggle } from "../../components/theme/ThemeToggle";

export default function Products() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <div className="min-h-screen bg-background text-foreground">
        <header className="flex justify-between items-center p-4 border-b border-border">
          <h1 className="text-2xl font-bold">Products</h1>
          <ThemeToggle />
        </header>

        <main className="p-4">
          <h2 className="text-xl font-semibold mb-4">Product List</h2>
          <p>Your product content will go here</p>
        </main>
      </div>
    </ThemeProvider>
  );
}
