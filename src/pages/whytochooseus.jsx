import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function WhyChooseUs() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const sections = [
    {
      title: "Personalized Feedback",
      description: "Get detailed, AI-powered feedback tailored to your performance to help you improve faster and smarter.",
      imgSrc: "/feedback.jpg",
      reverse: false,
    },
    {
      title: "Real Interview Simulation",
      description: "Experience real-world interview scenarios that prepare you to confidently face any interviewer.",
      imgSrc: "/interview.jpeg",
      reverse: true,
    },
    {
      title: "Expert Curated Questions",
      description: "Answer questions curated by top industry experts to match your career goals and boost your readiness.",
      imgSrc: "/img3.png",
      reverse: false,
    },
    {
      title: "Track Your Progress",
      description: "Monitor your journey with detailed analytics and reports, ensuring consistent growth and preparation.",
      imgSrc: "/img6.png",
      reverse: true,
    }
  ];

  return (
    <div id="merits" className="py-5" style={{ background: 'linear-gradient(to right, #e9d8fd, #d6bcfa, #b794f4)' }}>
      <h2 className="text-center fw-bold display-5 mb-5" data-aos="fade-down">Why Choose IntervYou?</h2>

      <div className="container">
        {sections.map((section, index) => (
          <div className="row align-items-center mb-5" key={index} data-aos="fade-up">
            <div className={section.reverse ? "col-md-6 order-md-2" : "col-md-6"}>
              <div className="px-3">
                <h3 className="h2 fw-bold mb-3">{section.title}</h3>
                <p className="text-muted fs-5">{section.description}</p>
              </div>
            </div>
            <div className={section.reverse ? "col-md-6 order-md-1" : "col-md-6"}>
              <div className="text-center px-3">
                <img
                  src={section.imgSrc}
                  alt={section.title}
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: '380px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
