import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
    const { cart, setCart } = useContext(CartContext);
    const navigate = useNavigate();

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const handleCheckout = async () => {
        try {
            const order = {
                items: cart.map(item => ({
                    productId: item.product.id,
                    productName: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity
                })),
                total,
                status: 'Pending'
            };
            await axios.post('http://localhost:8080/api/orders', order);
            setCart([]);
            alert('Order placed successfully!');
            navigate('/');
        } catch (error) {
            alert('Failed to place order');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Checkout</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <h2>Order Summary</h2>
                    {cart.map(item => (
                        <div key={item.product.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '10px 0',
                            borderBottom: '1px solid #ddd'
                        }}>
                            <span>{item.product.name} (x{item.quantity})</span>
                            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div style={{ textAlign: 'right', marginTop: '20px' }}>
                        <h3>Total: ${total.toFixed(2)}</h3>
                        <button onClick={handleCheckout} style={{
                            padding: '10px 20px',
                            backgroundColor: '#28a745',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px'
                        }}>
                            Place Order
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Checkout;