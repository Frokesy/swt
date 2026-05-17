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
import ResetPassword from './pages/auth/reset-password';
import ProtectedRoute from './components/defaults/ProtectedRoute';
import Checkout from './pages/checkout';
import Success from './pages/checkout/success';
import Cancel from './pages/checkout/cancel';
import AdminLogin from './pages/admin/login';
import AdminDashboard from './pages/admin/dashboard';
import AdminProducts from './pages/admin/products';
import CreateProduct from './pages/admin/products/create';
import EditProduct from './pages/admin/products/edit';
import ProtectedAdminRoute from './components/defaults/ProtectedAdminRoute';
import AdminOrders from './pages/admin/orders';
import OrderDetail from './pages/admin/orders/detail';
import AdminPreorders from './pages/admin/preorders';
import PreorderDetail from './pages/admin/preorders/detail';
import AdminCustomers from './pages/admin/customers';
import CustomerDetail from './pages/admin/customers/detail';
import AdminDeliverySettings from './pages/admin/delivery';
import AdminReviews from './pages/admin/reviews';

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
    { path: '/auth/reset-password', element: <ResetPassword /> },

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
    {
      path: '/admin/products',
      element: (
        <ProtectedAdminRoute>
          <AdminProducts />
        </ProtectedAdminRoute>
      ),
    },
    {
      path: '/admin/products/create',
      element: (
        <ProtectedAdminRoute>
          <CreateProduct />
        </ProtectedAdminRoute>
      ),
    },
    {
      path: '/admin/products/:id',
      element: (
        <ProtectedAdminRoute>
          <EditProduct />
        </ProtectedAdminRoute>
      ),
    },
    {
      path: '/admin/orders',
      element: (
        <ProtectedAdminRoute>
          <AdminOrders />
        </ProtectedAdminRoute>
      ),
    },
    {
      path: '/admin/orders/:id',
      element: (
        <ProtectedAdminRoute>
          <OrderDetail />
        </ProtectedAdminRoute>
      ),
    },
    {
      path: '/admin/preorders',
      element: (
        <ProtectedAdminRoute>
          <AdminPreorders />
        </ProtectedAdminRoute>
      ),
    },
    {
      path: '/admin/preorders/:id',
      element: (
        <ProtectedAdminRoute>
          <PreorderDetail />
        </ProtectedAdminRoute>
      ),
    },
    {
      path: '/admin/customers',
      element: (
        <ProtectedAdminRoute>
          <AdminCustomers />
        </ProtectedAdminRoute>
      ),
    },
    {
      path: '/admin/customers/:id',
      element: (
        <ProtectedAdminRoute>
          <CustomerDetail />
        </ProtectedAdminRoute>
      ),
    },
    {
      path: '/admin/reviews',
      element: (
        <ProtectedAdminRoute>
          <AdminReviews />
        </ProtectedAdminRoute>
      ),
    },
    {
      path: '/admin/delivery',
      element: (
        <ProtectedAdminRoute>
          <AdminDeliverySettings />
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
