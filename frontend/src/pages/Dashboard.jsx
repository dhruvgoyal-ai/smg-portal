import React from 'react';
import Navbar from '../components/Navbar';
import TrackingSearch from '../components/TrackingSearch';
import SupportForm from '../components/SupportForm';



const Dashboard = () => {
    // Simulated data for demo purposes
    const stats = [
        { label: 'Active Shipments', value: '3', color: '#003366' },
        { label: 'Delivered', value: '12', color: '#28a745' },
        { label: 'Pending Payment', value: '1', color: '#ff9900' }
    ];

    const shipments = [
        { id: 'SMG-98721', status: 'In Transit', origin: 'Mumbai', destination: 'Hoshiarpur', date: '2026-06-18' },
        { id: 'SMG-98715', status: 'Out for Delivery', origin: 'Delhi', destination: 'Jalandhar', date: '2026-06-17' },
        { id: 'SMG-98600', status: 'Delivered', origin: 'Chandigarh', destination: 'Hoshiarpur', date: '2026-06-15' }
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
                                <p style={{ fontSize: '40px', fontWeight: '800', color: '#000428' }}>{stat.value}</p>
                                <div style={{ 
                                    padding: '12px', 
                                    backgroundColor: `${stat.color}15`, 
                                    borderRadius: '12px',
                                    color: stat.color,
                                    fontWeight: 'bold'
                                }}>
                                    ↑ 12%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Shipments Table */}
                <div className="card-premium">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#000428' }}>Live Tracking</h2>
                        <button className="btn-primary" style={{ width: 'auto', padding: '10px 20px' }}>+ New Shipment</button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                        <thead>
                            <tr style={{ background: 'transparent' }}>
                                <th>Tracking ID</th>
                                <th>Route</th>
                                <th>Status</th>
                                <th>Estimated Delivery</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shipments.map((item, index) => (
                                <tr key={index} style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.03)', borderRadius: '15px', overflow: 'hidden' }}>
                                    <td style={{ padding: '20px', fontWeight: '700', color: '#004e92' }}>{item.id}</td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontWeight: '600' }}>{item.origin}</span>
                                            <span style={{ color: '#ccc' }}>→</span>
                                            <span style={{ fontWeight: '600' }}>{item.destination}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{
                                            padding: '6px 14px',
                                            borderRadius: '30px',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            backgroundColor: item.status === 'Delivered' ? '#00b89420' : '#fdcb6e20',
                                            color: item.status === 'Delivered' ? '#00b894' : '#e17055',
                                            border: `1px solid ${item.status === 'Delivered' ? '#00b89440' : '#e1705540'}`
                                        }}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px', color: '#666', fontWeight: '500' }}>{item.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <SupportForm />
            </div>
        </div>

    );
};


export default Dashboard;
