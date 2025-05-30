import { useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { Button } from "./ui/button";
import { useCurrentUser, useLogout } from "../hooks/useAuth";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, username } = useCurrentUser();
  const { logout } = useLogout();

  return (
    <div className="flex justify-between p-1 items-center">
      <div className="ml-5">
        <h2
          className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Booky
        </h2>
      </div>

      <div className="flex justify-end max-w-screen-xl flex-wrap items-center mr-5">
        {isAuthenticated ? (
          <>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink onClick={() => navigate("/orders")}>
                    Orders
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink onClick={() => navigate("/products")}>
                    Products
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink onClick={() => navigate("/categories")}>
                    Categories
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink onClick={() => navigate("/order-items")}>
                    Order Items
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="ml-4 flex items-center gap-4">
              <span className="text-sm font-medium">Welcome, {username}</span>
              <Button onClick={() => logout()} variant="outline">
                Sign Out
              </Button>
            </div>
          </>
        ) : (
          <div className="flex gap-4">
            <Button onClick={() => navigate("/auth/signIn")} variant="outline">
              Sign In
            </Button>
            <Button onClick={() => navigate("auth/signUp")}>Sign Up</Button>
          </div>
        )}
      </div>
    </div>
  );
}
