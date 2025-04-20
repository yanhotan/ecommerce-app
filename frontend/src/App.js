import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Navbar />
            <div className="container" style={styles.container}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route 
                  path="/checkout" 
                  element={
                    <PrivateRoute>
                      <Checkout />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  }
};

export default App;