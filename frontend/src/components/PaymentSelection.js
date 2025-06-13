import React, { useState } from 'react';
import axios from 'axios';

const PaymentSelection = ({ orderId, totalAmount, onPaymentSuccess, onPaymentCancel }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  const handlePaymentMethodSelect = (method) => {
    setSelectedMethod(method);
    setError(null);
  };

  const initializePayment = async () => {
    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;
      
      if (selectedMethod === 'TNG') {
        response = await axios.post('http://localhost:8080/api/payments/touchngo', {
          orderId: orderId,
          amount: totalAmount
        });
      } else if (selectedMethod === 'DUITNOW') {
        response = await axios.post('http://localhost:8080/api/payments/duitnow', {
          orderId: orderId,
          amount: totalAmount
        });
      }

      setPaymentData(response.data);
        // If Touch 'n Go, redirect to payment URL
      if (selectedMethod === 'TNG' && response.data.paymentUrl) {
        // Open payment window and start polling
        const paymentWindow = window.open(response.data.paymentUrl, '_blank', 'width=600,height=700,scrollbars=yes,resizable=yes');
        
        // Start polling for payment status
        pollPaymentStatus(response.data.transactionId, paymentWindow);
      }
      
    } catch (err) {
      setError('Failed to initialize payment. Please try again.');
      console.error('Payment initialization error:', err);
    } finally {
      setLoading(false);
    }
  };
  const pollPaymentStatus = async (transactionId, paymentWindow = null) => {
    const maxAttempts = 30; // 5 minutes with 10-second intervals
    let attempts = 0;
    
    const pollInterval = setInterval(async () => {
      try {
        attempts++;
        
        // Check if payment window is closed (user cancelled)
        if (paymentWindow && paymentWindow.closed) {
          clearInterval(pollInterval);
          setError('Payment was cancelled or window was closed.');
          setLoading(false);
          return;
        }
        
        const response = await axios.post(`http://localhost:8080/api/payments/verify/${transactionId}`);
        
        if (response.data.status === 'SUCCESS') {
          clearInterval(pollInterval);
          if (paymentWindow) paymentWindow.close();
          onPaymentSuccess(paymentData);
        } else if (response.data.status === 'FAILED' || attempts >= maxAttempts) {
          clearInterval(pollInterval);
          if (paymentWindow) paymentWindow.close();
          setError('Payment failed or timed out. Please try again.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Payment polling error:', err);
        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          if (paymentWindow) paymentWindow.close();
          setError('Payment verification failed. Please contact support.');
          setLoading(false);
        }
      }
    }, 5000); // Poll every 5 seconds for better user experience
  };

  const confirmDuitNowPayment = async () => {
    if (!paymentData || !paymentData.transactionId) {
      setError('Invalid payment data');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(`http://localhost:8080/api/payments/verify/${paymentData.transactionId}`);
      
      if (response.data.status === 'SUCCESS') {
        onPaymentSuccess(paymentData);
      } else {
        setError('Payment verification failed. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify payment. Please try again.');
      console.error('Payment verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (paymentData && selectedMethod === 'DUITNOW') {
    return (
      <div style={styles.paymentContainer}>
        <h3 style={styles.title}>DuitNow Payment</h3>          <div style={styles.qrContainer}>
            <p style={styles.instruction}>
              Scan the QR code below with your banking app to complete the payment:
            </p>
            <div style={styles.qrCodeContainer}>
              <img 
                src={paymentData.qrCode} 
                alt="DuitNow QR Code"
                style={styles.qrCodeImage}
              />
            </div>
            <p style={styles.amount}>Amount: RM {totalAmount.toFixed(2)}</p>
            <p style={styles.transactionId}>Transaction ID: {paymentData.transactionId}</p>
            <p style={styles.duitNowInfo}>
              <strong>DuitNow Number:</strong> 171036564446<br/>
              <strong>Recipient:</strong> ShopEase Store
            </p>
          <div style={styles.buttonGroup}>
            <button 
              onClick={confirmDuitNowPayment}
              style={styles.confirmButton}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'I Have Completed Payment'}
            </button>
            <button 
              onClick={onPaymentCancel}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
        {error && <div style={styles.error}>{error}</div>}
      </div>
    );
  }

  if (paymentData && selectedMethod === 'TNG') {
    return (
      <div style={styles.paymentContainer}>
        <h3 style={styles.title}>Touch 'n Go Payment</h3>        <div style={styles.tngContainer}>
          <p style={styles.instruction}>
            Click the button below to send payment to Touch 'n Go:
          </p>
          <p style={styles.amount}>Amount: RM {totalAmount.toFixed(2)}</p>
          <p style={styles.transactionId}>Transaction ID: {paymentData.transactionId}</p>
          <p style={styles.tngInfo}>
            <strong>Touch 'n Go Number:</strong> 60167161396<br/>
            <strong>Recipient:</strong> ShopEase Store
          </p>
          <div style={styles.buttonGroup}>
            <button 
              onClick={() => window.open(paymentData.paymentUrl, '_blank')}
              style={styles.confirmButton}
            >
              Open Touch 'n Go
            </button>
            <button 
              onClick={onPaymentCancel}
              style={styles.cancelButton}
            >
              Cancel Payment
            </button>
          </div>
          <p style={styles.status}>After completing payment, we'll automatically verify it.</p>
        </div>
        {error && <div style={styles.error}>{error}</div>}
      </div>
    );
  }

  return (
    <div style={styles.paymentContainer}>
      <h3 style={styles.title}>Select Payment Method</h3>
      <div style={styles.paymentMethods}>
        <div 
          style={{
            ...styles.paymentMethod,
            ...(selectedMethod === 'TNG' ? styles.selected : {})
          }}
          onClick={() => handlePaymentMethodSelect('TNG')}
        >
          <div style={styles.methodIcon}>🔴</div>
          <div style={styles.methodInfo}>
            <h4>Touch 'n Go</h4>
            <p>Pay securely with your Touch 'n Go eWallet</p>
          </div>
        </div>
        
        <div 
          style={{
            ...styles.paymentMethod,
            ...(selectedMethod === 'DUITNOW' ? styles.selected : {})
          }}
          onClick={() => handlePaymentMethodSelect('DUITNOW')}
        >
          <div style={styles.methodIcon}>🏦</div>
          <div style={styles.methodInfo}>
            <h4>DuitNow QR</h4>
            <p>Scan QR code with your banking app</p>
          </div>
        </div>
      </div>
      
      <div style={styles.paymentSummary}>
        <div style={styles.summaryRow}>
          <span>Total Amount:</span>
          <span style={styles.amount}>RM {totalAmount.toFixed(2)}</span>
        </div>
      </div>
      
      <div style={styles.buttonGroup}>
        <button 
          onClick={initializePayment}
          style={styles.proceedButton}
          disabled={loading || !selectedMethod}
        >
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </button>
        <button 
          onClick={onPaymentCancel}
          style={styles.cancelButton}
        >
          Cancel
        </button>
      </div>
      
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
};

const styles = {  paymentContainer: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#fffcf4',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  },
  paymentMethods: {
    marginBottom: '20px',
  },
  paymentMethod: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    marginBottom: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  selected: {
    borderColor: '#ee4d2d',
    backgroundColor: '#fff5f5',
  },
  methodIcon: {
    fontSize: '24px',
    marginRight: '15px',
    width: '40px',
    textAlign: 'center',
  },
  methodInfo: {
    flex: 1,
  },
  paymentSummary: {
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ee4d2d',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  proceedButton: {
    backgroundColor: '#ee4d2d',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    flex: 1,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    flex: 1,
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '10px 15px',
    borderRadius: '4px',
    marginTop: '15px',
    textAlign: 'center',
  },
  instruction: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#666',
  },  qrContainer: {
    textAlign: 'center',
  },
  qrCodeContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px auto',
  },
  qrCodeImage: {
    maxWidth: '250px',
    maxHeight: '250px',
    border: '2px solid #ddd',
    borderRadius: '8px',
  },
  qrCodePlaceholder: {
    width: '200px',
    height: '200px',
    border: '2px dashed #ccc',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  transactionId: {
    fontSize: '12px',
    color: '#666',
    marginTop: '10px',
  },
  duitNowInfo: {
    fontSize: '14px',
    color: '#333',
    backgroundColor: '#f0f8ff',
    padding: '10px',
    borderRadius: '4px',
    margin: '10px 0',
    textAlign: 'left',
  },
  tngInfo: {
    fontSize: '14px',
    color: '#333',
    backgroundColor: '#fff5f5',
    padding: '10px',
    borderRadius: '4px',
    margin: '10px 0',
    textAlign: 'left',
  },
  tngContainer: {
    textAlign: 'center',
  },
  status: {
    color: '#666',
    fontSize: '14px',
    marginTop: '10px',
  },
};

export default PaymentSelection;
