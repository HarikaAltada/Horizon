import { useState, useEffect, useRef } from "react";
import "./Content.css"; // Custom CSS file
import FeedbackModal from "./FeedbackModal";
import { Link } from "react-router-dom";
import {
  climateChange,
  Pollution,
  Plastic,
  Marketing,
  Investing,
  Math,
  Visualizations,
  Democracy,
  Crime,
} from "../../data/data";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
  EmailIcon,
} from "react-share";

import { Share2 } from "lucide-react"; // Share icon

import TopicSelector from "./TopicSelector";
import Navbar from "../Navabar/Navbar";
import Footer from "../Footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCommentDots,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import HeroSection from "../Home/HeroSection";
import { MessageSquare } from "lucide-react";
const videoData = {
  "Climate Change": climateChange,
  Pollution,
  Plastic,
  Marketing,
  Investing,
  Math,
  Visualizations,
  Democracy,
  Crime,
};

const Content = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("video"); // "video" or "article"
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [pausedIndex, setPausedIndex] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showShare, setShowShare] = useState(null);
  const playerRef = useRef(null);
  const getYouTubeId = (url) => {
    const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:\?|&|$)/);
    return match ? match[1] : "";
  };

  const filteredVideos = (
    selectedTopics.length === 0
      ? Object.values(videoData).flat()
      : selectedTopics.flatMap((topic) => videoData[topic] || [])
  ).filter((video) =>
    video.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  return (
    <>
      <Navbar />

      <h1 className="content-title">Content Library</h1>
      <TopicSelector
        selectedTopics={selectedTopics}
        setSelectedTopics={setSelectedTopics}
        search={searchTerm}
        setSearch={setSearchTerm}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <div className="selected-topics-list">
        {selectedTopics.map((topic) => (
          <span key={topic} className="topic-badge">
            {topic}
            <FontAwesomeIcon
              icon={faTimes}
              className="remove-icon"
              onClick={() =>
                setSelectedTopics(selectedTopics.filter((t) => t !== topic))
              }
            />
          </span>
        ))}
      </div>

      {viewMode === "video" ? (
        <div className="video-grid">
          {filteredVideos.map((video, index) => (
            <div
              key={index}
              className="video-card"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {playingIndex === index && pausedIndex !== index ? (
                <>
                  {/* <iframe
                    id={`video-${index}`}
                    src={`https://www.youtube.com/embed/${getYouTubeId(
                      video.videoUrl
                    )}?autoplay=1&mute=1&enablejsapi=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    style={{ width: "100%", height: "73%" }}
                  ></iframe> */}

                  <iframe
                    id={`video-${index}`}
                    src={`https://www.youtube.com/embed/${getYouTubeId(
                      video.videoUrl
                    )}?enablejsapi=1&autoplay=1&mute=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    style={{ width: "100%", height: "73%" }}
                    onLoad={() => {
                      const iframe = document.getElementById(`video-${index}`);
                      if (iframe && window.YT) {
                        const player = new window.YT.Player(iframe, {
                          events: {
                            onStateChange: (event) => {
                              if (event.data === window.YT.PlayerState.ENDED) {
                                setShowFeedback(true);
                              }
                            },
                          },
                        });
                        playerRef.current = player;
                      }
                    }}
                  ></iframe>
                  {/* Pause Icon */}
                  {hoveredIndex === index && (
                    <FontAwesomeIcon
                      icon={faPause}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPausedIndex(index);
                      }}
                      style={{
                        position: "absolute",
                        top: "40%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "30px",
                        cursor: "pointer",
                        color: "#fff",
                        background: "rgba(0,0,0,0.6)",
                        borderRadius: "50%",
                        padding: "15px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                      }}
                    />
                  )}
                </>
              ) : (
                <>
                  <img
                    src={video.image}
                    alt="video thumbnail"
                    style={{ width: "100%", height: "73%" }}
                    onClick={() => {
                      setPlayingIndex(index);
                      localStorage.setItem("author", video.author);
                      setPausedIndex(null);
                    }}
                  />
                  {hoveredIndex === index && (
                    <FontAwesomeIcon
                      icon={faPlay}
                      onClick={() => {
                        setPlayingIndex(index);
                        setPausedIndex(null);
                      }}
                      style={{
                        position: "absolute",
                        top: "40%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "30px",
                        cursor: "pointer",
                        color: "#fff",
                        background: "rgba(0,0,0,0.6)",
                        borderRadius: "50%",
                        padding: "15px",
                        paddingLeft: "20px",
                        paddingRight: "15px",
                      }}
                    />
                  )}
                </>
              )}

              <h3 className="video-title">{video.name}</h3>
              <div className="video-info">
                <p className="video-author">{video.author}</p>
                <div className="video-meta">
                  <p className="video-duration">{video.duration}</p>

                  <Link to="/content/feedback">
                    <MessageSquare
                      size={23}
                      strokeWidth={1.5}
                      className="comment-icon"
                      title="Give Feedback"
                      onClick={() => {
                        localStorage.setItem("videoAuthor", video.author);
                      }}
                    />
                  </Link>

                  <Share2
                    size={23}
                    strokeWidth={1.5}
                    className="share-icon"
                    title="Share Video"
                    onClick={() => setSelectedVideo(video)}
                  />
                </div>
                {selectedVideo && (
                  <div className="share-modal">
                    <div className="share-content">
                      <h3>Share "{selectedVideo.name}"</h3>
                      <div className="share-icons">
                        <FacebookShareButton url={selectedVideo.videoUrl}>
                          <FacebookIcon size={32} round />
                        </FacebookShareButton>
                        <TwitterShareButton
                          url={selectedVideo.videoUrl}
                          title={selectedVideo.name}
                        >
                          <TwitterIcon size={32} round />
                        </TwitterShareButton>
                        <WhatsappShareButton
                          url={selectedVideo.videoUrl}
                          title={selectedVideo.name}
                        >
                          <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                        <TelegramShareButton
                          url={selectedVideo.videoUrl}
                          title={selectedVideo.name}
                        >
                          <TelegramIcon size={32} round />
                        </TelegramShareButton>
                        <EmailShareButton url={selectedVideo.videoUrl}>
                          <EmailIcon size={32} round />
                        </EmailShareButton>
                      </div>
                      <button
                        onClick={() => setSelectedVideo(null)}
                        className="close-share"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === "article" ? (
        <section class="articles">
          {filteredVideos.map((article, index) => (
            <article key={index}>
              <div class="article-wrapper">
                <figure>
                  <img src={article.imageUrl} alt="climate" />
                </figure>
                <div class="article-body">
                  <h2>{article.name}</h2>
                  <p>{article.description}</p>
                  <a href={article.link} class="read-more">
                    Read more{" "}
                    <span class="sr-only">about this is some title</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <>
          <div className="book-card-container">
            {filteredVideos.map((book, index) => (
              <div key={index} className="book-card">
                <div className="book-card__cover">
                  <div className="book-card__book">
                    <div className="book-card__book-front">
                      <img
                        className="book-card__img"
                        src={book.bookImage}
                        alt={book.bookName}
                      />
                    </div>
                    <div className="book-card__book-back"></div>
                    <div className="book-card__book-side"></div>
                  </div>
                </div>
                <div className="book-content">
                  <div className="book-card__title">{book.bookName}</div>
                  <div className="book-card__author">
                    {book.bookDescription}
                  </div>
                  <a href={book.bookUrl} className="read-more">
                    Read more{" "}
                    <span className="sr-only">about this is some title</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <FeedbackModal
        show={showFeedback}
        onClose={() => setShowFeedback(false)}
      />

      <Footer />
    </>
  );
};

export default Content;
