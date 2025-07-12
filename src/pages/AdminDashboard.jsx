import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [documents, setDocuments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pendingResults, setPendingResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null); // ⬅️ Bootstrap alert
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) return navigate('/admin-login');

    const fetchAdminData = async () => {
      try {
        const [docsRes, bookingsRes, resultsRes] = await Promise.all([
          axios.get('http://localhost:5001/api/admin/documents', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5001/api/admin/bookings', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5001/api/admin/result/pending', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setDocuments(docsRes.data);
        setBookings(bookingsRes.data);
        setPendingResults(resultsRes.data);
      } catch (err) {
        console.error('❌ Admin fetch error:', err);
        setAlert({ type: 'danger', message: 'Failed to fetch admin data.' });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate, token]);

  const updateDocStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:5001/api/admin/documents/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDocuments(prev => prev.map(doc => (doc._id === id ? { ...doc, status } : doc)));
      setAlert({ type: 'success', message: `Document marked as ${status}.` });
    } catch (err) {
      console.error('❌ Document status update failed:', err);
      setAlert({ type: 'danger', message: 'Failed to update document status.' });
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:5001/api/admin/bookings/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(prev => prev.map(b => (b._id === id ? { ...b, status } : b)));
      setAlert({ type: 'success', message: `Booking marked as ${status}.` });
    } catch (err) {
      console.error('❌ Booking status update failed:', err);
      setAlert({ type: 'danger', message: 'Failed to update booking status.' });
    }
  };

  const confirmResult = async (resultId) => {
    try {
      await axios.post(
        `http://localhost:5001/api/admin/result/confirm/${resultId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingResults(prev => prev.filter(r => r._id !== resultId));
      setAlert({ type: 'success', message: '✅ Result finalized and emailed successfully.' });
    } catch (err) {
      console.error('❌ Finalize result error:', err);
      setAlert({ type: 'danger', message: 'Failed to finalize result.' });
    }
  };

  const deleteDocument = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/admin/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(prev => prev.filter(doc => doc._id !== id));
      setAlert({ type: 'success', message: '✅ Document deleted successfully.' });
    } catch (err) {
      console.error('❌ Delete document error:', err);
      setAlert({ type: 'danger', message: 'Failed to delete document.' });
    }
  };

  const deleteBooking = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/admin/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(prev => prev.filter(b => b._id !== id));
      setAlert({ type: 'success', message: '✅ Booking deleted successfully.' });
    } catch (err) {
      console.error('❌ Delete booking error:', err);
      setAlert({ type: 'danger', message: 'Failed to delete booking.' });
    }
  };

  const deleteResult = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/admin/result/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingResults(prev => prev.filter(r => r._id !== id));
      setAlert({ type: 'success', message: '✅ Result deleted successfully.' });
    } catch (err) {
      console.error('❌ Delete result error:', err);
      setAlert({ type: 'danger', message: 'Failed to delete result.' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div className="d-flex" style={{ height: '100vh' }}>
        {/* Sidebar */}
        <div
          className="p-3"
          style={{
            width: '220px',
            backgroundColor: '#e6f0ff',
            boxShadow: '8px 0 16px rgba(0, 0, 0, 0.3)',
            zIndex: 1,
            borderTopRightRadius: '1rem',
            borderBottomRightRadius: '1rem',
          }}
        >
          <h4 className="fw-bold mb-4 text-primary">Admin Panel</h4>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <a className="nav-link active text-dark" href="#doc">📄 Documents</a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link text-dark" href="#book">📅 Bookings</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark" href="#test">📝 Test Submissions</a>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 p-4 bg-light overflow-auto">
          {/* Alerts */}
          {alert && (
            <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
              {alert.message}
              <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
            </div>
          )}

          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4 bg-white rounded-4 shadow p-3">
            <div className="d-flex align-items-center">
              <img src="/logo.png" alt="Admin Logo" style={{ width: '60px', height: '40px', marginRight: '10px' }} />
              <h4 className="fw-bold text-primary mb-0">Admin Dashboard</h4>
            </div>
            <div className="d-flex align-items-center">
              <button className="btn btn-light position-relative me-3 shadow-sm">
            🔔
              </button>
              <div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-3" style={{ width: '40px', height: '40px' }}>
                A
              </div>
              <button onClick={handleLogout} className="btn btn-outline-danger">Logout</button>
            </div>
          </div>

          {/* Welcome Banner */}
          <div
  className="d-flex justify-content-between align-items-center text-white rounded-4 shadow p-4 mb-4"
  style={{
    background: 'linear-gradient(135deg, #1e3a8a, #2563eb, #3b82f6)', // Dark blue gradient
  }}
>
  <div>
    <h5>Welcome Admin</h5>
    <p>Manage user documents,interview bookings and test submissions efficiently .</p>
  </div>
  <img src="/admin.svg" style={{ height: '150px' }} alt="Admin Illustration" />
</div>



          {/* Documents */}
          <div id="doc" className="card shadow rounded-4 mb-4">
                <div
        className="card-header text-white fw-bold rounded-top-4"
        style={{ background: '#4338ca' }}
      >
        Submitted Documents
      </div>


            <div className="card-body table-responsive">
              {documents.length === 0 ? (
                <p>No documents submitted yet.</p>
              ) : (
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Document</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map(doc => (
                      <tr key={doc._id}>
                        <td>{doc.userId?.name || 'N/A'}</td>
                        <td>{doc.userId?.email || 'N/A'}</td>
                        <td>{doc.docType}</td>
                        <td>{doc.status}</td>
                        <td>
                          <button
                            className="btn btn-info btn-sm me-2"
                            onClick={() =>
                              window.open(
                                `http://localhost:5001/api/document/download/${doc.fileId}?token=${token}`,
                                '_blank'
                              )
                            }
                          >
                            View
                          </button>
                          <button className="btn btn-danger btn-sm me-2" onClick={() => deleteDocument(doc._id)}>
                            Delete
                          </button>
                          {doc.status === 'PENDING' ? (
                            <>
                              <button className="btn btn-success btn-sm me-2" onClick={() => updateDocStatus(doc._id, 'APPROVED')}>
                                Approve
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => updateDocStatus(doc._id, 'REJECTED')}>
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-muted">No actions</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Bookings */}
          <div id="book" className="card shadow rounded-4 mb-4">
          <div
          className="card-header text-white fw-bold rounded-top-4"
          style={{ background: '#0e7490' }}
        >
          Interview Bookings
        </div>

            <div className="card-body table-responsive">
              {bookings.length === 0 ? (
                <p>No bookings found.</p>
              ) : (
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Topic</th>
                      <th>Scheduled At</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id}>
                        <td>{b.user?.name || 'N/A'}</td>
                        <td>{b.user?.email || 'N/A'}</td>
                        <td>{b.test?.topic || b.topic || 'N/A'}</td>
                        <td>{b.scheduledAt ? new Date(b.scheduledAt).toLocaleString() : 'Not Scheduled'}</td>
                        <td>{b.status}</td>
                        <td>
                          <button className="btn btn-danger btn-sm me-2" onClick={() => deleteBooking(b._id)}>
                            Delete
                          </button>
                          {b.status === 'PENDING' ? (
                            <>
                              <button className="btn btn-success btn-sm me-2" onClick={() => updateBookingStatus(b._id, 'APPROVED')}>
                                Approve
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => updateBookingStatus(b._id, 'REJECTED')}>
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-muted">No actions</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Test Submissions */}
          <div id="test" className="card shadow rounded-4">
            <div className="card-header bg-success text-white fw-bold rounded-top-4">
              Test Submissions to Review
            </div>
            <div className="card-body table-responsive">
              {pendingResults.length === 0 ? (
                <p>No test submissions to review.</p>
              ) : (
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Test</th>
                      <th>Score</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingResults.map(r => (
                      <tr key={r._id}>
                        <td>{r.user?.name || 'N/A'}</td>
                        <td>{r.user?.email || 'N/A'}</td>
                        <td>{r.test?.name || 'Test'}</td>
                        <td>{r.marksObtained} / {r.totalMarks}</td>
                        <td>
                          <button className="btn btn-danger btn-sm me-2" onClick={() => deleteResult(r._id)}>
                            Delete
                          </button>
                          <button className="btn btn-info btn-sm" onClick={() => navigate(`/admin/review/${r._id}`)}>
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
      </div>
    </>
  );
}
