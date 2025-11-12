

import { useState, useRef, useCallback } from 'react';

export const useAudioStream = (onAudioData) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);
  const audioChunkCountRef = useRef(0);
  const onAudioDataRef = useRef(onAudioData);
  const isPausedRef = useRef(false);

  onAudioDataRef.current = onAudioData;

  const startRecording = useCallback(async () => {
    try {
      console.log('Requesting microphone access');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });

      console.log('Microphone access granted');
      mediaStreamRef.current = stream;

      const audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000,
      });
      audioContextRef.current = audioContext;

      console.log('AudioContext created with sample rate:', audioContext.sampleRate);

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        // Don't send audio if paused
        if (isPausedRef.current) {
          return;
        }

        const inputData = e.inputBuffer.getChannelData(0);
        
        let hasAudio = false;
        for (let i = 0; i < inputData.length; i++) {
          if (Math.abs(inputData[i]) > 0.01) {
            hasAudio = true;
            break;
          }
        }

        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        audioChunkCountRef.current++;
        if (audioChunkCountRef.current % 50 === 0) {
          console.log('Audio chunks sent:', audioChunkCountRef.current, 'Has audio:', hasAudio);
        }

        if (onAudioDataRef.current) {
          onAudioDataRef.current(pcmData.buffer);
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      setIsRecording(true);
      setError(null);
      audioChunkCountRef.current = 0;
      isPausedRef.current = false;
      
      console.log('Audio recording started');
    } catch (err) {
      console.error('Error starting audio recording:', err);
      setError('Failed to access microphone: ' + err.message);
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    console.log('Stopping audio recording');
    
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null;
      processorRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    setIsRecording(false);
    isPausedRef.current = false;
    console.log('Audio recording stopped. Total chunks sent:', audioChunkCountRef.current);
  }, []);

  const pauseRecording = useCallback(() => {
    isPausedRef.current = true;
    console.log('Audio recording paused');
  }, []);

  const resumeRecording = useCallback(() => {
    isPausedRef.current = false;
    console.log('Audio recording resumed');
  }, []);

  return {
    isRecording,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  };
};

export default useAudioStream;