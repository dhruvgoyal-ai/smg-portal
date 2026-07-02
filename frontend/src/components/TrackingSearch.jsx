import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

// Map backend status strings to a 0-3 progress index
const STATUS_INDEX = {
    'Pending':          0,
    'Picked Up':        1,
    'In Transit':       2,
    'Out For Delivery': 2,
    'Delivered':        3,
};

const steps = ['Processed', 'Picked Up', 'In Transit', 'Delivered'];

const TrackingSearch = () => {
    const [trackingId, setTrackingId] = useState('');
    const [result, setResult]         = useState(null);   // null | 'not-found' | object
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState('');

    const handleSearch = async () => {
        const id = trackingId.trim().toUpperCase();
        if (!id) return;

        setLoading(true);
        setResult(null);
        setError('');

        try {
            const res = await axios.get(`${API}/api/tracking/${id}`);
            const data = res.data;
            setResult({
                text:     data.currentStatus,
                location: data.currentLocation,
                status:   STATUS_INDEX[data.currentStatus] ?? 0,
                expected: data.expectedDeliveryDate,
            });
        } catch (err) {
            if (err.response?.status === 404) {
                setResult('not-found');
            } else {
                setError(err.response?.data?.message || 'Error fetching tracking info.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className="card-premium" style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '20px', color: '#000428' }}>Quick Track</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Enter Tracking ID (e.g. SMG-98721)"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '2px solid #eee' }}
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: 'auto' }}
                >
                    {loading ? 'Searching…' : 'Track Now'}
                </button>
            </div>

            {error && (
                <p style={{ color: '#e17055', marginTop: '16px' }}>{error}</p>
            )}

            {result && result !== 'not-found' && (
                <div className="animate-fade" style={{ marginTop: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontWeight: 'bold' }}>Current Status: {result.text}</span>
                        <span style={{ color: '#666' }}>Location: {result.location}</span>
                        {result.expected && (
                            <span style={{ color: '#666' }}>
                                Expected: {new Date(result.expected).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    {/* Visual Progress Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: '30px' }}>
                        {/* Track background */}
                        <div style={{
                            position: 'absolute',
                            top: '15px',
                            left: '5%',
                            right: '5%',
                            height: '4px',
                            backgroundColor: '#eee',
                            zIndex: 1
                        }} />
                        {/* Track fill */}
                        <div style={{
                            position: 'absolute',
                            top: '15px',
                            left: '5%',
                            width: `${(result.status / 3) * 90}%`,
                            height: '4px',
                            backgroundColor: '#00b894',
                            zIndex: 2,
                            transition: 'width 1s ease-in-out'
                        }} />

                        {steps.map((step, index) => (
                            <div key={index} style={{ zIndex: 3, textAlign: 'center' }}>
                                <div style={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    backgroundColor: index <= result.status ? '#00b894' : 'white',
                                    border: `4px solid ${index <= result.status ? '#00b894' : '#eee'}`,
                                    margin: '0 auto'
                                }} />
                                <span style={{
                                    fontSize: '12px',
                                    marginTop: '5px',
                                    display: 'block',
                                    fontWeight: index <= result.status ? '600' : '400'
                                }}>
                                    {step}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {result === 'not-found' && (
                <p style={{ color: '#e17055', marginTop: '20px' }}>
                    Tracking ID not found. Please check and try again.
                </p>
            )}
        </div>
    );
};

export default TrackingSearch;
