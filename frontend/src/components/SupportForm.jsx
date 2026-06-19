import React, { useState } from 'react';

const SupportForm = () => {
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('Sending...');
        setTimeout(() => {
            setStatus('✅ Message Sent! Our team will contact you within 2 hours.');
        }, 1500);
    };

    return (
        <div className="card-premium" style={{ marginTop: '40px' }}>
            <h2 style={{ marginBottom: '20px', color: '#000428' }}>Customer Support & Feedback</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>Have a problem with your delivery? Send us a quick message.</p>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Issue Type</label>
                    <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #eee' }}>
                        <option>Late Delivery</option>
                        <option>Damaged Item</option>
                        <option>Incorrect Address</option>
                        <option>Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Message</label>
                    <textarea 
                        rows="4" 
                        placeholder="Write your message here..."
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #eee', fontFamily: 'inherit' }}
                    ></textarea>
                </div>
                <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '12px 30px' }}>Send Message</button>
            </form>
            
            {status && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px', color: '#2e7d32', fontWeight: 'bold' }}>
                    {status}
                </div>
            )}
        </div>
    );
};

export default SupportForm;
