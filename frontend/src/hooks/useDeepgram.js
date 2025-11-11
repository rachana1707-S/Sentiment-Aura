// real-time speech-to-text using Deepgram (converts your voice to text as you speak)
import { useState, useRef, useCallback, useEffect } from 'react';

const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY;
const DEEPGRAM_URL = 'wss://api.deepgram.com/v1/listen';

/**
 * Custom hook for Deepgram real-time transcription
 * @param {Function} onTranscript - Callback when transcript received
 * @param {Function} onFinalTranscript - Callback when final transcript received
 */
export const useDeepgram = (onTranscript, onFinalTranscript) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState('');
  
  const socketRef = useRef(null);
  const keepAliveIntervalRef = useRef(null);

  /**
   * Opens a live connection to Deepgram
   * Creates a WebSocket (live two way connection)
   * Sends "I'm still here" messages every 5 seconds (keepalive)
   * Listens for transcribed text
   */
  const connect = useCallback(() => {
    if (!DEEPGRAM_API_KEY) {
      setError('Deepgram API key not configured');
      console.error('VITE_DEEPGRAM_API_KEY not found in environment');
      return;
    }

    try {
      // Build WebSocket URL with parameters
      const url = new URL(DEEPGRAM_URL);
      url.searchParams.append('encoding', 'linear16');
      url.searchParams.append('sample_rate', '16000');
      url.searchParams.append('channels', '1');
      url.searchParams.append('model', 'nova-2');
      url.searchParams.append('interim_results', 'true');
      url.searchParams.append('punctuate', 'true');
      url.searchParams.append('smart_format', 'true');

      // Create WebSocket connection
      const socket = new WebSocket(url.toString(), ['token', DEEPGRAM_API_KEY]);
      
      socket.onopen = () => {
        console.log('Deepgram WebSocket connected');
        setIsConnected(true);
        setError(null);
        
        // Send keepalive messages every 5 seconds
        keepAliveIntervalRef.current = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'KeepAlive' }));
          }
        }, 5000);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle transcription results
          if (data.channel && data.channel.alternatives && data.channel.alternatives.length > 0) {
            const alternative = data.channel.alternatives[0];
            const text = alternative.transcript;
            
            if (text && text.length > 0) {
              const isFinal = data.is_final;
              
              setTranscript(text);
              
              // Call callback with transcript
              if (onTranscript) {
                onTranscript(text, isFinal);
              }
              
              // Call final transcript callback
              if (isFinal && onFinalTranscript) {
                onFinalTranscript(text);
              }
            }
          }
        } catch (err) {
          console.error('Error parsing Deepgram message:', err);
        }
      };

      socket.onerror = (err) => {
        console.error('Deepgram WebSocket error:', err);
        setError('WebSocket connection error');
        setIsConnected(false);
      };

      socket.onclose = (event) => {
        console.log('Deepgram WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        
        // Clear keepalive interval
        if (keepAliveIntervalRef.current) {
          clearInterval(keepAliveIntervalRef.current);
          keepAliveIntervalRef.current = null;
        }
      };

      socketRef.current = socket;
    } catch (err) {
      console.error('Failed to connect to Deepgram:', err);
      setError('Failed to connect to Deepgram');
    }
  }, [onTranscript, onFinalTranscript]);

  /**
   * Closes the connection
   * Stops the keepalive message
   * Closes the WebSocket
   */
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      // Clear keepalive
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
        keepAliveIntervalRef.current = null;
      }
      
      // Close socket
      socketRef.current.close();
      socketRef.current = null;
      setIsConnected(false);
      setTranscript('');
    }
  }, []);

  /**
   * Send audio data to Deepgram
   * @param {ArrayBuffer|Blob} audioData - Audio data to send
   */
  const sendAudio = useCallback((audioData) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(audioData);
    }
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    sendAudio,
    isConnected,
    error,
    transcript,
  };
};

export default useDeepgram;