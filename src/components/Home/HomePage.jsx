import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Leaf,
  Users,
  Map,
  BookOpen,
  Heart,
  HandHelping,
  ArrowRight,
  Globe,
  HandHeart,
  LightbulbIcon,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./HomePage.css"; // Custom CSS file
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const steps = [
    {
      icon: <Heart className="icon red" />,
      title: "Find Your Passion",
      description:
        "Take our in-depth questionnaire designed to help you uncover what truly motivates and excites you.",
      link: "/quiz",
    },
    {
      icon: <HandHelping className="icon green" />,
      title: "Take Action",
      description:
        "Browse our curated collections of NGOs, funding opportunities, and learning resources aligned with your interests.",
      link: "/quiz",
    },
    {
      icon: <Map className="icon blue" />,
      title: "Connect on the Map",
      description:
        "Find like-minded individuals and organizations with similar passions in your area or around the world.",
      link: "/map",
    },
    {
      icon: <BookOpen className="icon amber" />,
      title: "Explore Resources",
      description:
        "Discover curated videos, articles, books, and resources on various interests",
      link: "/content",
    },
    {
      icon: <Users className="icon purple" />,
      title: "Join the Community",
      description:
        "Connect with others who share your interests and work together on projects",
      link: "/chat",
    },
  ];

  const [progress, setProgress] = useState(0);
const navigate = useNavigate();

  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 } // Adjust as needed
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 0.5;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [hasAnimated]);

  return (
    <div className="home-container">
      {/* Features Section */}
      <div className="zigzag-container">
        <div className="section-header-home">
          <h1>How Horizon Works</h1>
          <p>
            We connect passionate individuals with the tools, resources, and
            community they need to create meaningful change for a sustainable
            future.
          </p>
        </div>
        <div className="timeline-wrapper" ref={sectionRef}>
          <div className="timeline-line">
            <div
              className="timeline-fill"
              style={{ height: `${progress}%` }}
            ></div>
          </div>

          {steps.map((step, index) => (
            <div
              key={index}
              className={`timeline-step ${index % 2 === 0 ? "left" : "right"} ${
                progress > (index * 100) / steps.length ? "active" : ""
              }`}
            >
              <div className="home-card">
                <div className="icon">{step.icon}</div>
                <div className="content-video">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                {/* <Link to={step.link} className="learn-more-btn">Learn More <ArrowRight className="icon-small" /></Link> */}

                <a
                  className="learn-more-btn"
                  onClick={() => {
                    const user = JSON.parse(
                      localStorage.getItem("currentUser")
                    );
                    if (user) {
                      navigate(step.link); // or use window.location.href = step.link;
                    } else {
                      toast.error("Please login to access this feature.");
                    }
                  }}
                >
                  Learn More <ArrowRight className="icon-small" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
