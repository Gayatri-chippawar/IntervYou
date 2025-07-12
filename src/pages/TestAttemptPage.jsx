import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as faceapi from 'face-api.js';
import * as tf from '@tensorflow/tfjs';
import axios from 'axios';



export default function TestAttemptPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [testData, setTestData] = useState(location.state?.testData || null);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [showCalc, setShowCalc] = useState(false);
  const [showCompiler, setShowCompiler] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [submitAlert, setSubmitAlert] = useState(null);  // For showing alert
 
  useEffect(() => {
  const interval = setInterval(captureEmotion, 5000); // every 5s
  return () => clearInterval(interval); // clear on unmount/change
}, [currentIndex]);


tf.setBackend('cpu').then(() => {
  faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  faceapi.nets.faceExpressionNet.loadFromUri('/models');
});
  useEffect(() => {
    if (!testData) {
      const fetchTest = async () => {
        try {
          const res = await api.post('/api/tests/start', { bookingId });
          setTestData(res.data);
          setTimer(res.data.test.durationMin * 60);
        } catch (err) {
          console.error(err);
          alert('Failed to start test');
          navigate('/dashboard');
        }
      };
      fetchTest();
    } else {
      setTimer(testData.test.durationMin * 60);
    }
  }, [bookingId, navigate, testData]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera access denied', err);
      }
    };
    enableCamera();
  }, []);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

useEffect(() => {
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Failed to access webcam:', err);
    }
  };

  startCamera();

  return () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };
}, []);



  const [emotions, setEmotions] = useState({});
  const captureEmotion = async () => {
  if (videoRef.current) {
    const detections = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detections && detections.expressions) {
      const currentQuestionId = testData.test.questions[currentIndex].id;
      const emotionData = {
        time: Date.now(),
        expressions: detections.expressions
      };

      setEmotions(prev => ({
        ...prev,
        [currentQuestionId]: [...(prev[currentQuestionId] || []), emotionData]
      }));
    }
  }
};



  const handleSubmit = async () => {
  if (isSubmitting) return;
  setIsSubmitting(true);

  try {
    // Stop webcam stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));

    await api.post('/api/tests/submit', { bookingId, answers: formattedAnswers,
      emotions });

    setSubmitAlert({ type: 'success', message: '✅ Test submitted successfully!' });
    
     setTimeout(() => {
      navigate(`/emotion-report/${bookingId}`);
    }, 1500);

  } catch (err) {
    console.error('Submission failed:', err);
    setSubmitAlert({ type: 'danger', message: `❌ Submission failed: ${err.response?.data?.error || 'Please try again'}` });
  } finally {
    setIsSubmitting(false);
  }
};


