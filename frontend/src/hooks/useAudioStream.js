// import { useState, useRef, useCallback } from 'react';

// export const useAudioStream = (onAudioData) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [error, setError] = useState(null);
  
//   const mediaStreamRef = useRef(null);
//   const audioContextRef = useRef(null);
//   const processorRef = useRef(null);
//   const sourceRef = useRef(null);
//   const audioChunkCountRef = useRef(0);

//   const startRecording = useCallback(async () => {
//     try {
//       console.log('🎤 Requesting microphone access...');
      
//       // Request microphone access
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           sampleRate: 16000,
//         },
//       });

//       console.log('✅ Microphone access granted');
//       mediaStreamRef.current = stream;

//       // Create AudioContext
//       const audioContext = new (window.AudioContext || window.webkitAudioContext)({
//         sampleRate: 16000,
//       });
//       audioContextRef.current = audioContext;

//       console.log('AudioContext created with sample rate:', audioContext.sampleRate);

//       // Create MediaStreamSource
//       const source = audioContext.createMediaStreamSource(stream);
//       sourceRef.current = source;

//       // Create ScriptProcessor for audio data
//       const processor = audioContext.createScriptProcessor(4096, 1, 1);
//       processorRef.current = processor;

//       processor.onaudioprocess = (e) => {
//         if (!isRecording) return;

//         const inputData = e.inputBuffer.getChannelData(0);
        
//         // Check if audio has actual data (not silence)
//         let hasAudio = false;
//         for (let i = 0; i < inputData.length; i++) {
//           if (Math.abs(inputData[i]) > 0.01) {
//             hasAudio = true;
//             break;
//           }
//         }

//         // Convert Float32Array to Int16Array (PCM 16-bit)
//         const pcmData = new Int16Array(inputData.length);
//         for (let i = 0; i < inputData.length; i++) {
//           const s = Math.max(-1, Math.min(1, inputData[i]));
//           pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
//         }

//         // Log audio chunks periodically
//         audioChunkCountRef.current++;
//         if (audioChunkCountRef.current % 50 === 0) {
//           console.log(`📊 Audio chunks sent: ${audioChunkCountRef.current}, Has audio: ${hasAudio}`);
//         }

//         // Send audio data via callback
//         if (onAudioData) {
//           onAudioData(pcmData.buffer);
//         }
//       };

//       // Connect nodes
//       source.connect(processor);
//       processor.connect(audioContext.destination);

//       setIsRecording(true);
//       setError(null);
//       audioChunkCountRef.current = 0;
      
//       console.log('✅ Audio recording started');
//     } catch (err) {
//       console.error('❌ Error starting audio recording:', err);
//       setError('Failed to access microphone: ' + err.message);
//       setIsRecording(false);
//     }
//   }, [onAudioData, isRecording]);

//   const stopRecording = useCallback(() => {
//     console.log('🛑 Stopping audio recording...');
    
//     // Disconnect and close audio nodes
//     if (processorRef.current) {
//       processorRef.current.disconnect();
//       processorRef.current = null;
//     }

//     if (sourceRef.current) {
//       sourceRef.current.disconnect();
//       sourceRef.current = null;
//     }

//     if (audioContextRef.current) {
//       audioContextRef.current.close();
//       audioContextRef.current = null;
//     }

//     // Stop media stream tracks
//     if (mediaStreamRef.current) {
//       mediaStreamRef.current.getTracks().forEach(track => track.stop());
//       mediaStreamRef.current = null;
//     }

//     setIsRecording(false);
//     console.log(`✅ Audio recording stopped. Total chunks sent: ${audioChunkCountRef.current}`);
//   }, []);

//   return {
//     isRecording,
//     error,
//     startRecording,
//     stopRecording,
//   };
// };

// export default useAudioStream;

import { useState, useRef, useCallback } from 'react';

export const useAudioStream = (onAudioData) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);
  const audioChunkCountRef = useRef(0);
  const onAudioDataRef = useRef(onAudioData); // Store callback in ref

  // Update callback ref when it changes
  onAudioDataRef.current = onAudioData;

  const startRecording = useCallback(async () => {
    try {
      console.log('🎤 Requesting microphone access...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });

      console.log('✅ Microphone access granted');
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
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Check if audio has actual data
        let hasAudio = false;
        for (let i = 0; i < inputData.length; i++) {
          if (Math.abs(inputData[i]) > 0.01) {
            hasAudio = true;
            break;
          }
        }

        // Convert Float32Array to Int16Array (PCM 16-bit)
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        audioChunkCountRef.current++;
        if (audioChunkCountRef.current % 50 === 0) {
          console.log(`📊 Audio chunks sent: ${audioChunkCountRef.current}, Has audio: ${hasAudio}`);
        }

        // Send audio data via callback ref (always up to date)
        if (onAudioDataRef.current) {
          onAudioDataRef.current(pcmData.buffer);
        }
      };

      // Connect nodes
      source.connect(processor);
      processor.connect(audioContext.destination);

      setIsRecording(true);
      setError(null);
      audioChunkCountRef.current = 0;
      
      console.log('✅ Audio recording started');
    } catch (err) {
      console.error('❌ Error starting audio recording:', err);
      setError('Failed to access microphone: ' + err.message);
      setIsRecording(false);
    }
  }, []); // Empty dependencies

  const stopRecording = useCallback(() => {
    console.log('🛑 Stopping audio recording...');
    
    // Disconnect and close audio nodes
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null; // Clear handler
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

    // Stop media stream tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    setIsRecording(false);
    console.log(`✅ Audio recording stopped. Total chunks sent: ${audioChunkCountRef.current}`);
  }, []);

  return {
    isRecording,
    error,
    startRecording,
    stopRecording,
  };
};

export default useAudioStream;