import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
    const [customer, setCustomer] = useState(JSON.parse(localStorage.getItem('customer')));
    const [formData, setFormData] = useState({
        fullName: customer?.fullName || '',
        phone: customer?.phone || '',
        address: {
            city: customer?.address?.city || '',
            zipCode: customer?.address?.zipCode || ''
        }
    });

    const [message, setMessage] = useState('');

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
            const res = await axios.put(`http://localhost:5000/api/customers/${customer.id}`, formData);
            setMessage('Profile updated successfully!');
            // Update local storage with new info
            localStorage.setItem('customer', JSON.stringify(res.data.customer));
            setCustomer(res.data.customer);
        } catch (err) {
            console.error(err);
            setMessage('Error updating profile');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="auth-container" style={{ minHeight: 'calc(100vh - 70px)' }}>
                <div className="auth-card">
                    <h2>Account Profile</h2>
                    {message && <p style={{ 
                        textAlign: 'center', 
                        color: message.includes('Error') ? 'red' : 'green',
                        backgroundColor: message.includes('Error') ? '#fee' : '#efe',
                        padding: '10px',
                        borderRadius: '5px'
                    }}>{message}</p>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Email (Cannot be changed)</label>
                            <input type="email" value={customer?.email} disabled style={{ backgroundColor: '#f9f9f9' }} />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>City</label>
                            <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>ZIP Code</label>
                            <input type="text" name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} />
                        </div>
                        <button type="submit" className="btn-primary">Update Profile</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
