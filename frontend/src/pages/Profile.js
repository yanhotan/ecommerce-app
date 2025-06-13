import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, token, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/orders/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);
  
  const handleLogout = () => {
    logout();
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Packaging':
        return '#ff9800';
      case 'Shipping':
        return '#2196f3';
      case 'Delivered':
        return '#4caf50';
      case 'Return/Refunded':
        return '#f44336';
      default:
        return '#757575';
    }
  };
  
  const renderTrackingTimeline = (status) => {
    const steps = ['Packaging', 'Shipping', 'Delivered'];
    const currentIndex = steps.indexOf(status);
    
    return (
      <div style={styles.timeline}>
        {steps.map((step, index) => (
          <div key={step} style={styles.timelineStep}>
            <div 
              style={{
                ...styles.timelinePoint,
                backgroundColor: index <= currentIndex ? getStatusColor(step) : '#e0e0e0',
              }}
            />
            <div 
              style={{
                ...styles.timelineLabel,
                fontWeight: index <= currentIndex ? 'bold' : 'normal',
                color: index <= currentIndex ? '#333' : '#999',
              }}
            >
              {step}
            </div>
            {index < steps.length - 1 && (
              <div 
                style={{
                  ...styles.timelineConnector,
                  backgroundColor: index < currentIndex ? getStatusColor(step) : '#e0e0e0',
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };
  
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading profile data...</p>
      </div>
    );
  }
  
  return (
    <div style={styles.container}>
      <div style={styles.profileHeader}>
        <div>
          <h1 style={styles.title}>My Profile</h1>
          <p style={styles.userInfo}>Welcome back, {user?.username}!</p>
          <p style={styles.userEmail}>{user?.email}</p>
        </div>
        <button 
          onClick={handleLogout}
          style={styles.logoutButton}
        >
          Logout
        </button>
      </div>
      
      <div style={styles.ordersSection}>
        <h2 style={styles.sectionTitle}>My Orders</h2>
        
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}
        
        {orders.length === 0 ? (
          <div style={styles.noOrders}>
            <p>You haven't placed any orders yet.</p>
            <Link to="/" style={styles.shopNowLink}>
              Shop Now
            </Link>
          </div>
        ) : (
          <div style={styles.ordersList}>
            {orders.map(order => (
              <div key={order.id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <div>
                    <div style={styles.orderId}>Order #{order.id}</div>
                    <div style={styles.orderDate}>{formatDate(order.createdAt)}</div>
                  </div>
                  <div 
                    style={{
                      ...styles.orderStatus,
                      backgroundColor: getStatusColor(order.status),
                    }}
                  >
                    {order.status}
                  </div>
                </div>
                
                <div style={styles.orderItems}>
                  {order.items.slice(0, 2).map(item => (
                    <div key={item.productId} style={styles.orderItem}>
                      <div style={styles.itemInfo}>
                        <div style={styles.itemName}>{item.productName}</div>
                        <div style={styles.itemMeta}>
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <div style={styles.itemPrice}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <div style={styles.moreItems}>
                      +{order.items.length - 2} more items
                    </div>
                  )}
                </div>
                
                <div style={styles.orderFooter}>
                  <div style={styles.orderTotal}>
                    Total: <span style={styles.totalAmount}>${order.total.toFixed(2)}</span>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                    style={styles.trackButton}
                  >
                    {selectedOrder === order.id ? 'Hide Details' : 'Track Order'}
                  </button>
                </div>
                
                {selectedOrder === order.id && (
                  <div style={styles.orderTracking}>
                    <h3 style={styles.trackingTitle}>Order Tracking</h3>
                    {renderTrackingTimeline(order.status)}
                    
                    <div style={styles.orderDetails}>
                      <h4 style={styles.detailsTitle}>Order Details</h4>
                      {order.items.map(item => (
                        <div key={item.productId} style={styles.detailItem}>
                          <div style={styles.detailName}>{item.productName}</div>
                          <div style={styles.detailQuantity}>x{item.quantity}</div>
                          <div style={styles.detailPrice}>${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px 0',
  },
  profileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  userInfo: {
    fontSize: '18px',
    marginBottom: '5px',
  },
  userEmail: {
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#f5f5f5',
    color: '#333',
    border: '1px solid #ddd',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  ordersSection: {
    marginTop: '20px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '10px 15px',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  noOrders: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  shopNowLink: {
    display: 'inline-block',
    marginTop: '10px',
    color: '#ee4d2d',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  orderCard: {
    border: '1px solid #eee',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderBottom: '1px solid #eee',
  },
  orderId: {
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: '14px',
    color: '#666',
  },
  orderStatus: {
    padding: '5px 10px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  orderItems: {
    padding: '15px',
    borderBottom: '1px solid #eee',
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  itemInfo: {
    flex: '1',
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
  moreItems: {
    fontSize: '14px',
    color: '#666',
    fontStyle: 'italic',
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
  },
  orderTotal: {
    fontSize: '16px',
  },
  totalAmount: {
    fontWeight: 'bold',
    color: '#ee4d2d',
  },
  trackButton: {
    backgroundColor: '#ee4d2d',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  orderTracking: {
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderTop: '1px solid #eee',
  },
  trackingTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  timeline: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  timelineStep: {
    display: 'flex',
    alignItems: 'center',
    flex: '1',
  },
  timelinePoint: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  timelineConnector: {
    flex: '1',
    height: '2px',
    margin: '0 5px',
  },
  timelineLabel: {
    marginLeft: '5px',
    fontSize: '14px',
  },  orderDetails: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#fffcf4',
    borderRadius: '4px',
    border: '1px solid #eee',
  },
  detailsTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #eee',
  },
  detailName: {
    flex: '2',
  },
  detailQuantity: {
    flex: '1',
    textAlign: 'center',
  },
  detailPrice: {
    flex: '1',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(0, 0, 0, 0.1)',
    borderLeft: '4px solid #ee4d2d',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '10px',
  },
};

export default Profile;