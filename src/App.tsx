import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home";
import { AnimatePresence } from "framer-motion";
import DeliveryInfo from "./pages/delivery-info";

const App = () => {
  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/delivery-info", element: <DeliveryInfo /> },
  ]);
  return (
    <AnimatePresence mode="wait">
      <RouterProvider router={router} />
    </AnimatePresence>
  );
};

export default App;
