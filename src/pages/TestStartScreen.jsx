import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function TestStartScreen() {
  const { bookingId } = useParams();
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestInfo = async () => {
      try {
        const res = await api.post('/api/tests/start', { bookingId });

        if (!res.data.test?.questions || res.data.test.questions.length === 0) {
          await api.post('/api/tests/generate', {
            bookingId,
            topic: res.data.booking.topic,
            difficulty: res.data.booking.difficulty,
            mcqCount: 18,
            subjectiveCount: 2
          });

          const updatedRes = await api.post('/api/tests/start', { bookingId });
          setTestData(updatedRes.data);
        } else {
          setTestData(res.data);
        }
      } catch (err) {
        console.error('🔴 Test Start Error:', err);
        setError(err.response?.data?.error || 'Could not load test information');
      } finally {
        setLoading(false);
      }
    };

    fetchTestInfo();
  }, [bookingId]);

  const handleStart = () => {
    if (testData && testData.test?.questions?.length > 0) {
      navigate(`/test/attempt/${bookingId}`, { state: { testData } });
    } else {
      alert('Test questions not loaded properly. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading test...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      </div>
    );
  }

  const { user, booking, test } = testData || {};
  const scheduledDate = booking?.scheduledAt
    ? new Date(booking.scheduledAt).toLocaleString()
    : new Date().toLocaleString();

  return (
    <div className="container py-5">
      <div
        className="card shadow p-4 border-0 rounded-4"
        style={{ backgroundColor: '#f9f5fc' }}
      >
        <h2 className="text-center mb-4 fw-bold" style={{ color: '#6f42c1' }}>
          📝 Test Overview
        </h2>

        {/* User Info */}
        <div className="card mb-4 shadow-sm border-0 rounded-3">
          <div
            className="card-header bg-white border-bottom fw-semibold"
            style={{ color: '#6f42c1' }}
          >
            👤 User Info
          </div>
          <div className="card-body row">
            <div className="col-md-4"><strong>Name:</strong> {user?.name || 'N/A'}</div>
            <div className="col-md-4"><strong>Email:</strong> {user?.email || 'N/A'}</div>
            <div className="col-md-4"><strong>Degree:</strong> {user?.degree || 'N/A'}</div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="card mb-4 shadow-sm border-0 rounded-3">
          <div
            className="card-header bg-white border-bottom fw-semibold"
            style={{ color: '#6f42c1' }}
          >
            📋 Booking Details
          </div>
          <div className="card-body row">
            <div className="col-md-4"><strong>Topic:</strong> {booking?.topic || 'N/A'}</div>
            <div className="col-md-4"><strong>Difficulty:</strong> {booking?.difficulty || 'Medium'}</div>
            <div className="col-md-4"><strong>Status:</strong> {booking?.status || 'N/A'}</div>
            <div className="col-md-6 mt-2"><strong>Scheduled At:</strong> {scheduledDate}</div>
          </div>
        </div>

        {/* Test Structure */}
        <div className="card mb-4 shadow-sm border-0 rounded-3">
          <div
            className="card-header bg-white border-bottom fw-semibold"
            style={{ color: '#6f42c1' }}
          >
            📑 Test Structure
          </div>
          <div className="card-body row">
            <div className="col-md-4"><strong>Test Name:</strong> {test?.name || 'N/A'}</div>
            <div className="col-md-4"><strong>Duration:</strong> {test?.durationMin || 30} mins</div>
            <div className="col-md-4"><strong>Total Marks:</strong> {test?.totalMarks || 0}</div>
            <div className="col-md-4"><strong>Total Questions:</strong> {test?.totalQuestions || 0}</div>
            <div className="col-md-4"><strong>MCQ:</strong> {test?.mcqCount || booking?.mcqCount || 0}</div>
            <div className="col-md-4"><strong>Subjective:</strong> {test?.subjectiveCount || booking?.subjectiveCount || 0}</div>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center mt-3">
          <button
            className="btn btn-lg btn-success px-5 fw-semibold rounded-3"
            onClick={handleStart}
            disabled={!test?.questions || test.questions.length === 0}
          >
            🚀 Start Test
          </button>
        </div>
      </div>
    </div>
  );
}
