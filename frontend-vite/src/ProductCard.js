import React from 'react';

const ProductCard = ({ product }) => {
    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
            <img src={product.imageUrl} alt={product.name} style={{ width: '100px' }} />
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>Quantity: {product.quantity}</p>
            <p>Rating: {product.rating}/5</p>
        </div>
    );
};

export default ProductCard;