import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function UserResultList() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Added missing loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get('http://localhost:5001/api/result/my/results');
        console.log('✅ Results fetched:', res.data);
        setResults(res.data);
      } catch (err) {
        console.error('❌ Result fetch failed:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

return (
  <div className="container py-4">
    <div id="results" className="card shadow rounded-4">
      
      {/* Card Header with Back Button + Title */}
      <div
        className="card-header d-flex justify-content-between align-items-center text-white fw-bold rounded-top-4"
        style={{
          background: 'linear-gradient(135deg, #6b46c1, #9f7aea, #d6bcfa)',
        }}
      >
                <button
          className="btn btn-sm text-white px-3"
          style={{
            backgroundColor: '#f472b6', // tailwind pink-400
            border: 'none',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
          }}
          onClick={() => navigate('/dashboard')}
        >
          ← Back
        </button>


        <span className="flex-grow-1 text-center" style={{ marginRight: '35px' }}>
          My Test Results
        </span>
      </div>

      {/* Card Body with Table */}
      <div className="card-body table-responsive">
        {loading ? (
          <p>Loading...</p>
        ) : results.length === 0 ? (
          <p>No confirmed test results available.</p>
        ) : (
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Test</th>
                <th>Marks</th>
                <th>Submitted At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r._id}>
                  <td>{r.test?.name || 'N/A'}</td>
                  <td>
                    {r.marksObtained} / {r.test?.totalMarks || 'N/A'}
                  </td>
                  <td>{new Date(r.submittedAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-sm text-white"
                      style={{ backgroundColor: '#6b46c1' }}
                      onClick={() => navigate(`/my/${r._id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </div>
);

}
