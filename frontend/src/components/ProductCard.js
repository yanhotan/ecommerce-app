import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <div style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            textAlign: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '4px' }} />
            <h3 style={{ fontSize: '1.2em', margin: '10px 0' }}>{product.name}</h3>
            <p style={{ color: '#888' }}>Price: ${product.price.toFixed(2)}</p>
            <p style={{ color: '#888' }}>Rating: {product.rating}/5</p>
            <Link to={`/product/${product.id}`} style={{
                display: 'inline-block',
                marginTop: '10px',
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '4px'
            }}>
                View Details
            </Link>
        </div>
    );
};

export default ProductCard;