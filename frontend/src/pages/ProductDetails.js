import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/products/${id}`)
            .then(response => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch product');
                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = () => {
        if (product && quantity > 0) {
            addToCart(product, quantity);
            alert('Added to cart!');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!product) return <p>Product not found</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate('/')} style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                marginBottom: '20px'
            }}>
                Back to Products
            </button>
            <div style={{ display: 'flex', gap: '20px' }}>
                <img src={product.imageUrl} alt={product.name} style={{ width: '50%', borderRadius: '8px' }} />
                <div>
                    <h1 style={{ fontSize: '1.8em' }}>{product.name}</h1>
                    <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
                    <p><strong>Category:</strong> {product.category}</p>
                    <p><strong>Rating:</strong> {product.rating}/5</p>
                    <p><strong>Stock:</strong> {product.quantity} available</p>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Quantity: </label>
                        <input
                            type="number"
                            min="1"
                            max={product.quantity}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            style={{ width: '60px', padding: '5px', marginLeft: '10px' }}
                        />
                    </div>
                    <button onClick={handleAddToCart} style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px'
                    }}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;