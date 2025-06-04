import "./FeedbackModal.css"; // Create CSS for modal
import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  ThumbsUp,
} from "lucide-react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faStar, faCheck } from "@fortawesome/free-solid-svg-icons";
import { db } from "../config/firebaseconfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
const FeedbackModal = ({ show, onClose }) => {
  const [feedbackType, setFeedbackType] = useState("general");
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const authorName = currentUser?.name || "anonymous";

  
  const subject = formData.get("subject")?.trim();
  const message = formData.get("message")?.trim();
  const consent = formData.get("consent");

  if (
    
    !message &&
    !consent &&
    (feedbackType === "issue" && !subject)
  ) {
    alert("Please fill in all required fields and accept the privacy policy.");
    return;
  }

  // ✅ Get author from localStorage (assuming it's stored under 'author')
  const author = localStorage.getItem("author");

  const data = {
    type: feedbackType,
    subject,
    message,
    rating: feedbackType === "praise" ? rating : null,
    relatedContent: formData.get("content") || "",
    timestamp: Timestamp.now(),
    author: author || "anonymous", // fallback if nothing in localStorage
    name:authorName
  };

  try {
    await addDoc(collection(db, "feedbacks"), data);
    setSubmitted(true);
    console.log("Feedback submitted:", data);
  } catch (error) {
    console.error("Error submitting feedback:", error);
  }
};

  if (!show) return null;

  const feedbackTypes = [
    {
      id: "general",
      label: "General Feedback",
      icon: <MessageSquare size={20} />,
    },
    {
      id: "issue",
      label: "Report an Issue",
      icon: <AlertTriangle size={20} />,
    },
    { id: "suggestion", label: "Suggestion", icon: <Lightbulb size={20} /> },
    { id: "praise", label: "Praise", icon: <ThumbsUp size={20} /> },
  ];
  if (submitted) {
    return (
      <div className="feedback-modal-overlay">
        <div className="feedback-main">
          <div className="feedback-thankyou">
            <div className="success-icon-box">
              <FontAwesomeIcon
                icon={faCheck}
                size="5x"
                className="success-icon"
              />{" "}
              {/* Use FontAwesome success icon */}
            </div>
            <h1 className="thankyou-title">Thank You for Your Feedback!</h1>
            <p className="thankyou-subtext">
              Your input is valuable to us and helps improve our platform for
              everyone.
            </p>
            <div className="submit-close">
              <button
                className="btn-feedback"
                onClick={() => setSubmitted(false)}
              >
                Submit Another Feedback
              </button>
              <button className="btn-feedback cancel" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-container">
        <div className="feedback-box">
        

          <div className="form-card">
            <div className="form-inner">
              <div className="feedback-type-section">
                <div className="feedback-header">
                  <h2 className="form-label">
                    What type of feedback do you have?
                  </h2>
                  <button
                    onClick={onClose}
                    className="close-button"
                    aria-label="Close"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <p className="feedback-subtitle">
                  Your input helps us improve our platform and address any
                  concerns about content attribution or legal matters.
                </p>
                <div className="feedback-type-grid">
                  {feedbackTypes.map((type) => (
                    <button
                      key={type.id}
                      className={`feedback-type-button ${
                        feedbackType === type.id ? "active" : ""
                      }`}
                      onClick={() => setFeedbackType(type.id)}
                    >
                      <div
                        className={`feedback-icon ${
                          feedbackType === type.id ? "active-icon" : ""
                        }`}
                      >
                        {type.icon}
                      </div>
                      <span className="feedback-label">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="feedback-form">
                {feedbackType === "praise" && (
                  <div className="form-group">
                    <label className="form-label">Rate Your Experience *</label>
                    <div className="star-rating">
                      {[...Array(10)].map((_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar}
                          onClick={() =>
                            setRating(i + 1 === rating ? 0 : i + 1)
                          }
                          onMouseEnter={() => setHover(i + 1)}
                          onMouseLeave={() => setHover(null)}
                          className={`star-icon ${
                            i < (hover ?? rating) && rating !== 0
                              ? "filled"
                              : ""
                          }`}
                        />
                      ))}
                      {/* <span className="rating-text">{rating}/10</span> */}
                    </div>
                  </div>
                )}

                {(feedbackType === "issue" || feedbackType === "general") && (
                  <div className="form-group">
                    <label htmlFor="content" className="form-label">
                      Related Content (Optional)
                    </label>
                    <input
                      type="text"
                      id="content"
                      name="content"
                      placeholder="Video title"
                      className="form-input"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    Subject {feedbackType === "issue" && "*"}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required={feedbackType === "issue"}
                    placeholder="Brief summary of your feedback"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="6"
                    placeholder="Please provide details..."
                    className="form-input"
                  ></textarea>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="consent"
                      required
                      className="checkbox-input"
                    />
                    <span>
                      I agree that my information will be processed according to
                      the{" "}
                      <a href="/legal/privacy" className="link">
                        Privacy Policy
                      </a>
                      . You may contact me about this feedback. *
                    </span>
                  </label>
                </div>

                <button type="submit" className="btn-primary">
                  Submit Feedback
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
