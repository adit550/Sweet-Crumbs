import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Layouts & Auth
import { AdminLayout } from './components/layouts/AdminLayout';
import { CustomerLayout } from './components/layouts/CustomerLayout';
import { CustomerAccountLayout } from './components/layouts/CustomerAccountLayout';
import { AdminRoute } from './components/auth/AdminRoute';
import { CustomerRoute } from './components/auth/CustomerRoute';

// Auth Pages
import { AdminLogin } from './pages/auth/AdminLogin';
import { CustomerLogin } from './pages/auth/CustomerLogin';
import { CustomerRegister } from './pages/auth/CustomerRegister';

// Customer Public Pages
import { Home } from './pages/customer/Home';
import { Menu } from './pages/customer/Menu';
import { ProductDetail } from './pages/customer/ProductDetail';
import { Cart } from './pages/customer/Cart';
import { Checkout } from './pages/customer/Checkout';
import { About } from './pages/customer/About';
import { Offers } from './pages/customer/Offers';
import { Contact } from './pages/customer/Contact';

// Customer Account Pages
import { AccountOverview } from './pages/customer/account/AccountOverview';
import { AccountOrders } from './pages/customer/account/AccountOrders';
import { AccountWishlist } from './pages/customer/account/AccountWishlist';
import { AccountAddresses } from './pages/customer/account/AccountAddresses';
import { AccountProfile } from './pages/customer/account/AccountProfile';
import { AccountSettings } from './pages/customer/account/AccountSettings';

// Admin Pages
import { Dashboard } from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { Transactions } from './pages/Transactions';
import { Reports } from './pages/Reports';
import { Inventory } from './pages/Inventory';
import { Products } from './pages/Products';
import { Categories } from './pages/Categories';
import { Ingredients } from './pages/Ingredients';
import { Customers } from './pages/Customers';
import { Settings } from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Toaster position="top-right" />
          <Routes>
            {/* PUBLIC AUTH ROUTES */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/login" element={<CustomerLogin />} />
            <Route path="/register" element={<CustomerRegister />} />

            {/* CUSTOMER ROUTES */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<About />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Protected Customer Account Dashboard */}
              <Route path="/account" element={
                <CustomerRoute>
                  <CustomerAccountLayout />
                </CustomerRoute>
              }>
                <Route index element={<AccountOverview />} />
                <Route path="orders" element={<AccountOrders />} />
                <Route path="orders/:id" element={<AccountOrders />} /> {/* Same for now */}
                <Route path="wishlist" element={<AccountWishlist />} />
                <Route path="addresses" element={<AccountAddresses />} />
                <Route path="profile" element={<AccountProfile />} />
                <Route path="settings" element={<AccountSettings />} />
              </Route>
            </Route>

            {/* ADMIN ROUTES */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="reports" element={<Reports />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="products" element={<Products />} />
              <Route path="categories" element={<Categories />} />
              <Route path="ingredients" element={<Ingredients />} />
              <Route path="customers" element={<Customers />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
