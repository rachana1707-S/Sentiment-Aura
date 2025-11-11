// import { useState, useRef, useCallback, useEffect } from 'react';

// const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY;
// const DEEPGRAM_URL = 'wss://api.deepgram.com/v1/listen';

// // Debug: Check if API key is loaded
// console.log('Deepgram API Key loaded:', DEEPGRAM_API_KEY ? 'Yes' : 'No');
// console.log('API Key length:', DEEPGRAM_API_KEY?.length || 0);

// export const useDeepgram = (onTranscript, onFinalTranscript) => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [error, setError] = useState(null);
//   const [transcript, setTranscript] = useState('');
  
//   const socketRef = useRef(null);
//   const keepAliveIntervalRef = useRef(null);

//   const connect = useCallback(() => {
//     if (!DEEPGRAM_API_KEY) {
//       const errorMsg = 'Deepgram API key not configured. Please add VITE_DEEPGRAM_API_KEY to your .env file';
//       setError(errorMsg);
//       console.error(errorMsg);
//       return;
//     }

//     try {
//       const url = new URL(DEEPGRAM_URL);
//       url.searchParams.append('encoding', 'linear16');
//       url.searchParams.append('sample_rate', '16000');
//       url.searchParams.append('channels', '1');
//       url.searchParams.append('model', 'nova-2');
//       url.searchParams.append('interim_results', 'true');
//       url.searchParams.append('punctuate', 'true');
//       url.searchParams.append('smart_format', 'true');

//       console.log('Connecting to Deepgram...');
//       const socket = new WebSocket(url.toString(), ['token', DEEPGRAM_API_KEY]);
      
//       socket.onopen = () => {
//         console.log('✅ Deepgram WebSocket connected');
//         setIsConnected(true);
//         setError(null);
        
//         keepAliveIntervalRef.current = setInterval(() => {
//           if (socket.readyState === WebSocket.OPEN) {
//             socket.send(JSON.stringify({ type: 'KeepAlive' }));
//           }
//         }, 5000);
//       };

//       socket.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data);
          
//           if (data.channel && data.channel.alternatives && data.channel.alternatives.length > 0) {
//             const alternative = data.channel.alternatives[0];
//             const text = alternative.transcript;
            
//             if (text && text.length > 0) {
//               const isFinal = data.is_final;
              
//               console.log('Transcript:', text, 'Final:', isFinal);
//               setTranscript(text);
              
//               if (onTranscript) {
//                 onTranscript(text, isFinal);
//               }
              
//               if (isFinal && onFinalTranscript) {
//                 onFinalTranscript(text);
//               }
//             }
//           }
//         } catch (err) {
//           console.error('Error parsing Deepgram message:', err);
//         }
//       };

//       socket.onerror = (err) => {
//         console.error('❌ Deepgram WebSocket error:', err);
//         setError('WebSocket connection error. Check your API key and internet connection.');
//         setIsConnected(false);
//       };

//       socket.onclose = (event) => {
//         console.log('Deepgram WebSocket closed. Code:', event.code, 'Reason:', event.reason);
//         setIsConnected(false);
        
//         if (keepAliveIntervalRef.current) {
//           clearInterval(keepAliveIntervalRef.current);
//           keepAliveIntervalRef.current = null;
//         }

//         // Provide helpful error messages based on close code
//         if (event.code === 1006) {
//           setError('Connection failed. Please check your Deepgram API key.');
//         } else if (event.code === 1008) {
//           setError('Invalid API key or unauthorized access.');
//         }
//       };

//       socketRef.current = socket;
//     } catch (err) {
//       console.error('Failed to connect to Deepgram:', err);
//       setError('Failed to connect to Deepgram: ' + err.message);
//     }
//   }, [onTranscript, onFinalTranscript]);

//   const disconnect = useCallback(() => {
//     if (socketRef.current) {
//       if (keepAliveIntervalRef.current) {
//         clearInterval(keepAliveIntervalRef.current);
//         keepAliveIntervalRef.current = null;
//       }
      
//       socketRef.current.close();
//       socketRef.current = null;
//       setIsConnected(false);
//       setTranscript('');
//     }
//   }, []);

//   const sendAudio = useCallback((audioData) => {
//     if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//       socketRef.current.send(audioData);
//     }
//   }, []);

//   useEffect(() => {
//     return () => {
//       disconnect();
//     };
//   }, [disconnect]);

