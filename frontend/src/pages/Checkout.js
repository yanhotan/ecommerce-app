import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import PaymentSelection from '../components/PaymentSelection';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
    const [formData, setFormData] = useState({
    fullName: user?.username || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState('shipping'); // 'shipping', 'payment', 'complete'
  const [createdOrder, setCreatedOrder] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
    const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.address || 
        !formData.city || !formData.state || !formData.zipCode) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Create order payload
      const orderData = {
        userId: user?.id,
        items: cartItems.map(item => ({
          productId: item.id,
          productName: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: 'Malaysia'
        },
        total: totalPrice
      };
      
      // Send order to backend
      const response = await axios.post('http://localhost:8080/api/orders', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setCreatedOrder(response.data);
      setCurrentStep('payment');
      
    } catch (err) {
      setError('Failed to create order. Please try again.');
      console.error('Error creating order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      // Update order with payment information
      await axios.put(`http://localhost:8080/api/orders/${createdOrder.id}`, {
        ...createdOrder,
        paymentId: paymentData.id,
        paymentMethod: paymentData.paymentMethod,
        status: 'Paid'
      });

      // Clear cart
      clearCart();
      
      // Show success and redirect
      setCurrentStep('complete');
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (err) {
      setError('Payment successful but failed to update order. Please contact support.');
      console.error('Error updating order:', err);
    }
  };

  const handlePaymentCancel = () => {
    setCurrentStep('shipping');
    setCreatedOrder(null);
  };
  
  if (currentStep === 'complete') {
    return (
      <div style={styles.container}>
        <div style={styles.successContainer}>
          <h1 style={styles.successTitle}>🎉 Order Placed Successfully!</h1>
          <p style={styles.successMessage}>
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>
          <p style={styles.redirectMessage}>
            Redirecting you to the home page...
          </p>
        </div>
      </div>
    );
  }

  if (currentStep === 'payment' && createdOrder) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Payment</h1>
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}
        <PaymentSelection
          orderId={createdOrder.id}
          totalAmount={totalPrice}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentCancel={handlePaymentCancel}
        />
      </div>
    );
  }
  
  if (cartItems.length === 0) {
    return (
      <div style={styles.emptyCart}>
        <p>Your cart is empty. Add some products before checkout.</p>
        <button 
          onClick={() => navigate('/')}
          style={styles.returnButton}
        >
          Return to Shop
        </button>
      </div>
    );
  }
  
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Checkout</h1>
      
      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}
      
      <div style={styles.checkoutContent}>
        <div style={styles.orderSummary}>
          <h2 style={styles.sectionTitle}>Order Summary</h2>
          
          <div style={styles.orderItems}>
            {cartItems.map(item => (
              <div key={item.id} style={styles.orderItem}>
                <div style={styles.itemInfo}>
                  <img 
                    src={item.imageUrl || 'https://via.placeholder.com/50'} 
                    alt={item.name}
                    style={styles.itemImage}
                  />
                  <div>
                    <div style={styles.itemName}>{item.name}</div>
                    <div style={styles.itemMeta}>
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div style={styles.itemPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div style={styles.orderTotal}>
            <div style={styles.totalRow}>
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div style={styles.totalRow}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div style={styles.totalRowFinal}>
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div style={styles.checkoutForm}>
          <h2 style={styles.sectionTitle}>Shipping Information</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="fullName" style={styles.label}>Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor="address" style={styles.label}>Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label htmlFor="city" style={styles.label}>City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label htmlFor="state" style={styles.label}>State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label htmlFor="zipCode" style={styles.label}>ZIP Code *</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>            </div>
            
            <button 
              type="submit" 
              style={styles.placeOrderButton}
              disabled={loading}
            >
              {loading ? 'Creating Order...' : 'Continue to Payment'}
            </button>
          </form>
        </div>
      </div>
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
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '10px 15px',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  checkoutContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    '@media (min-width: 768px)': {
      flexDirection: 'row',
    },
  },
  orderSummary: {
    flex: '1',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  orderItems: {
    marginBottom: '20px',
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
  },
  itemInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  itemImage: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginRight: '10px',
  },
  itemName: {
    fontWeight: 'bold',
  },
  itemMeta: {
    fontSize: '14px',
    color: '#666',
  },
  itemPrice: {
    fontWeight: 'bold',
  },
  orderTotal: {
    marginTop: '20px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  totalRowFinal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '18px',
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px solid #ddd',
  },
  checkoutForm: {
    flex: '2',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formRow: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    '@media (min-width: 768px)': {
      flexWrap: 'nowrap',
    },
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  placeOrderButton: {
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
  emptyCart: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  returnButton: {
    backgroundColor: '#ee4d2d',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  successContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#f0f8ff',
    borderRadius: '8px',
    maxWidth: '500px',
    margin: '0 auto',
  },
  successTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: '20px',
  },
  successMessage: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '15px',
    lineHeight: '1.6',
  },
  redirectMessage: {
    fontSize: '14px',
    color: '#999',
    fontStyle: 'italic',
  },
};

export default Checkout;