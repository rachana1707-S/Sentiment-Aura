import React, { useEffect, useRef } from 'react';
import '../component_css/TranscriptDisplay.css';

const TranscriptDisplay = ({ transcript, interimTranscript, sentiment = 0 }) => {
  const scrollRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, interimTranscript]);

  // Update border color based on sentiment
  useEffect(() => {
    if (containerRef.current) {
      let color;
      if (sentiment > 0) {
        // Positive: Green
        const intensity = Math.min(sentiment * 100, 100);
        color = `rgba(76, 175, 80, ${0.3 + intensity / 200})`;
      } else if (sentiment < 0) {
        // Negative: Red
        const intensity = Math.min(Math.abs(sentiment) * 100, 100);
        color = `rgba(244, 67, 54, ${0.3 + intensity / 200})`;
      } else {
        // Neutral: Blue
        color = 'rgba(102, 126, 234, 0.3)';
      }
      
      containerRef.current.style.borderColor = color;
      containerRef.current.style.boxShadow = `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px ${color}`;
    }
  }, [sentiment]);

  return (
    <div className="transcript-display" ref={containerRef}>
      <div className="transcript-header">
        <h3>Live Transcript</h3>
      </div>
      <div className="transcript-content" ref={scrollRef}>
        {transcript ? (
          <>
            <p className="transcript-text">{transcript}</p>
            {interimTranscript && (
              <p className="interim-text">{interimTranscript}</p>
            )}
          </>
        ) : (
          <p className="placeholder-text">
            Start speaking to see your words appear here...
          </p>
        )}
      </div>
    </div>
  );
};

export default TranscriptDisplay;