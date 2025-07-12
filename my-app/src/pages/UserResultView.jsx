import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function UserResultView() {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ added
  const [result, setResult] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    console.log('🔍 Fetching result with ID:', id);
    console.log('🔐 Token:', token);

    api
      .get(`http://localhost:5001/api/result/my/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setResult(res.data))
      .catch((err) => {
        console.error('❌ Single result fetch failed', err);
      });
  }, [id]);

  if (!result) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container py-4">
      {/* 🔙 Back Button */}
      <button
        className="btn btn-sm text-white px-3 mb-3"
        style={{
          backgroundColor: '#f472b6', // Distinct pinkish color
          border: 'none',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
        }}
        onClick={() => navigate('/my/results')}
      >
        ← Back
      </button>

      {/* Card 1: Result Summary */}
      <div className="card shadow mb-4 border-0 rounded-4 overflow-hidden">
        <div className="card-header bg-purple text-white fw-semibold">
          Result Summary
        </div>
        <div className="card-body">
          <h4 className="fw-bold mb-3">{result.test.name}</h4>
          <p>
            <strong>Total Marks:</strong> {result.test.totalMarks}
          </p>
          <p>
            <strong>Obtained Marks:</strong> {result.marksObtained}
          </p>
          <p>
            <strong>Status:</strong>{' '}
            <span
              className={
                result.status === 'CONFIRMED'
                  ? 'badge bg-success'
                  : 'badge bg-danger'
              }
            >
              {result.status}
            </span>
          </p>
        </div>
      </div>

      {/* Card 2: Evaluation List */}
      <div className="card shadow border-0 rounded-4 overflow-hidden">
        <div className="card-header bg-purple text-white fw-semibold">
          Evaluation Breakdown
        </div>
        <div className="card-body">
          {result.evaluation.map((e, idx) => (
            <div
              key={idx}
              className="border-bottom pb-3 mb-3"
              style={{ fontSize: '15px' }}
            >
              <p>
                <strong>Q{idx + 1}:</strong> {e.question}
              </p>
              <p>
                <strong>Your Answer:</strong> {e.userAnswer}
              </p>
              <p>
                <strong>Correct Answer:</strong> {e.correctAnswer}
              </p>
              <p>
                <strong>Marks Awarded:</strong>{' '}
                <span className="badge bg-secondary">{e.marksAwarded ?? e.markGiven}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
