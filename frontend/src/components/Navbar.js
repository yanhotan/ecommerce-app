import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, you would navigate to search results
    // For now, just navigate to home
    navigate('/');
    setSearchQuery('');
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.navLeft}>
          <Link to="/" style={styles.logo}>
            ShopEase
          </Link>
          
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchButton}>
              Search
            </button>
          </form>
        </div>
        
        <div style={styles.navRight}>
          <div style={styles.desktopMenu}>
            <Link to="/" style={styles.navLink}>Home</Link>
            
            <Link to="/cart" style={styles.cartLink}>
              Cart
              {totalItems > 0 && (
                <span style={styles.cartBadge}>{totalItems}</span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <Link to="/profile" style={styles.navLink}>
                {user?.username || 'Profile'}
              </Link>
            ) : (
              <Link to="/login" style={styles.navLink}>Login</Link>
            )}
          </div>
          
          <button 
            onClick={toggleMobileMenu}
            style={styles.mobileMenuButton}
          >
            ☰
          </button>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div style={styles.mobileMenu}>
          <Link 
            to="/" 
            style={styles.mobileNavLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          
          <Link 
            to="/cart" 
            style={styles.mobileNavLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            Cart ({totalItems})
          </Link>
          
          {isAuthenticated ? (
            <Link 
              to="/profile" 
              style={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              {user?.username || 'Profile'}
            </Link>
          ) : (
            <Link 
              to="/login" 
              style={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#ee4d2d',
    color: 'white',
    padding: '15px 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    flex: '1',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none',
    marginRight: '20px',
  },
  searchForm: {
    display: 'flex',
    flex: '1',
    maxWidth: '500px',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  searchInput: {
    flex: '1',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px 0 0 4px',
    fontSize: '14px',
  },
  searchButton: {
    backgroundColor: '#d73211',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
    fontSize: '14px',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
  },
  desktopMenu: {
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    marginLeft: '20px',
    fontSize: '16px',
  },
  cartLink: {
    color: 'white',
    textDecoration: 'none',
    marginLeft: '20px',
    fontSize: '16px',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#d73211',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
  },
  mobileMenuButton: {
    display: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    '@media (max-width: 768px)': {
      display: 'block',
    },
  },
  mobileMenu: {
    display: 'none',
    flexDirection: 'column',
    backgroundColor: '#ee4d2d',
    padding: '10px 20px',
    '@media (max-width: 768px)': {
      display: 'flex',
    },
  },
  mobileNavLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '10px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '16px',
  },
};

export default Navbar;