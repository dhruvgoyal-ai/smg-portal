import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/customers/login', formData);
            
            // Save token and user info to LocalStorage
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('customer', JSON.stringify(res.data.customer));

            alert('Login Successful!');
            navigate('/dashboard'); // We will build the dashboard next!
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Customer Login</h2>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn-primary">Sign In</button>
                </form>
                <p className="link-text">
                    New to Logistics Portal? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
