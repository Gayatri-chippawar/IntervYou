import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function EmotionReportPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/api/tests/emotion-report/${bookingId}`);
      setReport(res.data.emotionReport || 'No feedback available.');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, [bookingId]);

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2 style={{ color: '#6B46C1' }}>🧠 Emotion-Based Feedback Report</h2>
        <p className="text-muted">Generated using your expressions and answers</p>
      </div>

      {loading && <div className="text-center">Loading report...</div>}

      {!loading && error && (
        <div className="alert alert-danger text-center">
          {error}
          <div>
            <button className="btn btn-sm btn-outline-danger mt-2" onClick={fetchReport}>
              Retry
            </button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="card shadow-sm p-4" style={{ backgroundColor: '#f9f0ff', borderRadius: '16px' }}>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: '#4B0082' }}>
            {report}
          </pre>

          <div className="text-center mt-4">
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
