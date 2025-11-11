

import React from 'react';
import '../component_css/Controls.css';

const Controls = ({ 
  isRecording, 
  isPaused,
  onStart, 
  onStop, 
  onPause,
  onResume,
  onClear,
  isConnected, 
  error,
  hasTranscript 
}) => {
  return (
    <div className="controls">
      <div className="controls-container">
        {!isRecording ? (
          <button 
            className="control-button start-button" 
            onClick={onStart}
            disabled={!!error}
          >
            <div className="button-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" fill="currentColor"/>
              </svg>
            </div>
            <span>Start Recording</span>
          </button>
        ) : (
          <>
            {!isPaused ? (
              <button 
                className="control-button pause-button" 
                onClick={onPause}
              >
                <div className="button-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="6" y="5" width="4" height="14" fill="currentColor"/>
                    <rect x="14" y="5" width="4" height="14" fill="currentColor"/>
                  </svg>
                </div>
                <span>Pause</span>
              </button>
            ) : (
              <button 
                className="control-button resume-button" 
                onClick={onResume}
              >
                <div className="button-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5v14l11-7z" fill="currentColor"/>
                  </svg>
                </div>
                <span>Resume</span>
              </button>
            )}
            
            <button 
              className="control-button stop-button" 
              onClick={onStop}
            >
              <div className="button-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="6" y="6" width="12" height="12" fill="currentColor"/>
                </svg>
              </div>
              <span>Stop</span>
            </button>
          </>
        )}

        {/* Clear Button - Only show when there's transcript */}
        {hasTranscript && !isRecording && (
          <button 
            className="control-button clear-button" 
            onClick={onClear}
          >
            <div className="button-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
              </svg>
            </div>
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Recording Indicator */}
      {isRecording && !isPaused && (
        <div className="recording-indicator">
          <div className="pulse-dot"></div>
          <span>Recording...</span>
        </div>
      )}

      {/* Paused Indicator */}
      {isRecording && isPaused && (
        <div className="paused-indicator">
          <div className="pause-icon">⏸</div>
          <span>Paused</span>
        </div>
      )}

      {/* Connection Status */}
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        <div className="status-dot"></div>
        <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
        </div>
      )}
    </div>
  );
};

export default Controls;