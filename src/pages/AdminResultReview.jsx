import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AdminResultReview() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const [result, setResult] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState(''); // 'success' or 'danger'

  useEffect(() => {
    if (!token) return navigate('/admin-login');

    const fetchResultDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/admin/result/details/${resultId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const evaluatedResponses = res.data.responses.map(r => ({
          ...r,
          marksAwarded: r.marksAwarded ?? r.marksAwarded ?? 0,
        }));

        setResult(res.data.result);
        setResponses(evaluatedResponses);
      } catch (err) {
        console.error('Error fetching result details', err);
        setAlertType('danger');
        setAlertMsg('❌ Failed to load result details.');
      } finally {
        setLoading(false);
      }
    };

    fetchResultDetails();
  }, [resultId, token, navigate]);

  const updateMarks = (index, newMark) => {
    const updated = [...responses];
    updated[index].marksAwarded = parseFloat(newMark) || 0;
    setResponses(updated);
  };

  const showAlert = (type, message) => {
    setAlertType(type);
    setAlertMsg(message);
    setTimeout(() => setAlertMsg(''), 4000); // auto-hide after 4s
  };

  const confirmResult = async () => {
    const totalMarks = responses.reduce((acc, r) => acc + (r.marksAwarded || 0), 0);

    try {
      await axios.post(
        `http://localhost:5001/api/admin/result/confirm/${resultId}`,
        {
          updatedResponses: responses,
          finalMarks: totalMarks,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showAlert('success', '✅ Result confirmed and emailed.');
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err) {
      console.error('Confirm error:', err);
      showAlert('danger', '❌ Failed to confirm result.');
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!result) return <div className="text-center mt-5">Result not found.</div>;

  const totalGivenMarks = responses.reduce((acc, r) => acc + (r.marksAwarded || 0), 0);

  return (
    <div className="container py-4">
      <h3 className="mb-4 text-primary fw-bold text-center">Review Test Result</h3>

      {/* Alert Message */}
      {alertMsg && (
        <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
          {alertMsg}
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlertMsg('')}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Result Info Card */}
      <div className="card shadow mb-4 rounded-4 overflow-hidden">
        <div className="card-header bg-primary text-white fw-semibold">Result Details</div>
        <div className="card-body">
          <p><strong>User:</strong> {result.user?.name}</p>
          <p><strong>Email:</strong> {result.user?.email}</p>
          <p><strong>Test:</strong> {result.test?.name}</p>
          <p><strong>Total Marks (Test):</strong> {result.totalMarks}</p>
          <p><strong>Final Marks (Admin Edited):</strong> {totalGivenMarks}</p>
        </div>
      </div>

      {/* Responses Table Card */}
      <div className="card shadow rounded-4 overflow-hidden">
        <div className="card-header bg-primary text-white fw-semibold">Response Evaluation</div>
        <div className="card-body p-0">
          <table className="table table-bordered mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>User Answer</th>
                <th>Correct Answer</th>
                <th>Is Correct</th>
                <th>Marks Awarded</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((r, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{r.question || 'Untitled Question'}</td>
                  <td>{r.userAnswer || <span className="text-muted">Not Answered</span>}</td>
                  <td>{r.correctAnswer || 'N/A'}</td>
                  <td>
                    {r.isCorrect ? (
                      <span className="badge bg-success">Correct</span>
                    ) : (
                      <span className="badge bg-danger">Wrong</span>
                    )}
                  </td>
                  <td style={{ width: '120px' }}>
                    <input
                      type="number"
                      className="form-control"
                      value={r.marksAwarded}
                      onChange={(e) => updateMarks(index, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="text-end mt-4">
        <button onClick={confirmResult} className="btn btn-success px-4 py-2 fw-bold">
          Confirm & Send Result
        </button>
      </div>
    </div>
  );
}
