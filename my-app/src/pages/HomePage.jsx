import React, { useEffect, useState } from 'react';
import './home.css';

const phrases = [
  'WELCOME to IntervYou – Your stage. Your story. Your success.',
  'Ace your interviews with real-time practice.',
  'Let’s begin your journey to greatness!',
];

export default function Home() {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // ⬅️ Control text color: white if video is dark, black if video is light
  const textColor = 'white'; // change to 'black' if your background video is light

  useEffect(() => {
    const currentPhrase = phrases[index];
    let typeSpeed = isDeleting ? 30 : 100;

    const typing = setTimeout(() => {
      if (!isDeleting) {
        setText(currentPhrase.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);

        if (charIndex === currentPhrase.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        setText(currentPhrase.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);

        if (charIndex === 0) {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(typing);
  }, [charIndex, isDeleting, index]);

  return (
    <div className="position-relative min-vh-100 overflow-hidden text-center">
      {/* 🎬 Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="position-fixed top-0 start-0 w-100 h-100 object-fit-cover z-n1"
      >
        <source src="/your-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 📝 Text Content */}
      <div className="d-flex flex-column align-items-center justify-content-start min-vh-100" style={{ paddingTop: '120px', zIndex: 1 }}>
        <h1
          className="fs-1 fw-semibold mx-auto px-4 mb-4 font-monospace typewriter"
          style={{
            maxWidth: '860px',
            lineHeight: '1.6',
            color: textColor,
            textShadow: '2px 2px 6px rgba(0,0,0,0.6)', // Better readability on bright videos
          }}
        >
          {text}
          <span className="blinking-cursor">|</span>
        </h1>

        <a href="/login" className="position-fixed bottom-0 mb-5">
          <button
            className="btn btn-lg px-5 py-3 fw-bold shadow"
            style={{
              background: 'linear-gradient(to right, #e9d5ff, #d8b4fe, #c084fc)',
              color: '#222',
              borderRadius: '50px',
              fontSize: '1.3rem',
            }}
          >
            Start Now
          </button>
        </a>
      </div>
    </div>
  );
}
