import React, { useState, useEffect } from "react";
import Navbar from "../Navabar/Navbar";
import Footer from "../Footer/Footer";
import { formatDistanceToNow } from "date-fns";
import { arrayRemove } from "firebase/firestore";

import ReplyForm from "./ReplyForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { db } from "../config/firebaseconfig";

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import Banner from "../ActionHub/Banner";
import {
  MessageSquareIcon,
  ThumbsDown,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import "./FeedbackList.css";
import { deleteDoc } from "firebase/firestore";

function FeedbackList() {
  const [activeTab, setActiveTab] = useState("general");
  const [feedbacks, setFeedbacks] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const videoAuthor = localStorage.getItem("videoAuthor");
    if (!videoAuthor) return;

    const q = query(
      collection(db, "feedbacks"),
      where("type", "==", activeTab),
      where("author", "==", videoAuthor) // assuming 'author' is the field in Firebase
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFeedbacks(data);
    });

    return () => unsubscribe();
  }, [activeTab]);

  const Username = JSON.parse(localStorage.getItem("currentUser"));
  const currentUser = Username?.name || "anonymous";

  const handleLike = async (feedbackId) => {
    const feedback = feedbacks.find((f) => f.id === feedbackId);
    const ref = doc(db, "feedbacks", feedbackId);

    const liked = feedback?.likedBy?.includes(currentUser);
    const disliked = feedback?.dislikedBy?.includes(currentUser);

    const updates = {};

    if (liked) {
      updates.likes = (feedback.likes || 1) - 1;
      updates.likedBy = arrayRemove(currentUser);
    } else {
      updates.likes = (feedback.likes || 0) + 1;
      updates.likedBy = arrayUnion(currentUser);
      if (disliked) {
        updates.dislikes = (feedback.dislikes || 1) - 1;
        updates.dislikedBy = arrayRemove(currentUser);
      }
    }

    await updateDoc(ref, updates);
  };

  const handleDislike = async (feedbackId) => {
    const feedback = feedbacks.find((f) => f.id === feedbackId);
    const ref = doc(db, "feedbacks", feedbackId);

    const liked = feedback?.likedBy?.includes(currentUser);
    const disliked = feedback?.dislikedBy?.includes(currentUser);

    const updates = {};

    if (disliked) {
      updates.dislikes = (feedback.dislikes || 1) - 1;
      updates.dislikedBy = arrayRemove(currentUser);
    } else {
      updates.dislikes = (feedback.dislikes || 0) + 1;
      updates.dislikedBy = arrayUnion(currentUser);
      if (liked) {
        updates.likes = (feedback.likes || 1) - 1;
        updates.likedBy = arrayRemove(currentUser);
      }
    }

    await updateDoc(ref, updates);
  };
  const handleDeleteReply = async (feedbackId, replyIndex) => {
    const feedback = feedbacks.find((f) => f.id === feedbackId);
    if (!feedback || !feedback.replies) return;

    const updatedReplies = [...feedback.replies];
    updatedReplies.splice(replyIndex, 1); // remove the reply by index

    const feedbackRef = doc(db, "feedbacks", feedbackId);
    await updateDoc(feedbackRef, {
      replies: updatedReplies,
    });
  };

  const handleReplySubmit = async (replyData, feedbackId) => {
    const feedbackRef = doc(db, "feedbacks", feedbackId);

    await updateDoc(feedbackRef, {
      replies: arrayUnion({
        ...replyData,
        timestamp: new Date(),
      }),
    });

    setReplyingTo(null); // close the form
  };
  const handleDeleteFeedback = async (feedbackId) => {
  try {
    const feedbackRef = doc(db, "feedbacks", feedbackId);
    await deleteDoc(feedbackRef);
    console.log("Feedback deleted");
  } catch (error) {
    console.error("Error deleting feedback:", error);
  }
};

  const tabs = [
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
  return (
    <div>
      <Navbar />
      <Banner imageUrl="/assets/663b9b70ff53a383fc50eea2_Feedback-Culture-Exploring-Its-Purpose-Benefits-And-How-To-Build-One.jpg" />

      <div>
        <ul className="tabs-container-feedback">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <span
                className={`tab-main-feedback ${tab.id} ${
                  activeTab === tab.id ? "active" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span className="tab-label-feedback">{tab.label}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="review-list">
        {feedbacks.length === 0 ? (
          <div className={`no-data-container`}>
            <div className="no-data-icon">
              <MessageSquareIcon size={64} strokeWidth={1.5} />
            </div>

            <h3 className="no-data-title">No feedbacks yet</h3>

            <p className="no-data-message">
              When customers leave feedback, they will appear here.
            </p>
          </div>
        ) : (
          feedbacks.map((item) => (
            <div className="review-container" key={item.id}>
              <div className="review-header">
                <div className="avatar-text">
                  {item.name?.charAt(0).toUpperCase()}
                </div>
                <div >
                  <h4 className="reviewer-name">{item.name}</h4>
                  <span className="review-time">
                    {item.timestamp
                      ? formatDistanceToNow(item.timestamp.toDate(), {
                          addSuffix: true,
                        })
                      : ""}
                  </span>
                </div>
                 {item.name === currentUser && (
                <div className="ellipsis-menu-container">
                  
                  <FontAwesomeIcon
                    icon={faEllipsisV}
                    className="ellipsis-icon"
                    onClick={() =>
                      setOpenMenuId(openMenuId === item.id ? null : item.id)
                    }
                  />
                  {openMenuId === item.id && (
                    <div className="dropdown-delete">
                      <button  className="dropdown-delete-btn"    onClick={() => handleDeleteFeedback(item.id)}>
                        <Trash2 size={16} className="trash-icon" /> 
                        Delete
                      </button>
                    </div>
                  )}
                </div>)}
              </div>
              {item.rating && (
                <div className="rating">{"★".repeat(item.rating)}</div>
              )}
              <div className="reviewer-info">
                <h3>{item.relatedContent}</h3>
                <p>{item.subject}</p>
                <p className="review-text">{item.message}</p>

                <div className="review-actions">
                  <button
                    onClick={() => handleLike(item.id)}
                    className={`thumb-btn like-btn ${
                      item.likedBy?.includes(currentUser) ? "active" : ""
                    }`}
                  >
                    <ThumbsUp size={16} />
                    <span className="thumb-count">{item.likes || 0}</span>
                  </button>

                  <button
                    onClick={() => handleDislike(item.id)}
                    className={`thumb-btn dislike-btn ${
                      item.dislikedBy?.includes(currentUser) ? "active" : ""
                    }`}
                  >
                    <ThumbsDown size={16} />
                    <span className="thumb-count">{item.dislikes || 0}</span>
                  </button>

                  <button
                    onClick={() => setReplyingTo(item.id)}
                    className="thumb-btn save-btn"
                  >
                    <MessageSquare size={16} />
                    Reply
                  </button>
                </div>
             
                {replyingTo === item.id && (
                  <ReplyForm
                    onSubmit={(replyData) =>
                      handleReplySubmit(replyData, item.id)
                    }
                    onCancel={() => setReplyingTo(null)}
                    initialAuthor=""
                  />
                )}

                {item.replies && item.replies.length > 0 && (
                  <div className="replies-section">
                    {item.replies.map((reply, index) => (
                      <div key={index} className="single-reply">
                        <div className="reply-container">
                          <div className="reply-header">
                            <div>
                              {/* <h4 className="reply-subject">{reply.subject}</h4> */}
                              <div className="reply-meta">
                                <h3>{reply.author}</h3>{" "}
                                <span className="review-time">
                                  {reply.timestamp
                                    ? formatDistanceToNow(
                                        reply.timestamp.toDate(),
                                        {
                                          addSuffix: true,
                                        }
                                      )
                                    : ""}
                                </span>
                              </div>
                            </div>
                            {/* <button
                              className="reply-delete-button"
                              aria-label="Delete reply"
                              onClick={() => handleDeleteReply(item.id, index)}
                            >
                              <Trash2 size={14} className="trash-icon" />
                              Delete
                            </button> */}
                            {reply.author === currentUser && (
                              <button
                                className="reply-delete-button"
                                aria-label="Delete reply"
                                onClick={() =>
                                  handleDeleteReply(item.id, index)
                                }
                              >
                                <Trash2 size={14} className="trash-icon" />
                                Delete
                              </button>
                            )}
                          </div>
                          <p className="reply-message">{reply.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}

export default FeedbackList;
