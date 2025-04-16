import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
    const { cart } = useContext(CartContext);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav style={{
            backgroundColor: '#343a40',
            padding: '15px',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.5em' }}>
                E-commerce
            </Link>
            <div>
                <Link to="/" style={{ color: '#fff', textDecoration: 'none', margin: '0 15px' }}>
                    Products
                </Link>
                <Link to="/cart" style={{ color: '#fff', textDecoration: 'none', margin: '0 15px' }}>
                    Cart ({itemCount})
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;