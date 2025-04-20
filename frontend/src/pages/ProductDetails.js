import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Failed to fetch product details. Please try again later.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.quantity || 10)) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product?.quantity || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
      
      // Reset the "Added to cart" message after 3 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>{error || 'Product not found'}</p>
        <Link to="/" style={styles.backLink}>Back to Home</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}>
        &larr; Back to Products
      </Link>
      
      <div style={styles.productContainer}>
        <div style={styles.imageContainer}>
          <img 
            src={product.imageUrl || 'https://via.placeholder.com/400'} 
            alt={product.name}
            style={styles.productImage}
          />
        </div>
        
        <div style={styles.productInfo}>
          <h1 style={styles.productName}>{product.name}</h1>
          
          <div style={styles.productMeta}>
            <span style={styles.category}>Category: {product.category}</span>
            <div style={styles.rating}>
              Rating: {product.rating}/5
              <div style={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{
                    color: i < Math.floor(product.rating) ? '#ffc107' : '#e4e5e9'
                  }}>★</span>
                ))}
              </div>
            </div>
          </div>
          
          <div style={styles.price}>${product.price.toFixed(2)}</div>
          
          <p style={styles.description}>
            {product.description || 'No description available for this product.'}
          </p>
          
          <div style={styles.stock}>
            <span style={product.quantity > 0 ? styles.inStock : styles.outOfStock}>
              {product.quantity > 0 ? `In Stock (${product.quantity} available)` : 'Out of Stock'}
            </span>
          </div>
          
          <div style={styles.quantityContainer}>
            <label htmlFor="quantity" style={styles.quantityLabel}>Quantity:</label>
            <div style={styles.quantityControls}>
              <button 
                onClick={decrementQuantity} 
                disabled={quantity <= 1}
                style={{
                  ...styles.quantityButton,
                  opacity: quantity <= 1 ? 0.5 : 1
                }}
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.quantity || 10}
                value={quantity}
                onChange={handleQuantityChange}
                style={styles.quantityInput}
              />
              <button 
                onClick={incrementQuantity}
                disabled={quantity >= (product.quantity || 10)}
                style={{
                  ...styles.quantityButton,
                  opacity: quantity >= (product.quantity || 10) ? 0.5 : 1
                }}
              >
                +
              </button>
            </div>
          </div>
          
          <div style={styles.actions}>
            <button 
              onClick={handleAddToCart} 
              style={styles.addToCartButton}
              disabled={product.quantity <= 0}
            >
              Add to Cart
            </button>
            
            {addedToCart && (
              <div style={styles.addedMessage}>
                Product added to cart!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px 0',
  },
  backLink: {
    display: 'inline-block',
    marginBottom: '20px',
    color: '#666',
    textDecoration: 'none',
    fontSize: '16px',
  },
  productContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    '@media (min-width: 768px)': {
      flexDirection: 'row',
    },
  },
  imageContainer: {
    flex: '1',
    maxWidth: '100%',
    '@media (min-width: 768px)': {
      maxWidth: '50%',
    },
  },
  productImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  productInfo: {
    flex: '1',
  },
  productName: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  productMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '15px',
  },
  category: {
    color: '#666',
    fontSize: '14px',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  stars: {
    fontSize: '18px',
    letterSpacing: '2px',
  },
  price: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ee4d2d',
    marginBottom: '20px',
  },
  description: {
    lineHeight: '1.6',
    color: '#333',
    marginBottom: '20px',
  },
  stock: {
    marginBottom: '20px',
  },
  inStock: {
    color: 'green',
    fontWeight: 'bold',
  },
  outOfStock: {
    color: 'red',
    fontWeight: 'bold',
  },
  quantityContainer: {
    marginBottom: '20px',
  },
  quantityLabel: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
  },
  quantityButton: {
    width: '36px',
    height: '36px',
    border: '1px solid #ddd',
    backgroundColor: '#f5f5f5',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  quantityInput: {
    width: '60px',
    height: '36px',
    border: '1px solid #ddd',
    textAlign: 'center',
    fontSize: '16px',
    margin: '0 5px',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  addToCartButton: {
    backgroundColor: '#ee4d2d',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#d73211',
    },
    ':disabled': {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed',
    },
  },
  addedMessage: {
    color: 'green',
    fontWeight: 'bold',
    padding: '10px',
    backgroundColor: '#e6f7e6',
    borderRadius: '4px',
    textAlign: 'center',
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
  errorContainer: {
    textAlign: 'center',
    padding: '40px',
  },
  errorText: {
    color: 'red',
    marginBottom: '20px',
  },
};

export default ProductDetails;