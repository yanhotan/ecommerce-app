import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState('');

    useEffect(() => {
        const url = category ? `http://localhost:8080/api/products?category=${category}` : 'http://localhost:8080/api/products';
        axios.get(url)
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch products');
                setLoading(false);
            });
    }, [category]);

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Products</h1>
            <div style={{ marginBottom: '20px' }}>
                <label>Filter by Category: </label>
                <select value={category} onChange={handleCategoryChange} style={{ marginLeft: '10px', padding: '5px' }}>
                    <option value="">All</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default ProductList;