//   return {
//     connect,
//     disconnect,
//     sendAudio,
//     isConnected,
//     error,
//     transcript,
//   };
// };

// export default useDeepgram;

import { useState, useRef, useCallback, useEffect } from 'react';

const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY;
const DEEPGRAM_URL = 'wss://api.deepgram.com/v1/listen';

console.log('🔑 Deepgram API Key loaded:', DEEPGRAM_API_KEY ? 'Yes' : 'No');
console.log('📏 API Key length:', DEEPGRAM_API_KEY?.length || 0);

export const useDeepgram = (onTranscript, onFinalTranscript) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState('');
  
  const socketRef = useRef(null);
  const keepAliveIntervalRef = useRef(null);
  const messageCountRef = useRef(0);

  const connect = useCallback(() => {
    if (!DEEPGRAM_API_KEY) {
      const errorMsg = 'Deepgram API key not configured. Please add VITE_DEEPGRAM_API_KEY to your .env file';
      setError(errorMsg);
      console.error('❌', errorMsg);
      return;
    }

    try {
      const url = new URL(DEEPGRAM_URL);
      url.searchParams.append('encoding', 'linear16');
      url.searchParams.append('sample_rate', '16000');
      url.searchParams.append('channels', '1');
      url.searchParams.append('model', 'nova-2');
      url.searchParams.append('interim_results', 'true');
      url.searchParams.append('punctuate', 'true');
      url.searchParams.append('smart_format', 'true');

      console.log('🔌 Connecting to Deepgram...');
      const socket = new WebSocket(url.toString(), ['token', DEEPGRAM_API_KEY]);
      
      socket.onopen = () => {
        console.log('✅ Deepgram WebSocket connected!');
        setIsConnected(true);
        setError(null);
        messageCountRef.current = 0;
        
        keepAliveIntervalRef.current = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'KeepAlive' }));
            console.log('💓 Keepalive sent');
          }
        }, 5000);
      };

      socket.onmessage = (event) => {
        try {
          messageCountRef.current++;
          const data = JSON.parse(event.data);
          
          console.log(`📨 Message #${messageCountRef.current} received:`, data);
          
          if (data.channel && data.channel.alternatives && data.channel.alternatives.length > 0) {
            const alternative = data.channel.alternatives[0];
            const text = alternative.transcript;
            
            if (text && text.length > 0) {
              const isFinal = data.is_final;
              
              console.log('📝 Transcript:', text, '| Final:', isFinal);
              setTranscript(text);
              
              if (onTranscript) {
                onTranscript(text, isFinal);
              }
              
              if (isFinal && onFinalTranscript) {
                console.log('✅ Final transcript:', text);
                onFinalTranscript(text);
              }
            }
          } else {
            console.log('ℹ️ Non-transcript message:', data);
          }
        } catch (err) {
          console.error('❌ Error parsing Deepgram message:', err);
        }
      };

      socket.onerror = (err) => {
        console.error('❌ Deepgram WebSocket error:', err);
        setError('WebSocket connection error. Check your API key and internet connection.');
        setIsConnected(false);
      };

      socket.onclose = (event) => {
        console.log('🔌 Deepgram WebSocket closed. Code:', event.code, 'Reason:', event.reason);
        setIsConnected(false);
        
        if (keepAliveIntervalRef.current) {
          clearInterval(keepAliveIntervalRef.current);
          keepAliveIntervalRef.current = null;
        }

        if (event.code === 1006) {
          setError('Connection failed. Please check your Deepgram API key.');
        } else if (event.code === 1008) {
          setError('Invalid API key or unauthorized access.');
        }
      };

      socketRef.current = socket;
    } catch (err) {
      console.error('❌ Failed to connect to Deepgram:', err);
      setError('Failed to connect to Deepgram: ' + err.message);
    }
  }, [onTranscript, onFinalTranscript]);

  const disconnect = useCallback(() => {
    console.log('🔌 Disconnecting from Deepgram...');
    
    if (socketRef.current) {
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
        keepAliveIntervalRef.current = null;
      }
      
      socketRef.current.close();
      socketRef.current = null;
      setIsConnected(false);
      setTranscript('');
    }
    
    console.log(`✅ Disconnected. Total messages received: ${messageCountRef.current}`);
  }, []);

  const sendAudio = useCallback((audioData) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(audioData);
    } else {
      console.warn('⚠️ Cannot send audio - WebSocket not open');
    }
  }, []);

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