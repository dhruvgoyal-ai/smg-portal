import React, { useState } from 'react';

const TrackingSearch = () => {
    const [trackingId, setTrackingId] = useState('');
    const [result, setResult] = useState(null);

    const mockDetails = {
        'SMG-123': { status: 2, text: 'In Transit', location: 'New Delhi Distribution Center' },
        'SMG-456': { status: 1, text: 'Order Processed', location: 'Hoshiarpur Warehouse' },
        'SMG-789': { status: 3, text: 'Delivered', location: 'Customer Doorstep' }
    };

    const handleSearch = () => {
        setResult(mockDetails[trackingId] || 'Not Found');
    };

    const steps = ['Processed', 'Shipped', 'In Transit', 'Delivered'];

    return (
        <div className="card-premium" style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '20px', color: '#000428' }}>Quick Track</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                    type="text" 
                    placeholder="Enter Tracking ID (try SMG-123)" 
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '2px solid #eee' }}
                />
                <button onClick={handleSearch} className="btn-primary" style={{ width: 'auto' }}>Track Now</button>
            </div>

            {result && result !== 'Not Found' && (
                <div className="animate-fade" style={{ marginTop: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 'bold' }}>Current Status: {result.text}</span>
                        <span style={{ color: '#666' }}>Location: {result.location}</span>
                    </div>
                    
                    {/* Visual Progress Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: '30px' }}>
                        <div style={{ 
                            position: 'absolute', 
                            top: '15px', 
                            left: '5%', 
                            right: '5%', 
                            height: '4px', 
                            backgroundColor: '#eee', 
                            zIndex: 1 
                        }}></div>
                        <div style={{ 
                            position: 'absolute', 
                            top: '15px', 
                            left: '5%', 
                            width: `${(result.status / 3) * 90}%`, 
                            height: '4px', 
                            backgroundColor: '#00b894', 
                            zIndex: 2,
                            transition: 'width 1s ease-in-out'
                        }}></div>
                        
                        {steps.map((step, index) => (
                            <div key={index} style={{ zIndex: 3, textAlign: 'center' }}>
                                <div style={{ 
                                    width: '30px', 
                                    height: '30px', 
                                    borderRadius: '50%', 
                                    backgroundColor: index <= result.status ? '#00b894' : 'white',
                                    border: `4px solid ${index <= result.status ? '#00b894' : '#eee'}`,
                                    margin: '0 auto'
                                }}></div>
                                <span style={{ fontSize: '12px', marginTop: '5px', display: 'block', fontWeight: index <= result.status ? '600' : '400' }}>
                                    {step}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {result === 'Not Found' && (
                <p style={{ color: 'red', marginTop: '20px' }}>Tracking ID not found. Please check and try again.</p>
            )}
        </div>
    );
};

export default TrackingSearch;
