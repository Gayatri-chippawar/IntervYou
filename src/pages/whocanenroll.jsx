import { useEffect, useRef, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './who.css'; // For hiding scrollbar and any extra tweaks

const WhoCanEnroll = () => {
  const containerRef = useRef(null);
  const [scrollDir, setScrollDir] = useState(1);

  const cards = [
    { title: "Students", img: "/feedback.jpg" },
    { title: "Professionals", img: "/professional.jpeg" },
    { title: "Job Seekers", img: "/jobseeker.jpeg" },
    { title: "Freelancers", img: "/freelancer.jpeg" },
    { title: "College Graduates", img: "/careerchanger.jpg" },
    { title: "Career Changers", img: "/clgstudent.jpeg" },
    { title: "Interns", img: "/intern.jpeg" },
    { title: "Recruiters", img: "/recruiter.jpeg" },
    { title: "Career Coaches", img: "/coach.png" },
    { title: "Human Resource Professionals", img: "/HR.jpeg" },
  ];

  useEffect(() => {
  const container = containerRef.current;
  let frame;

  const scroll = () => {
    if (container) {
      container.scrollLeft += scrollDir * 1; // smaller increment = smoother
      if (
        container.scrollLeft + container.clientWidth >= container.scrollWidth ||
        container.scrollLeft <= 0
      ) {
        setScrollDir(prev => -prev);
      }
    }
    frame = requestAnimationFrame(scroll);
  };

  frame = requestAnimationFrame(scroll);

  return () => cancelAnimationFrame(frame);
}, [scrollDir]);


  return (
    <div className="py-5 bg-light">
      <h2 className="text-center mb-4 text-purple fw-bold">Who Can Enroll?</h2>

      <div className="overflow-hidden px-3">
        <div
          className="d-flex flex-nowrap gap-3 hide-scrollbar"
          ref={containerRef}
          style={{
              overflowX: 'hidden', // or 'auto' if needed manually
              WebkitOverflowScrolling: 'touch'
            }}

        >
          {cards.map((card, index) => (
            <div
              key={index}
              className="card shadow-sm border-0"
              style={{
                minWidth: '220px',
                height: '300px',
                backgroundImage: `url(${card.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '10px',
                position: 'relative',
                flex: '0 0 auto',
              }}
            >
              <div
                className="position-absolute bottom-0 start-0 end-0 text-white text-center fw-semibold py-2"
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  borderBottomLeftRadius: '10px',
                  borderBottomRightRadius: '10px',
                }}
              >
                {card.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhoCanEnroll;
