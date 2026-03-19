import React, { useState } from 'react';
import axios from 'axios';

const ContactForm = () => {
  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await axios.post('/api/sendMail', {
        name,
        email,
        message,
      });

      setLoading(false);
      if (response.status === 200) {
        setSuccess('Email sent successfully!');
      }
    } catch (err) {
      setLoading(false);
      setError('Failed to send email. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ContactForm;
