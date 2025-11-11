import { useState, useCallback, useEffect } from 'react';
import './App.css';
import AuraVisualization from './components/component_jsx/AuraVisualization';
import TranscriptDisplay from './components/component_jsx/TranscriptDisplay';
import KeywordsDisplay from './components/component_jsx/KeywordsDisplay';
import Controls from './components/component_jsx/Controls';
import AppHeader from './components/component_jsx/AppHeader';
import HeroSection from './components/component_jsx/HeroSection';
import ThemeToggle from './components/component_jsx/ThemeToggle';
import { useDeepgram } from './hooks/useDeepgram';
import { useAudioStream } from './hooks/useAudioStream';
import { analyzeSentiment } from './utils/api';

function App() {
  const [sentiment, setSentiment] = useState(0);
  const [keywords, setKeywords] = useState([]);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Apply theme to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  // Handle final transcript from Deepgram
  const handleFinalTranscript = useCallback(async (text) => {
    console.log('Final transcript:', text);
    
    // Append to existing transcript with a space
    setTranscript(prev => {
      if (prev.length === 0) {
        return text;
      }
      return prev + ' ' + text;
    });
    
    setInterimTranscript('');

    try {
      setIsProcessing(true);
      const result = await analyzeSentiment(text);
      
      console.log('Sentiment analysis result:', result);
      setSentiment(result.sentiment);
      setKeywords(result.keywords);
      setError(null);
    } catch (err) {
      console.error('Failed to analyze sentiment:', err);
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Handle transcript updates
  const handleTranscript = useCallback((text, isFinal) => {
    if (isFinal) {
      handleFinalTranscript(text);
    } else {
      setInterimTranscript(text);
    }
  }, [handleFinalTranscript]);

  const {
    connect: connectDeepgram,
    disconnect: disconnectDeepgram,
    sendAudio,
    isConnected: deepgramConnected,
    error: deepgramError,
  } = useDeepgram(handleTranscript, handleFinalTranscript);

  const {
    isRecording,
    error: audioError,
    startRecording,
    stopRecording,
  } = useAudioStream(sendAudio);

  const handleStart = useCallback(async () => {
    try {
      setError(null);
      setTranscript('');
      setInterimTranscript('');
      setKeywords([]);
      setSentiment(0);
      setIsPaused(false);

      connectDeepgram();
      await new Promise(resolve => setTimeout(resolve, 500));
      await startRecording();
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError('Failed to start recording: ' + err.message);
    }
  }, [connectDeepgram, startRecording]);

  const handleStop = useCallback(() => {
    stopRecording();
    disconnectDeepgram();
    setIsPaused(false);
  }, [stopRecording, disconnectDeepgram]);

  // Pause recording
  const handlePause = useCallback(() => {
    setIsPaused(true);
    // Note: We keep the connections open, just stop sending audio
    console.log('Recording paused');
  }, []);

  // Resume recording
  const handleResume = useCallback(() => {
    setIsPaused(false);
    console.log('Recording resumed');
  }, []);

  // Clear transcript without stopping recording
  const handleClear = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setKeywords([]);
    setSentiment(0);
    console.log('Transcript cleared');
  }, []);

  // Toggle theme
  const handleThemeToggle = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const displayError = error || deepgramError || audioError;

  return (
    <div className="app">
      <AppHeader />
      
      {/* Theme Toggle - Top Right */}
      <div className="theme-toggle-container">
        <ThemeToggle isDark={isDarkMode} onToggle={handleThemeToggle} />
      </div>

      <div className="visualization-container">
        <AuraVisualization sentiment={sentiment} keywords={keywords} isDarkMode={isDarkMode} />
        <HeroSection isRecording={isRecording} />
      </div>

      <div className="ui-overlay">
        <TranscriptDisplay 
          transcript={transcript} 
          interimTranscript={interimTranscript}
          sentiment={sentiment}
        />
        <KeywordsDisplay 
          keywords={keywords}
          sentiment={sentiment}
        />
        <Controls
          isRecording={isRecording}
          isPaused={isPaused}
          onStart={handleStart}
          onStop={handleStop}
          onPause={handlePause}
          onResume={handleResume}
          onClear={handleClear}
          isConnected={deepgramConnected}
          error={displayError}
          hasTranscript={transcript.length > 0}
        />
      </div>

      {isProcessing && (
        <div className="processing-indicator">
          <div className="spinner"></div>
          <span>Analyzing...</span>
        </div>
      )}
    </div>
  );
}

export default App;