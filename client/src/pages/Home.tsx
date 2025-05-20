import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useCurrentUser } from "../hooks/useAuth";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useCurrentUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        Welcome to Booky
      </h1>
      <p className="leading-7 mb-8 max-w-lg text-muted-foreground">
        Your complete book store management system. Manage orders, products,
        categories, and more.
      </p>

      <div className="flex gap-4">
        {isAuthenticated ? (
          <Button size="lg" onClick={() => navigate("/orders")}>
            Go to Orders
          </Button>
        ) : (
          <>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth/signIn")}
            >
              Sign In
            </Button>
            <Button size="lg" onClick={() => navigate("/auth/signUp")}>
              Sign Up
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
