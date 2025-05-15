import { useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between p-1">
      <div className="ml-5">
        <h2
          className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Booky
        </h2>
      </div>
      <div className="flex justify-end max-w-screen-xl flex-wrap items-center mr-5">
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
      </div>
    </div>
  );
}
