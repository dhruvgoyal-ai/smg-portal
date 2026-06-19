import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const customer = JSON.parse(localStorage.getItem('customer'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('customer');
        navigate('/login');
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 30px',
            backgroundColor: '#003366',
            color: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>SMG Logistics</Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span>Welcome, <strong>{customer?.fullName || 'Customer'}</strong></span>
                <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link>
                <button 
                    onClick={handleLogout}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#ff9900',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
