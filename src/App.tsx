import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home";
import { AnimatePresence } from "framer-motion";

const App = () => {
  const router = createBrowserRouter([{ path: "/", element: <Home /> }]);
  return (
    <AnimatePresence mode="wait">
      <RouterProvider router={router} />
    </AnimatePresence>
  );
};

export default App;
