import React, { useEffect, useState, useRef } from 'react';
import '../component_css/KeywordsDisplay.css';

const KeywordsDisplay = ({ keywords, sentiment = 0 }) => {
  const [displayedKeywords, setDisplayedKeywords] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!keywords || keywords.length === 0) {
      setDisplayedKeywords([]);
      return;
    }

    setDisplayedKeywords([]);

    keywords.forEach((keyword, index) => {
      setTimeout(() => {
        setDisplayedKeywords(prev => {
          if (!prev.includes(keyword)) {
            return [...prev, keyword];
          }
          return prev;
        });
      }, index * 200);
    });
  }, [keywords]);

  // Update border color based on sentiment
  useEffect(() => {
    if (containerRef.current) {
      let color;
      if (sentiment > 0) {
        const intensity = Math.min(sentiment * 100, 100);
        color = `rgba(76, 175, 80, ${0.3 + intensity / 200})`;
      } else if (sentiment < 0) {
        const intensity = Math.min(Math.abs(sentiment) * 100, 100);
        color = `rgba(244, 67, 54, ${0.3 + intensity / 200})`;
      } else {
        color = 'rgba(118, 75, 162, 0.3)';
      }
      
      containerRef.current.style.borderColor = color;
      containerRef.current.style.boxShadow = `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px ${color}`;
    }
  }, [sentiment]);

  return (
    <div className="keywords-display" ref={containerRef}>
      <div className="keywords-header">
        <h3>Keywords</h3>
      </div>
      <div className="keywords-content">
        {displayedKeywords.length === 0 ? (
          <p className="placeholder-text">Keywords will appear here...</p>
        ) : (
          <div className="keywords-grid">
            {displayedKeywords.map((keyword, index) => (
              <div
                key={`${keyword}-${index}`}
                className="keyword-tag"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {keyword}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KeywordsDisplay;
