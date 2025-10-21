import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home";
import { AnimatePresence } from "framer-motion";
import DeliveryInfo from "./pages/delivery-info";
import RegularSales from "./pages/regular-sales";
import ProductCatalogue from "./pages/product-catalog";
import PreOrder from "./pages/preorder";
import MyAccount from "./pages/account";
import Carts from "./pages/cart";
import ProductDetailsPage from "./pages/product-details";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";

const App = () => {
  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/account", element: <MyAccount /> },
    { path: "/delivery-info", element: <DeliveryInfo /> },
    { path: "/regular-sales", element: <RegularSales /> },
    { path: "/product-catalogue", element: <ProductCatalogue /> },
    { path: "/product/:id", element: <ProductDetailsPage /> },
    { path: "/preorder", element: <PreOrder /> },
    { path: "/cart", element: <Carts /> },
    { path: "/auth/login", element: <Login /> },
    { path: "/auth/signup", element: <Signup /> },
  ]);
  return (
    <AnimatePresence mode="wait">
      <RouterProvider router={router} />
    </AnimatePresence>
  );
};

export default App;
