import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
    const navigate = useNavigate();

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Shopping Cart</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty. <a href="/">Shop now</a>.</p>
            ) : (
                <>
                    {cart.map(item => (
                        <div key={item.product.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: '1px solid #ddd',
                            padding: '10px 0',
                            marginBottom: '10px'
                        }}>
                            <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '100px', marginRight: '20px' }} />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: '0 0 10px' }}>{item.product.name}</h3>
                                <p>Price: ${item.product.price.toFixed(2)}</p>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label>Quantity: </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.product.id, Number(e.target.value))}
                                        style={{ width: '60px', padding: '5px', margin: '0 10px' }}
                                    />
                                    <button onClick={() => removeFromCart(item.product.id)} style={{
                                        padding: '5px 10px',
                                        backgroundColor: '#dc3545',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px'
                                    }}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                            <p style={{ marginLeft: '20px' }}>Subtotal: ${(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                    <div style={{ textAlign: 'right', marginTop: '20px' }}>
                        <h2>Total: ${total.toFixed(2)}</h2>
                        <button onClick={() => navigate('/checkout')} style={{
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px'
                        }}>
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;