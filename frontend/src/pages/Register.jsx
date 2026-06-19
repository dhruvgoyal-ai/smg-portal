import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: ''
        }
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('address.')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                address: { ...formData.address, [field]: value }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/customers/register', formData);
            alert('Registration Successful! You can now log in.');
            navigate('/login'); 
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };


    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Customer Registration</h2>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="fullName" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="text" name="phone" onChange={handleChange} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div className="form-group">
                            <label>City</label>
                            <input type="text" name="address.city" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>ZIP Code</label>
                            <input type="text" name="address.zipCode" onChange={handleChange} />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary">Register Account</button>
                </form>
                <p className="link-text">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
