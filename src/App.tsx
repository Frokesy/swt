import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/home';
import { AnimatePresence } from 'framer-motion';
import DeliveryInfo from './pages/delivery-info';
import RegularSales from './pages/regular-sales';
import ProductCatalogue from './pages/product-catalog';
import PreOrder from './pages/preorder';
import FavoritesPage from './pages/favorites';
import MyAccount from './pages/account';
import Carts from './pages/cart';
import ProductDetailsPage from './pages/product-details';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import ProtectedRoute from './components/defaults/ProtectedRoute';
import Checkout from './pages/checkout';
import Success from './pages/checkout/success';
import Cancel from './pages/checkout/cancel';
import AdminLogin from './pages/admin/login';
import AdminDashboard from './pages/admin/dashboard';
import ProtectedAdminRoute from './components/defaults/ProtectedAdminRoute';

const App = () => {
  const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    {
      path: '/account',
      element: (
        <ProtectedRoute>
          <MyAccount />
        </ProtectedRoute>
      ),
    },
    { path: '/delivery-info', element: <DeliveryInfo /> },
    { path: '/regular-sales', element: <RegularSales /> },
    { path: '/favorites', element: <FavoritesPage /> },
    { path: '/product-catalogue', element: <ProductCatalogue /> },
    {
      path: '/product/:id',
      element: <ProductDetailsPage />,
    },
    {
      path: '/preorder',
      element: (
        <ProtectedRoute>
          <PreOrder />
        </ProtectedRoute>
      ),
    },
    {
      path: '/cart',
      element: (
        <ProtectedRoute>
          <Carts />
        </ProtectedRoute>
      ),
    },
    {
      path: '/checkout',
      element: (
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      ),
    },
    {
      path: '/success',
      element: (
        <ProtectedRoute>
          <Success />
        </ProtectedRoute>
      ),
    },
    {
      path: '/cancel',
      element: (
        <ProtectedRoute>
          <Cancel />
        </ProtectedRoute>
      ),
    },
    { path: '/auth/login', element: <Login /> },
    { path: '/auth/signup', element: <Signup /> },

    // Admin Routes
    { path: '/admin/login', element: <AdminLogin /> },
    {
      path: '/admin/dashboard',
      element: (
        <ProtectedAdminRoute>
          <AdminDashboard />
        </ProtectedAdminRoute>
      ),
    },
  ]);
  return (
    <AnimatePresence mode="wait">
      <RouterProvider router={router} />
    </AnimatePresence>
  );
};

export default App;
