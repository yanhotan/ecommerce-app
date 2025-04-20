import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Password strength validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    // Mock registration success (in a real app, you would call the API here)
    setSuccess(true);
    setError('');
    
    // Reset form
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.registerBox}>
        <h1 style={styles.title}>Create an Account</h1>
        <p style={styles.subtitle}>Join ShopEase and start shopping today</p>
        
        {success ? (
          <div style={styles.success}>
            Registration successful! Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            {error && <div style={styles.error}>{error}</div>}
            
            <div style={styles.inputGroup}>
              <label htmlFor="username" style={styles.label}>Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                placeholder="Choose a username"
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="Enter your email"
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="Create a password"
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
                placeholder="Confirm your password"
              />
            </div>
            
            <button type="submit" style={styles.button}>Register</button>
            
            <p style={styles.loginText}>
              Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 100px)',
    backgroundColor: '#f5f5f5',
  },
  registerBox: {
    width: '100%',
    maxWidth: '500px',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ee4d2d',
    textAlign: 'center',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  button: {
    backgroundColor: '#ee4d2d',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
    fontSize: '14px',
  },
  success: {
    color: 'green',
    padding: '20px',
    textAlign: 'center',
    fontSize: '16px',
    backgroundColor: '#e6f7e6',
    borderRadius: '4px',
  },
  loginText: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '14px',
  },
  link: {
    color: '#ee4d2d',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};

export default Register;