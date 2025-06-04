import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { questions } from '../../data/questions';
import './QuestionnairePage.css';
import Navbar from '../Navabar/Navbar';
import Banner from './Banner';
import Footer from '../Footer/Footer';
const QuestionnairePage = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = (currentQuestionIndex / totalQuestions) * 100;

  const handleOptionSelect = (optionId) => {
    setSelectedOptions({ ...selectedOptions, [currentQuestion.id]: optionId });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      const selectedCategories = {};
      Object.entries(selectedOptions).forEach(([questionId, optionId]) => {
        const questionObj = questions.find(q => q.id === parseInt(questionId));
        if (questionObj) {
          const option = questionObj.options.find(opt => opt.id === optionId);
          if (option) {
            option.categories.forEach(category => {
              selectedCategories[category] = (selectedCategories[category] || 0) + 1;
            });
          }
        }
      });

      const sortedCategories = Object.entries(selectedCategories)
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);

      sessionStorage.setItem('passionCategories', JSON.stringify(sortedCategories.slice(0, 3)));
      navigate('/results');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const isOptionSelected = (optionId) => selectedOptions[currentQuestion.id] === optionId;
  const canProceed = !!selectedOptions[currentQuestion.id];

  return (
    <>
    <Navbar/>
    <Banner   imageUrl=" ./assets/istockphoto-530750278-612x612.jpg" />
    

    <div className="questionnaire-container">
       <div className="questionnaire-header">
  <h1 className="questionnaire-title">Discover Your Passion</h1>
  <p className="questionnaire-description">
    Answer a few quick questions to uncover your top interests and get personalized insights into your ideal paths and pursuits.
  </p>
  </div>
      <div className="questionnaire-inner">
        <div className="progress-wrapper">
          <div className="progress-header">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className='progress-header'>
             <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        <div className="question-card">
          <div className={`fade-transition ${isAnimating ? 'fade-out' : 'fade-in'}`}>
            <h2 className="question-text">{currentQuestion.text}</h2>

            <div>
              {currentQuestion.options.map(option => (
                <button
                  key={option.id}
                  className={`option-button ${isOptionSelected(option.id) ? 'option-selected' : ''}`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center',marginTop:'3px' }}>
                    <div className={`option-radio ${isOptionSelected(option.id) ? 'radio-selected' : ''}`}>
                      {isOptionSelected(option.id) && <Check size={16} />}
                    </div>
                    <div className='option-info'>{option.text}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="nav-buttons">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`nav-button nav-prev ${currentQuestionIndex === 0 ? 'disabled' : ''}`}
            >
              <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`nav-button nav-next ${!canProceed ? 'disabled' : ''}`}
            >
              {currentQuestionIndex < totalQuestions - 1 ? 'Next' : 'See Results'}
              <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default QuestionnairePage;
