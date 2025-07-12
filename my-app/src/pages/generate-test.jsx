import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function GenerateTestForm() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [user, setUser] = useState({ name: '', email: '' });
  const [alert, setAlert] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/api/auth/me');
        setUser({ name: res.data.name, email: res.data.email });
      } catch (err) {
        console.error('Failed to fetch user info:', err);
        setAlert({ type: 'danger', message: 'Unable to fetch user info.' });
      }
    };
    fetchUser();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/bookings/create', {
        topic,
        difficulty,
        name: user.name,
        email: user.email
      });
      showAlert('success', 'Test request submitted successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error(err);
      showAlert('danger', 'Failed to submit test request.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-white">
      <div className="card shadow p-4 rounded-4" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-body">
          <h3 className="card-title mb-4 text-center fw-bold text-primary">Request a New Test</h3>

          {/* Bootstrap Alert */}
          {alert.message && (
            <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
              {alert.message}
              <button type="button" className="btn-close" onClick={() => setAlert({ type: '', message: '' })}></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Your Name</label>
              <input type="text" className="form-control rounded-3" value={user.name} disabled />
            </div>
            <div className="mb-3">
              <label className="form-label">Your Email</label>
              <input type="email" className="form-control rounded-3" value={user.email} disabled />
            </div>
            <div className="mb-3">
              <label className="form-label">Test Topic</label>
              <input
                type="text"
                className="form-control rounded-3"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Difficulty</label>
              <select
                className="form-select rounded-3"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100 rounded-3">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
