import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, totalPrice, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login');
    } else {
      // Proceed to checkout
      navigate('/checkout');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div style={styles.emptyCart}>
          <p>Your cart is empty.</p>
          <Link to="/" style={styles.continueShoppingLink}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div style={styles.cartContent}>
          <div style={styles.cartItems}>
            {cartItems.map(item => (
              <div key={item.id} style={styles.cartItem}>
                <div style={styles.itemImage}>
                  <img 
                    src={item.imageUrl || 'https://via.placeholder.com/100'} 
                    alt={item.name}
                    style={styles.productImage}
                  />
                </div>
                
                <div style={styles.itemDetails}>
                  <Link to={`/product/${item.id}`} style={styles.itemName}>
                    {item.name}
                  </Link>
                  <div style={styles.itemPrice}>${item.price.toFixed(2)}</div>
                </div>
                
                <div style={styles.itemQuantity}>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={styles.quantityButton}
                  >
                    -
                  </button>
                  <span style={styles.quantityValue}>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={styles.quantityButton}
                  >
                    +
                  </button>
                </div>
                
                <div style={styles.itemSubtotal}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.id)}
                  style={styles.removeButton}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          
          <div style={styles.cartSummary}>
            <h2 style={styles.summaryTitle}>Order Summary</h2>
            
            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            
            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            
            <div style={styles.summaryTotal}>
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              style={styles.checkoutButton}
            >
              {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>
            
            <Link to="/" style={styles.continueShoppingLink}>
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px 0',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '30px',
  },
  emptyCart: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  cartContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    '@media (min-width: 768px)': {
      flexDirection: 'row',
    },
  },
  cartItems: {
    flex: '2',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #eee',
    position: 'relative',
  },
  itemImage: {
    width: '80px',
    marginRight: '20px',
  },
  productImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '4px',
  },
  itemDetails: {
    flex: '1',
  },
  itemName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    textDecoration: 'none',
    marginBottom: '5px',
    display: 'block',
  },
  itemPrice: {
    color: '#666',
  },
  itemQuantity: {
    display: 'flex',
    alignItems: 'center',
    margin: '0 20px',
  },
  quantityButton: {
    width: '30px',
    height: '30px',
    border: '1px solid #ddd',
    backgroundColor: '#f5f5f5',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  quantityValue: {
    width: '40px',
    textAlign: 'center',
  },
  itemSubtotal: {
    fontWeight: 'bold',
    width: '100px',
    textAlign: 'right',
  },
  removeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#999',
    fontSize: '16px',
    cursor: 'pointer',
    marginLeft: '20px',
  },
  cartSummary: {
    flex: '1',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    alignSelf: 'flex-start',
  },
  summaryTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '18px',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #ddd',
  },
  checkoutButton: {
    backgroundColor: '#ee4d2d',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    marginTop: '20px',
  },
  continueShoppingLink: {
    display: 'block',
    textAlign: 'center',
    marginTop: '20px',
    color: '#ee4d2d',
    textDecoration: 'none',
  },
};

export default Cart;