import { useState } from "react";
import "./TopicSelector.css"; // Import custom CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Filter } from "lucide-react"; // you can choose other icons too

export default function TopicSelector({
  selectedTopics,
  setSelectedTopics,
  search,
  setSearch,
  viewMode,
  setViewMode,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Climate Change");

  const topics = {
    "Climate Change": ["Climate Change", "Plastic", "Pollution"],
    Business: ["Marketing", "Investing"],
    Education: ["Math", "Visualizations"],
    Politics: ["Crime", "Democracy"],
  };

  const togglePopup = () => setIsOpen(!isOpen);

  const handleTopicClick = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const filteredTopics = topics[selectedTab].filter((topic) =>
    topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="search-topic-container">
      {/* Search Input */}

      <div className="search-input-wrapper">
        <FontAwesomeIcon icon={faSearch} className="search-icon-topic" />
        <input
          type="text"
          className="search-input-topic"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Topics Button */}
      <div className="btns">
        <span
          className={`view-toggle-btn ${viewMode === "video" ? "active" : ""}`}
          onClick={() => setViewMode("video")}
        >
          Videos
        </span>
        <span
          className={`view-toggle-btn ${
            viewMode === "article" ? "active" : ""
          }`}
          onClick={() => setViewMode("article")}
        >
          Articles
        </span>
        <span
          className={`view-toggle-btn ${viewMode === "books" ? "active" : ""}`}
          onClick={() => setViewMode("books")}
        >
          Books
        </span>
        <div className="open-popup-btn" onClick={togglePopup}>
          <div style={{marginTop:"1px"}}>
          <Filter size={17} />
          </div>
          <div>
          <span className="filter-text">Filter</span>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="popup-header">
              <h2>Topics</h2>
              <button className="close-btn" onClick={togglePopup}>
                &times;
              </button>
            </div>

            {/* Tabs */}
            <div className="topic-tabs-content">
              {Object.keys(topics).map((tab) => (
                <button
                  key={tab}
                  className={`tab-btn-content ${selectedTab === tab ? "active" : ""}`}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Topic Selection */}
            <div className="topics-main">
              <div className="topics-list">
                {filteredTopics.map((topic) => (
                  <button
                    key={topic}
                    className={`topic-btn ${
                      selectedTopics.includes(topic) ? "selected" : ""
                    }`}
                    onClick={() => handleTopicClick(topic)}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="popup-footer">
              <span>{selectedTopics.length} topics selected</span>
              <span className="reset-btn" onClick={() => setSelectedTopics([])}>
                Reset
              </span>
              <button className="show-results-btn" onClick={togglePopup}>
                Show results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
