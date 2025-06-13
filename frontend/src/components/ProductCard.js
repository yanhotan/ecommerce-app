import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    
    // Show a brief visual feedback
    const button = e.target;
    const originalText = button.innerText;
    button.innerText = 'Added!';
    button.disabled = true;
    
    setTimeout(() => {
      button.innerText = originalText;
      button.disabled = false;
    }, 1500);
  };
  
  return (
    <div style={styles.card}>
      <Link to={`/product/${product.id}`} style={styles.link}>
        <div style={styles.imageContainer}>
          <img 
            src={product.imageUrl || 'https://via.placeholder.com/300'} 
            alt={product.name}
            style={styles.image}
          />
          {product.quantity <= 0 && (
            <div style={styles.outOfStock}>
              Out of Stock
            </div>
          )}
        </div>
        
        <div style={styles.content}>
          <h3 style={styles.name}>{product.name}</h3>
          
          <div style={styles.price}>${product.price.toFixed(2)}</div>
          
          <div style={styles.rating}>
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{
                color: i < Math.floor(product.rating) ? '#ffc107' : '#e4e5e9'
              }}>★</span>
            ))}
            <span style={styles.ratingCount}>({product.rating})</span>
          </div>
          
          <button 
            onClick={handleAddToCart} 
            style={styles.addToCartButton}
            disabled={product.quantity <= 0}
          >
            Add to Cart
          </button>
        </div>
      </Link>
    </div>
  );
};

const styles = {  card: {
    border: '1px solid #eee',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    backgroundColor: '#fffcf4',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
    },
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  },
  imageContainer: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  outOfStock: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  content: {
    padding: '15px',
  },
  name: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px',
    height: '40px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  price: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ee4d2d',
    marginBottom: '10px',
  },
  rating: {
    fontSize: '14px',
    marginBottom: '15px',
  },
  ratingCount: {
    color: '#666',
    marginLeft: '5px',
    fontSize: '12px',
  },
  addToCartButton: {
    backgroundColor: '#ee4d2d',
    color: 'white',
    border: 'none',
    padding: '8px 0',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#d73211',
    },
    ':disabled': {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed',
    },
  },
};

export default ProductCard;