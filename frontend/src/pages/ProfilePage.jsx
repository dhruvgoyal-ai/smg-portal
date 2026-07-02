import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API = 'http://localhost:5000';

const ProfilePage = () => {
    // customer stored at login: { id, fullName, email, phone?, address? }
    const [customer, setCustomer] = useState(
        () => JSON.parse(localStorage.getItem('customer')) || {}
    );

    const [formData, setFormData] = useState({
        fullName: customer.fullName || '',
        phone:    customer.phone    || '',
        address: {
            city:    customer.address?.city    || '',
            zipCode: customer.address?.zipCode || '',
        },
    });

    const [message, setMessage] = useState('');
    const [saving,  setSaving]  = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [field]: value },
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        // customer.id is set by the login/register response
        const customerId = customer.id || customer._id;
        if (!customerId) {
            setMessage('Error: Could not identify customer. Please log in again.');
            setSaving(false);
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const res = await axios.put(
                `${API}/api/customers/${customerId}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const updated = res.data.customer;
            setMessage('Profile updated successfully!');
            localStorage.setItem('customer', JSON.stringify(updated));
            setCustomer(updated);
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || 'Error updating profile.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="auth-container" style={{ minHeight: 'calc(100vh - 70px)' }}>
                <div className="auth-card">
                    <h2>Account Profile</h2>

                    {message && (
                        <p style={{
                            textAlign: 'center',
                            color: message.startsWith('Error') ? 'red' : 'green',
                            backgroundColor: message.startsWith('Error') ? '#fee' : '#efe',
                            padding: '10px',
                            borderRadius: '5px',
                            marginBottom: '16px',
                        }}>
                            {message}
                        </p>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email (Cannot be changed)</label>
                            <input
                                type="email"
                                value={customer.email || ''}
                                disabled
                                style={{ backgroundColor: '#f9f9f9' }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>City</label>
                            <input
                                type="text"
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>ZIP Code</label>
                            <input
                                type="text"
                                name="address.zipCode"
                                value={formData.address.zipCode}
                                onChange={handleChange}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={saving}
                        >
                            {saving ? 'Saving…' : 'Update Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
