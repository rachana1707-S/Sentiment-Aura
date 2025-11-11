import React from 'react';
import '../component_css/HeroSection.css';

const HeroSection = ({ isRecording }) => {
  if (isRecording) return null; // Hide when recording

  return (
    <div className="hero-section">
      <h2 className="hero-title">Visualize Your Emotions in Real-Time</h2>
      <p className="hero-description">
        Speak naturally and watch as AI analyzes your sentiment, creating a unique visual aura that reflects your emotions.
      </p>
    </div>
  );
};

export default HeroSection;