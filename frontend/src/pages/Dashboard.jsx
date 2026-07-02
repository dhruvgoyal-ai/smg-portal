import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import TrackingSearch from '../components/TrackingSearch';
import SupportForm from '../components/SupportForm';

const API = 'http://localhost:5000';

const statusColor = (status) => {
    const map = {
        'Delivered':        { bg: '#00b89420', text: '#00b894', border: '#00b89440' },
        'In Transit':       { bg: '#74b9ff20', text: '#0984e3', border: '#74b9ff40' },
        'Out For Delivery': { bg: '#fdcb6e20', text: '#e17055', border: '#e1705540' },
        'Picked Up':        { bg: '#a29bfe20', text: '#6c5ce7', border: '#a29bfe40' },
        'Pending':          { bg: '#dfe6e920', text: '#636e72', border: '#dfe6e940' },
    };
    return map[status] || map['Pending'];
};

const Dashboard = () => {
    const [shipments, setShipments]   = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios
            .get(`${API}/api/shipments`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setShipments(res.data.shipments || []);
            })
            .catch((err) => {
                setError(err.response?.data?.message || 'Failed to load shipments.');
            })
            .finally(() => setLoading(false));
    }, []);

    // Compute stats from live data
    const active    = shipments.filter(s => !['Delivered'].includes(s.status)).length;
    const delivered = shipments.filter(s => s.status === 'Delivered').length;
    const pending   = shipments.filter(s => s.status === 'Pending').length;

    const stats = [
        { label: 'Active Shipments', value: active,    color: '#003366' },
        { label: 'Delivered',        value: delivered, color: '#28a745' },
        { label: 'Pending',          value: pending,   color: '#ff9900' },
    ];

    return (
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <Navbar />
            <div className="animate-fade" style={{ padding: '40px 30px', maxWidth: '1300px', margin: '0 auto' }}>
                <header style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#000428' }}>Logistics Overview</h1>
                    <p style={{ color: '#666' }}>Welcome back! Here is what's happening with your shipments today.</p>
                </header>

                <TrackingSearch />

                {/* Stats Section */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '25px',
                    marginBottom: '50px'
                }}>
                    {stats.map((stat, index) => (
                        <div key={index} className="card-premium" style={{ borderLeft: `8px solid ${stat.color}` }}>
                            <h3 style={{ color: '#888', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>{stat.label}</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p style={{ fontSize: '40px', fontWeight: '800', color: '#000428' }}>
                                    {loading ? '…' : stat.value}
                                </p>
                                <div style={{
                                    padding: '12px',
                                    backgroundColor: `${stat.color}15`,
                                    borderRadius: '12px',
                                    color: stat.color,
                                    fontWeight: 'bold'
                                }}>
                                    Live
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Shipments Table */}
                <div className="card-premium">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#000428' }}>My Shipments</h2>
                    </div>

                    {error && (
                        <p style={{ color: '#e17055', background: '#e1705510', padding: '12px', borderRadius: '8px' }}>{error}</p>
                    )}

                    {loading && !error && (
                        <p style={{ color: '#666', textAlign: 'center', padding: '40px 0' }}>Loading shipments…</p>
                    )}

                    {!loading && !error && shipments.length === 0 && (
                        <p style={{ color: '#999', textAlign: 'center', padding: '40px 0' }}>No shipments found for your account.</p>
                    )}

                    {!loading && !error && shipments.length > 0 && (
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                            <thead>
                                <tr style={{ background: 'transparent' }}>
                                    <th style={{ textAlign: 'left', padding: '0 20px', color: '#888', fontSize: '13px' }}>Tracking ID</th>
                                    <th style={{ textAlign: 'left', padding: '0 20px', color: '#888', fontSize: '13px' }}>Route</th>
                                    <th style={{ textAlign: 'left', padding: '0 20px', color: '#888', fontSize: '13px' }}>Status</th>
                                    <th style={{ textAlign: 'left', padding: '0 20px', color: '#888', fontSize: '13px' }}>Expected Delivery</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shipments.map((item) => {
                                    const sc = statusColor(item.status);
                                    return (
                                        <tr key={item._id} style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.03)', borderRadius: '15px', overflow: 'hidden' }}>
                                            <td style={{ padding: '20px', fontWeight: '700', color: '#004e92' }}>{item.trackingId}</td>
                                            <td style={{ padding: '20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <span style={{ fontWeight: '600' }}>{item.senderAddress}</span>
                                                    <span style={{ color: '#ccc' }}>→</span>
                                                    <span style={{ fontWeight: '600' }}>{item.receiverAddress}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px' }}>
                                                <span style={{
                                                    padding: '6px 14px',
                                                    borderRadius: '30px',
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    backgroundColor: sc.bg,
                                                    color: sc.text,
                                                    border: `1px solid ${sc.border}`
                                                }}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '20px', color: '#666', fontWeight: '500' }}>
                                                {item.expectedDeliveryDate
                                                    ? new Date(item.expectedDeliveryDate).toLocaleDateString()
                                                    : '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                <SupportForm />
            </div>
        </div>
    );
};

export default Dashboard;
