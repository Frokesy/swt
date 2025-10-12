import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home";
import { AnimatePresence } from "framer-motion";
import DeliveryInfo from "./pages/delivery-info";
import RegularSales from "./pages/regular-sales";
import ProductCatalogue from "./pages/product-catalog";
import PreOrder from "./pages/preorder";

const App = () => {
  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/delivery-info", element: <DeliveryInfo /> },
    { path: "/regular-sales", element: <RegularSales /> },
    { path: "/product-catalogue", element: <ProductCatalogue /> },
    { path: "/preorder", element: <PreOrder /> },
  ]);
  return (
    <AnimatePresence mode="wait">
      <RouterProvider router={router} />
    </AnimatePresence>
  );
};

export default App;
