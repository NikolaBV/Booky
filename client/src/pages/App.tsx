import Home from "./home/Home";
import { ThemeProvider } from "../components/theme/ThemeProvider";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <Home />
    </ThemeProvider>
  );
}

export default App;
