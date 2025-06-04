import React, { useState } from "react";
import { quizData, careerPathData } from "../../data/quiz";
import "./Quiz.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faPaintBrush,
  faHandsHelping,
  faCogs,
  faDumbbell,
  faGear,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";

import Navbar from "../Navabar/Navbar";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
const QuizComponent = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [activeTab, setActiveTab] = useState("page2");
  const [showResult, setShowResult] = useState(false);
  const [selectedCareerPathDescription, setSelectedCareerPathDescription] =
    useState("");
  const tabs = [
    { id: "page1", label: "Learning Platforms" },
    { id: "page2", label: "Funding Opportunities" },
    { id: "page3", label: "NGO" },
  
  ];
  const getPassionIcon = (passion) => {
    switch (passion) {
      case "Education and Research":
        return faGraduationCap;
      case "Art and Design":
        return faPaintBrush;
      case "Social work and community services":
        return faHandsHelping;
      case "Engineering and technology":
        return faCogs;
      case "Sports and physical training":
        return faDumbbell;
      default:
        return faGraduationCap;
    }
  };
  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setSuggestions(null);
    setSelectedOption(null);
    setIsQuizComplete(false);
    setActiveTab("page2");
    setShowResult(false);
    setSelectedCareerPathDescription("");
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const updatedAnswers = { ...answers, [currentQuestion]: selectedOption };
    setAnswers(updatedAnswers);

    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(answers[currentQuestion + 1] || null); // load previous answer if exists
    } else {
      // Calculate career path from answers
      const indexToCareerPath = [
        {
          name: "Education and Research",
          description:
            "You have a curious mind and a love for sharing knowledge. As an educator or researcher, your impact can inspire generations.",
        },
        {
          name: "Art and Design",
          description:
            "You see the world through a creative lens. Let your imagination lead you to craft visuals that speak louder than words.",
        },
        {
          name: "Social work and community services",
          description:
            "Your heart lies in helping others. You could make a significant difference in your community through social work, advocating for change.",
        },
        {
          name: "Engineering and technology",
          description:
            "You thrive in solving complex problems and pushing the boundaries of innovation. A career in engineering can lead you to groundbreaking discoveries.",
        },
        {
          name: "Sports and physical training",
          description:
            "You're passionate about fitness and helping others achieve their physical goals. Sports training could be your path to motivating and guiding others.",
        },
      ];

      const scoreMap = new Array(indexToCareerPath.length).fill(0);

      Object.entries(updatedAnswers).forEach(([qIndex, answer]) => {
        const optionIndex = quizData[qIndex].options.indexOf(answer);
        if (optionIndex !== -1) {
          scoreMap[optionIndex]++;
        }
      });

      const maxIndex = scoreMap.indexOf(Math.max(...scoreMap));
      const selectedCareerPath = indexToCareerPath[maxIndex].name;
      const selectedCareerPathDescription =
        indexToCareerPath[maxIndex].description;

      setResult(selectedCareerPath);
      setSuggestions(careerPathData[selectedCareerPath]);
      setSelectedCareerPathDescription(selectedCareerPathDescription); // Store the description
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentQuestion - 1;
    if (prevIndex >= 0) {
      setCurrentQuestion(prevIndex);
      setSelectedOption(answers[prevIndex] || null);
    }
  };
  return (
    <>
      <Navbar />
      <div className="quiz-container">
        {!result ? (
          <div className="question-box fade-in">
            <h1>Discover Your Passion</h1>
            <p className="quiz-subtitle">
              {quizData[currentQuestion].question}
            </p>
            <div className="options-container">
              {quizData[currentQuestion].options.map((option, idx) => (
                <div
                  key={idx}
                  className={`option ${
                    selectedOption === option ? "selected" : ""
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  <div className="option-circle">{option.id}</div>
                  <span className="option-text">{option.text}</span>
                </div>
              ))}
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(currentQuestion / quizData.length) * 100}%`,
                }}
              ></div>
              <span>
                {Math.round((currentQuestion / quizData.length) * 100)}%
                complete. Keep it up!
              </span>
            </div>

            <div className="button-group">
              <button
                className="prev-button"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                PREVIOUS QUESTION
              </button>

              <button
                className="next-button"
                onClick={handleNext}
                disabled={!selectedOption}
              >
                {currentQuestion === quizData.length - 1
                  ? "SUBMIT QUIZ"
                  : "NEXT QUESTION"}
              </button>
            </div>
          </div>
        ) : (
          <div className="result-container">
            {result && !showResult && (
              <div className={showResult ? "" : "result-main"}>
                <div class="wrapper">
                  <h3 className="title-passion">Your Passion</h3>
                  <p>
                    Based on your answers, we discovered your passion lies in{" "}
                    <br />
                    <b>{result}</b>
                  </p>
                  <div
                    style={{
                      fontSize: "6rem",
                      marginTop: "1rem",
                      color: "#4a90e2",
                    }}
                  >
                    <FontAwesomeIcon icon={getPassionIcon(result)} />
                  </div>
                  <div className="passion-btn">
                    <button
                      onClick={() => setShowResult(true)}
                      className="action-button"
                    >
                      <FontAwesomeIcon icon={faGear} className="action-icon" />{" "}
                      Action
                    </button>
                    <button
                      onClick={handleRetakeQuiz}
                      className="retake-quiz-button"
                    >
                      <FontAwesomeIcon icon={faRedo} className="action-icon" />{" "}
                      Retake Quiz
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showResult && (
              <>
                <h2 className="title-hub">Action Hub</h2>
                <p className="result-description">
                  Based on your passion for <strong>{result}</strong>,
                  we've curated the following resources to help you grow and
                  explore further in this field
                </p>
                <ul className="tabs-container">
                  {tabs.map((tab) => (
                    <li key={tab.id}>
                      <span
                        className={`tab-main ${
                          activeTab === tab.id ? "active" : ""
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {tab.label}
                      </span>
                    </li>
                  ))}
                </ul>
                {activeTab === "page1" &&
                  suggestions?.learningPlatforms?.length > 0 && (
                    <>
                      <div className="grid">
                        {suggestions.learningPlatforms.map((item, idx) => (
                          <div className="card" key={idx}>
                            <img
                              className="card__img"
                              src={item.image}
                              alt={item.name}
                            />
                            <div className="card__content">
                              <h1 className="card__header">{item.name}</h1>
                              <div className="card__text-wrapper">
                                <p className="card__text">{item.description}</p>
                              </div>
                              <a className="card__btn" href={item.url}>
                                Explore <span>&rarr;</span>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                {activeTab === "page2" &&
                  suggestions?.fundingOpportunities?.length > 0 && (
                    <>
                      <div className="grid">
                        {suggestions.fundingOpportunities.map((item, idx) => (
                          <div className="card" key={idx}>
                            <img
                              className="card__img"
                              src={item.image}
                              alt={item.name}
                            />
                            <div className="card__content">
                              <h1 className="card__header">{item.name}</h1>
                              <div className="card__text-wrapper">
                                <p className="card__text">{item.description}</p>
                              </div>
                              <a className="card__btn" href={item.url}>
                                Explore <span>&rarr;</span>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                {activeTab === "page3" && suggestions?.toolkits?.length > 0 && (
                  <>
                    <div className="grid">
                      {suggestions.toolkits.map((item, idx) => (
                        <div className="card" key={idx}>
                          <img
                            className="card__img"
                            src={item.image}
                            alt={item.name}
                          />
                          <div className="card__content">
                            <h1 className="card__header">{item.name}</h1>
                            <div className="card__text-wrapper">
                              <p className="card__text">{item.description}</p>
                            </div>
                            <a className="card__btn" href={item.url}>
                              Explore <span>&rarr;</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default QuizComponent;
