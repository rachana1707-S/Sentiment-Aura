import React from 'react';
import '../component_css/Controls.css';

const Controls = ({ isRecording, onStart, onStop, isConnected, error }) => {
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
          <button 
            className="control-button stop-button" 
            onClick={onStop}
          >
            <div className="button-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="6" width="12" height="12" fill="currentColor"/>
              </svg>
            </div>
            <span>Stop Recording</span>
          </button>
        )}
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="recording-indicator">
          <div className="pulse-dot"></div>
          <span>Recording...</span>
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