const runCode = async () => {
  setOutput('Running...');

  const languageMap = {
    javascript: 63, // Node.js
    python: 71,     // Python 3
    cpp: 54         // C++ (GCC)
  };

  try {
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: code,
        language_id: languageMap[language],
        stdin: ""
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": "6ed0ac5729mshcb9e9918036ac98p1930cfjsn01de8e7a5965",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
        }
      }
    );

    const result = response.data;
    const out =
      result.stdout || result.compile_output || result.stderr || "⚠️ No output";
    setOutput(out);
  } catch (err) {
    console.error(err);
    setOutput("❌ Execution failed. Please check your code and try again.");
  }
};








  const renderQuestion = () => {
    if (!testData) return null;
    const question = testData.test.questions[currentIndex];
    const currentAnswer = answers[question.id] || '';

    return (
      <div className="p-4 rounded" style={{ backgroundColor: '#f9f0ff' }}>
        <h5 className="fw-bold mb-3" style={{ color: '#9370DB' }}>
          <span className="rounded-circle d-inline-flex align-items-center justify-content-center me-2" 
                style={{ width: '30px', height: '30px', backgroundColor: '#9370DB', color: 'white' }}>
            {currentIndex + 1}
          </span>
          {question.body}
        </h5>

        {question.type === 'MCQ' ? (
          question.options?.map((option, idx) => (
            <div key={idx} className="form-check mb-2">
              <input
                type="radio"
                id={`q-${question.id}-${idx}`}
                name={`q-${question.id}`}
                checked={currentAnswer === option}
                onChange={() => handleAnswer(question.id, option)}
                className="form-check-input"
                style={{ accentColor: '#9370DB' }}
              />
              <label htmlFor={`q-${question.id}-${idx}`} className="form-check-label">
                {option}
              </label>
            </div>
          ))
        ) : (
          <textarea
            className="form-control mb-2"
            rows="3"
            value={currentAnswer}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder="Type your answer here..."
            style={{ borderColor: '#9370DB' }}
          />
        )}
      </div>
    );
  };

  if (!testData) return <div className="text-center mt-5">Loading test...</div>;

  return (
    
<div className="container-fluid p-4" style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
  {submitAlert && (
  <div className={`alert alert-${submitAlert.type} alert-dismissible fade show mt-3`} role="alert">
    {submitAlert.message}
    <button type="button" className="btn-close" onClick={() => setSubmitAlert(null)}></button>
  </div>
)}

  <div className="row g-4">
    {/* Left Sidebar */}
    <div className="col-md-4">
      <div className="card h-100" style={{ 
        borderRadius: '16px',
        border: 'none',
        boxShadow: '0 8px 24px rgba(147, 112, 219, 0.15)',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #ffffff, #f8f5ff)'
      }}>
        <div className="card-header" style={{ 
           background: 'linear-gradient(135deg, #6b46c1, #9f7aea, #d6bcfa)' ,
          color: 'white',
          borderRadius: '16px 16px 0 0' // Rounded top corners only
        }}>
          <h5 className="mb-0">Interview Dashboard</h5>
        </div>
        <div className="card-body d-flex flex-column">
          {/* Webcam Section with Rounded Corners */}
          <div className="mb-4" style={{ 
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(147, 112, 219, 0.1)',
            
          }}>
            <h6 className="fw-bold mb-3" style={{ 
              color: '#7B68EE',
              padding: '0 12px'
            }}>
              
            </h6>
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-100"
              style={{ 
                height: '300px', 
                objectFit: 'cover',
                border: '2px solid #d1c4e9',
                borderRadius: '8px', // Rounded corners for video
                display: 'block' // Ensures rounded corners work
              }}
            ></video>
          </div>

          {/* Calculator/Compiler Buttons */}
          <div className="d-flex gap-2 mb-4">
            <button 
              className="btn btn-sm flex-grow-1" 
              onClick={() => setShowCalc(!showCalc)}
              style={{ 
                borderRadius: '12px',
                background: showCalc ? 'linear-gradient(135deg, #9370DB, #7B68EE)' : 'linear-gradient(145deg, #ede7f6, #ffffff)',
                color: showCalc ? 'white' : '#7B68EE',
                border: 'none',
                boxShadow: '0 4px 8px rgba(147, 112, 219, 0.2)'
              }}
            >
              Calculator
            </button>
            <button 
              className="btn btn-sm flex-grow-1" 
              onClick={() => setShowCompiler(!showCompiler)}
              style={{ 
                borderRadius: '12px',
                background: showCompiler ? 'linear-gradient(135deg, #9370DB, #7B68EE)' : 'linear-gradient(145deg, #ede7f6, #ffffff)',
                color: showCompiler ? 'white' : '#7B68EE',
                border: 'none',
                boxShadow: '0 4px 8px rgba(147, 112, 219, 0.2)'
              }}
            >
              Compiler
            </button>
          </div>

          {/* Calculator Panel */}
          {showCalc && (
  <div className="mb-3 flex-grow-1" style={{ 
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(147, 112, 219, 0.1)'
  }}>
    <div className="py-2 px-3" style={{ 
      background: 'linear-gradient(135deg, #9370DB, #7B68EE)',
      color: 'white',
      fontWeight: 'bold'
    }}>
      Calculator
    </div>
    <div style={{ height: '300px', backgroundColor: '#fff' }}>
      <iframe
        title="calculator"
        src="https://www.desmos.com/scientific"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
      />
    </div>
  </div>
)}


          {/* Compiler Panel */}
          {showCompiler && (
  <div className="mb-3 flex-grow-1">
    <div className="card shadow-sm h-100">
      <div
        className="card-header py-2"
        style={{ backgroundColor: '#9370DB', color: 'white' }}
      >
        Compiler
      </div>
      <div className="card-body">
        <select
          className="form-select form-select-sm mb-2"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>

        <textarea
          className="form-control mb-2"
          rows="5"
          placeholder="Write your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ fontSize: '0.8rem' }}
        ></textarea>

        <button
          className="btn btn-sm w-100 mb-2"
          onClick={runCode}
          style={{ backgroundColor: '#9370DB', color: 'white' }}
        >
          Run Code
        </button>

        {output && (
          <pre
            className="p-2 bg-dark text-success rounded overflow-auto"
            style={{ maxHeight: '120px', fontSize: '0.8rem' }}
          >
            {output}
          </pre>
        )}
      </div>
    </div>
  </div>
)}

            </div>
          </div>
        </div>
        {/* Main Content - Now takes up remaining space */}
        <div className="col-md-8">
  <div className="card shadow-sm h-100" 
       style={{ 
         borderRadius: '16px', 
         border: '1px solid #e6e6fa', 
         overflow: 'hidden' 
       }}>
    
    <div className="card-header d-flex justify-content-between align-items-center" 
         style={{ 
           background: 'linear-gradient(135deg, #6b46c1, #9f7aea, #d6bcfa)', 
           color: 'white',
           borderTopLeftRadius: '16px',
           borderTopRightRadius: '16px'
         }}>
      
      <h5 className="mb-0">Test - {testData.test.name}</h5>
      
      <div className="d-flex align-items-center">
        <span className="badge bg-white text-dark fs-6 px-3 py-1 me-2">
          ⏰ {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
        </span>
        <button 
          className="btn btn-sm" 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          style={{ backgroundColor: '#ff6b6b', color: 'white', borderRadius: '8px' }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
            <div className="card-body">
              {renderQuestion()}

              <div className="d-flex justify-content-between mt-4">
                <button
                  className="btn"
                  style={{ 
                    backgroundColor: '#d8b4f8', // Softer lavender-pink background
    color: '#6b46c1',           // Deep purple text
    width: '120px',
    fontWeight: '600'
                  }}
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(currentIndex - 1)}
                >
                  Previous
                </button>

                <div className="d-flex flex-wrap justify-content-center gap-2">
                  {testData.test.questions.map((q, idx) => {
                    const attempted = answers.hasOwnProperty(q.id);
                    const isCurrent = currentIndex === idx;
                    return (
                      <button
                        key={idx}
                        className={`btn btn-sm fw-bold ${
                          isCurrent ? 'text-white' :
                          attempted ? 'text-white' : 'text-dark'
                        }`}
                        style={{
                          width: '36px',
                          height: '36px',
                          backgroundColor: isCurrent ? '#9370DB' : 
                                          attempted ? '#4CAF50' : '#e6e6fa',
                          borderRadius: '50%',
                          padding: 0
                        }}
                        onClick={() => setCurrentIndex(idx)}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <button
  className="btn"
  style={{
    backgroundColor: '#d8b4f8', // Softer lavender-pink background
    color: '#6b46c1',           // Deep purple text
    width: '120px',
    fontWeight: '600'
  }}
  disabled={currentIndex === testData.test.questions.length - 1}
  onClick={() => setCurrentIndex(currentIndex + 1)}
>
  Next
</button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}