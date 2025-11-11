import React, { useState } from 'react';
import '../component_css/AppHeader.css';

const AppHeader = () => {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <>
      <div className="app-header">
        <div className="app-logo">
          <div className="logo-icon">🎭</div>
          <div className="app-title">
            <h1>Sentiment Aura</h1>
            <p>AI-Powered Emotion Visualizer</p>
          </div>
        </div>
        <button 
          className="help-button"
          onClick={() => setShowInstructions(!showInstructions)}
        >
          <span>?</span>
        </button>
      </div>

      {showInstructions && (
        <div className="instructions-modal" onClick={() => setShowInstructions(false)}>
          <div className="instructions-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowInstructions(false)}>×</button>
            <h2>✨ How to Use</h2>
            <div className="instruction-steps">
              <div className="step">
                <span className="step-number">1</span>
                <p>Click <strong>"Start Recording"</strong> button</p>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <p>Allow microphone access when prompted</p>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <p>Speak clearly into your microphone</p>
              </div>
              <div className="step">
                <span className="step-number">4</span>
                <p>Watch the aura change colors based on your emotions!</p>
              </div>
            </div>
            <div className="color-guide">
              <h3>Color Guide</h3>
              <div className="color-items">
                <div className="color-item">
                  <span className="color-dot" style={{background: '#4CAF50'}}></span>
                  <span>Green = Positive 😊</span>
                </div>
                <div className="color-item">
                  <span className="color-dot" style={{background: '#2196F3'}}></span>
                  <span>Blue = Neutral 😐</span>
                </div>
                <div className="color-item">
                  <span className="color-dot" style={{background: '#f44336'}}></span>
                  <span>Red = Negative 😞</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppHeader;