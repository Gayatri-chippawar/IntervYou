import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [booking, setBooking] = useState(null);
  const [documentStatus, setDocumentStatus] = useState(null);
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, historyRes,bookingRes, docRes] = await Promise.all([
          api.get('/api/auth/me'),
          api.get('/api/result/my/results'),
          api.get('/api/bookings/my'),
          api.get('/api/document/my')
        ]);
        setUser(userRes.data);
        setInterviewHistory(historyRes.data.slice(0, 3));
        setBooking(bookingRes.data[0] || null);
        setDocumentStatus(docRes.data[0]?.status || null);
      } catch (err) {
        console.error('Dashboard fetch failed:', err);
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleCreateTest = () => {
    if (!documentStatus || documentStatus === 'REJECTED') {
      return;
    }
    if (documentStatus === 'PENDING') {
      return;
    }
    if (!booking || booking.status === 'REJECTED' || booking.status === 'COMPLETED') {
      navigate('/generate-test');
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 px-0">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center py-3 px-4 bg-white shadow-sm w-100 position-fixed" style={{ top: 0, zIndex: 1050 }}>
        <div className="d-flex align-items-center">
          <img src="/logo.png" alt="Logo" style={{ height: 40 }} className="me-2" />
          <h5 className="m-0 fw-bold">Dashboard</h5>
        </div>
        <div className="d-flex align-items-center" >
          <button className="btn btn-light position-relative me-3 shadow-sm">
            🔔
          </button>
          <div className="d-flex align-items-center me-3">
            <span className="me-2 fw-semibold">{user?.name}</span>
            <div
              className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
              style={{ width: 45, height: 45, fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => navigate('/profile')}
              title="Go to Profile"
            >
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
          <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Alerts */}
      <div style={{ paddingTop: '80px'}}>
      {showAlert && (
        <div className="w-100" >
          <div className="container" style={{ maxWidth: '1140px' }}>
            {documentStatus === 'PENDING' && (
              <div className="alert alert-warning alert-dismissible fade show mt-2" role="alert">
                ⚠️ Your document is under review. You can create a test once it's verified.
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowAlert(false)}></button>
              </div>
            )}
            {documentStatus === 'REJECTED' && (
              <div className="alert alert-danger alert-dismissible fade show mt-2" role="alert">
                ❌ Your document was rejected. Please upload a valid one to continue.
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowAlert(false)}></button>
              </div>
            )}
            {!documentStatus && (
              <div className="alert alert-info alert-dismissible fade show mt-2" role="alert">
                📄 Please upload your resume to start booking interview tests.
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowAlert(false)}></button>
              </div>
            )}
          </div>
        </div>
         )}
      </div>

      {/* Body */}
      <div className="d-flex pt-4 mt-0.3">
        {/* Sidebar */}
        <div className="d-flex flex-column align-items-start py-4 px-3 shadow"
          style={{
            background: 'linear-gradient(to right, #f6f3fc, #e8dcfb, #d2b8f9)',
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            width: 250,
            height: 'calc(100vh - 70px)',
            marginTop: 20,
          }}
        >
          <button
            className="btn text-purple bg-white shadow-sm fw-semibold w-100 mb-4 d-flex align-items-center justify-content-between"
            onClick={handleCreateTest}
            disabled={!documentStatus || documentStatus === 'PENDING' || documentStatus === 'REJECTED'}
          >
            Create New Test <span className="fs-4">＋</span>
          </button>

          <button className="btn bg-transparent w-100 mb-3 text-start fw-bold text-dark" onClick={() => navigate('/upload-documents')}>
            📄 Upload Resume
          </button>
          <button className="btn bg-transparent w-100 mb-3 text-start fw-bold text-dark" onClick={() => navigate('/my/results')}>
            📊 Results
          </button>
          <button className="btn bg-transparent w-100 mb-3 text-start fw-bold text-dark" onClick={() => navigate('/profile')}>
            👤 View Profile
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 p-4" style={{ marginLeft: 5 }}>
          <div className="card shadow-lg rounded-4 mb-4 d-flex flex-row justify-content-between align-items-center text-white"
            style={{
              padding: 30,
              background: 'linear-gradient(135deg, #6b46c1, #9f7aea, #d6bcfa)'
            }}>
            <div>
              <h3 className="fw-bold mb-2">Hi, {user?.name}</h3>
              <p className="mb-0">“Your success is the result of preparation, hard work, and learning from failure.”</p>
            </div>
            <img src="/dashboard.svg" alt="Illustration" style={{ height: 180 }} />
          </div>

          {booking && (
            <div className="mb-4">
              {booking.status === 'PENDING' && (
                <div className="alert alert-warning shadow-sm">🕐 Your test request is pending admin approval.</div>
              )}
              {(booking.status === 'APPROVED' || booking.status === 'IN_PROGRESS') && (
                <div className="card shadow-lg border-0 d-flex flex-row align-items-center p-3"
                  style={{
                    backgroundColor: booking.status === 'IN_PROGRESS' ? '#fff8db' : '#e3e4ff',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/test/start/${booking._id}`)}
                >
                  <img src="/test.svg" alt="New Test" style={{ width: 80, height: 80, objectFit: 'contain' }} className="me-4" />
                  <div>
                    <h6 className="fw-bold text-dark">🆕 Test {booking.status === 'IN_PROGRESS' ? 'In Progress' : 'Allotted'}</h6>
                    <p className="text-muted mb-0">
                      {booking.status === 'APPROVED'
                        ? 'You have a new interview test approved. Click to start!'
                        : 'You have an in-progress test. Click to resume!'}
                    </p>
                  </div>
                </div>
              )}
              {booking.status === 'REJECTED' && (
                <div className="alert alert-danger shadow-sm">❌ Your test request was rejected. Please try again.</div>
              )}
              {booking.status === 'COMPLETED' && (
                <div className="alert alert-success shadow-sm">✅ Your test is completed. You can now create a new one.</div>
              )}
            </div>
          )}

         <div className="row">
  {interviewHistory.length === 0 ? (
    <p className="text-muted">No tests attempted yet.</p>
  ) : (
    interviewHistory.map((item, index) => (
      <div className="col-md-4 mb-4" key={index}>
        <div className="flip-card">
          <div className="flip-card-inner">
            <div className="flip-card-front" style={{ backgroundColor: '#ffe0f0' }}>
              <h6 className="fw-bold">{item.test?.name || `Test ${index + 1}`}</h6>
              <p className="mb-1">Score: {item.marksObtained} / {item.totalMarks}</p>
              <small className="text-muted">Status: Completed</small>
            </div>
            <div className="flip-card-back" style={{ backgroundColor: '#ffe0f0' }}>
              <p className="fw-bold">View detailed result and answer evaluation.</p>
              <div className="d-flex justify-content-center">
  <button 
    className="btn btn-sm"
    style={{ 
      backgroundColor: '#A259FF', 
      color: 'white',
      border: 'none',
      borderRadius: '20px',     // more rounded
      padding: '6px 16px',      // small padding
      minWidth: '100px'         // reduce width
    }}
    onClick={() => navigate(`/my/${item._id}`)}
  >
    View Result
  </button>
</div>

            </div>
          </div>
        </div>
      </div>
    ))
  )}
</div>




        </div>
      </div>
    </div>
  );
}