import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { resources } from "../../data/resources";
import { passionCategories } from "../../data/PassionCategories";
import ResourceCard from "./ResourceCard";
import Navbar from "../Navabar/Navbar";
import "./ActionHubPage.css";
import Footer from "../Footer/Footer";

const ActionHubPage = () => {
  const [activeTab, setActiveTab] = useState("ngo");
  const [searchQuery, setSearchQuery] = useState("");
  const [userPassions, setUserPassions] = useState([]);
  const [selectedPassion, setSelectedPassion] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("passionCategories");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserPassions(parsed);
        // Removed default selection of the first passion
      } catch (err) {
        console.error("Error parsing categories:", err);
      }
    }
  }, []);

  const filteredResources = resources.filter((resource) => {
    if (selectedPassion && !resource.categories.includes(selectedPassion))
      return false;
    if (!resource.type.includes(activeTab)) return false;
    if (
      searchQuery &&
      !resource.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <>
      <Navbar />
      <div className="actionhub-page">
        <div className="actionhub-container">
          <div className="header-section">
            <h1>Action Hub</h1>
            <p>Discover opportunities aligned with your passions</p>
          </div>

          <div className="passion-filters">
            {userPassions.map((passionId) => {
              const passion = passionCategories[passionId];
              return passion ? (
                <button
                  key={passionId}
                  onClick={() =>
                    setSelectedPassion(
                      selectedPassion === passionId ? null : passionId
                    )
                  }
                  className={`passion-btn ${
                    selectedPassion === passionId ? "selected" : ""
                  }`}
                >
                  {passion.name}
                </button>
              ) : null;
            })}
          </div>
          <div className="tabs">
            {["ngo", "funding", "learning"].map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`tab-btn ${activeTab === type ? "active" : ""}`}
              >
                {type === "ngo"
                  ? "NGOs"
                  : type === "funding"
                  ? "Funding Opportunities"
                  : "Learning Resources"}
              </button>
            ))}
          </div>

          {filteredResources.length > 0 ? (
            <div className="resources-grid">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <Search className="no-results-icon" />
              <h3>No resources found</h3>
              <p>Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ActionHubPage;
