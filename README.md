# 🎭 Sentiment Aura

**AI-Powered Real-Time Emotion Visualizer**

Transform your voice into a living, breathing visual masterpiece. Sentiment Aura uses cutting-edge AI to analyze your emotions in real-time and creates a stunning Perlin noise visualization that reflects your mood through dynamic colors and motion.

![Sentiment Aura Demo](https://img.shields.io/badge/Status-Live-success)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688)

---

## ✨ Features

- 🎤 **Real-Time Speech Recognition** - Powered by Deepgram's advanced transcription
- 🧠 **AI Sentiment Analysis** - Groq LLM analyzes emotions with precision
- 🎨 **Dynamic Visualization** - Mesmerizing Perlin noise responds to your mood
- 🌈 **Color-Coded Emotions** - Red (negative), Blue (neutral), Green (positive)
- 🔑 **Keyword Extraction** - Automatically identifies key topics
- ⚡ **Instant Feedback** - See your emotions visualized in milliseconds
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⏸️ **Pause & Resume** - Control recording without disconnecting
- 🌓 **Theme Switching** - Dark and light mode support
- 🗑️ **Smart Clearing** - Reset transcript without reconnecting

---

## 🎬 Demo

### How It Works

1. Click **"Start Recording"**
2. Speak naturally into your microphone
3. Watch the aura change colors based on your emotions
4. See keywords appear as you speak
5. Marvel at the real-time sentiment analysis
6. Use pause, resume, and clear controls as needed
7. Switch between dark and light themes

### Visual Guide

**Positive Sentiment** (Green) 😊
- "I'm so excited and happy about this!"

**Neutral Sentiment** (Blue) 😐
- "The weather is okay today."

**Negative Sentiment** (Red) 😞
- "This is frustrating and disappointing."

---

## 🏗️ Architecture

### Tech Stack

#### Frontend
- **React 18.2** - Component-based UI framework
- **Vite 5.0** - Lightning-fast build tool
- **p5.js (react-p5-wrapper)** - Perlin noise visualization
- **Axios** - HTTP client for API requests
- **Web Audio API** - Microphone capture and audio processing
- **WebSocket** - Real-time communication with Deepgram

#### Backend
- **FastAPI** - Modern Python web framework
- **Groq API** - Ultra-fast LLM inference
- **Pydantic** - Data validation
- **Python 3.9+** - Core language

#### External Services
- **Deepgram API** - Real-time speech-to-text transcription
- **Groq Cloud** - Sentiment analysis with Llama 3.3 70B

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.9+ ([Download](https://python.org/))
- **Deepgram API Key** ([Get Free Credits](https://console.deepgram.com/))
- **Groq API Key** ([Sign Up Free](https://console.groq.com/))

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/rachana1707-S/sentiment-aura.git
cd sentiment-aura
```

#### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
GROQ_API_KEY=your_groq_api_key_here
BACKEND_PORT=8000
FRONTEND_URL=http://localhost:5173
EOF

# Start the server
uvicorn main:app --reload --port 8000
```

#### 3️⃣ Frontend Setup

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_DEEPGRAM_API_KEY=your_deepgram_api_key_here
VITE_BACKEND_URL=http://localhost:8000
EOF

# Start development server
npm run dev
```

#### 4️⃣ Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📁 Project Structure

```
sentiment-aura/
├── backend/
│   ├── main.py                 # FastAPI server & sentiment analysis
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment variables
│   └── .gitignore
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── component_jsx/
│   │   │   │   ├── AppHeader.jsx           # Logo & instructions modal
│   │   │   │   ├── HeroSection.jsx         # Landing hero text with icon
│   │   │   │   ├── AuraVisualization.jsx   # Perlin noise canvas
│   │   │   │   ├── TranscriptDisplay.jsx   # Live transcription box
│   │   │   │   ├── KeywordsDisplay.jsx     # Keyword tags display
│   │   │   │   ├── Controls.jsx            # Recording controls
│   │   │   │   └── ThemeToggle.jsx         # Dark/Light mode toggle
│   │   │   └── component_css/
│   │   │       ├── AppHeader.css           # Header & modal styles
│   │   │       ├── HeroSection.css         # Hero section styles
│   │   │       ├── TranscriptDisplay.css   # Transcript box styles
│   │   │       ├── KeywordsDisplay.css     # Keywords box styles
│   │   │       ├── Controls.css            # Button & indicator styles
│   │   │       └── ThemeToggle.css         # Theme toggle styles
│   │   ├── hooks/
│   │   │   ├── useDeepgram.js              # WebSocket transcription
│   │   │   └── useAudioStream.js           # Microphone capture
│   │   ├── utils/
│   │   │   └── api.js                      # Backend API client
│   │   ├── App.jsx                         # Main app component
│   │   ├── App.css                         # App layout styles
│   │   ├── index.css                       # Global styles & reset
│   │   └── main.jsx                        # React entry point
│   ├── .env                    # Environment variables
│   ├── package.json            # NPM dependencies
│   ├── vite.config.js          # Vite configuration
│   └── index.html              # HTML entry point
│
├── README.md                   # Project documentation
└── .gitignore                  # Git ignore rules
```

---

## 📂 Component Organization

### JSX Components (`src/components/component_jsx/`)

| Component | Purpose |
|-----------|---------|
| `AppHeader.jsx` | Top navigation with logo, title, and help button |
| `HeroSection.jsx` | Central hero text with animated icon |
| `AuraVisualization.jsx` | p5.js Perlin noise visualization canvas |
| `TranscriptDisplay.jsx` | Real-time transcript with dynamic borders |
| `KeywordsDisplay.jsx` | Animated keyword tags |
| `Controls.jsx` | Recording controls with pause, resume, clear |
| `ThemeToggle.jsx` | Dark and light mode switcher |

### CSS Styles (`src/components/component_css/`)

| Stylesheet | Styling For |
|-----------|-------------|
| `AppHeader.css` | Header, logo, help modal, instructions |
| `HeroSection.css` | Hero title, icon animation, description |
| `TranscriptDisplay.css` | Glassmorphism box, scrollbar, animations |
| `KeywordsDisplay.css` | Keyword pills, float-in animations |
| `Controls.css` | Buttons, recording indicator, status dots, pause states |
| `ThemeToggle.css` | Theme toggle button and transitions |

### Import Pattern

Components import their corresponding CSS:

```jsx
// In component_jsx/AppHeader.jsx
import '../component_css/AppHeader.css';

// In component_jsx/TranscriptDisplay.jsx
import '../component_css/TranscriptDisplay.css';
```

---

## 🔧 Configuration

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GROQ_API_KEY` | Groq API key for sentiment analysis | `gsk_...` |
| `BACKEND_PORT` | Port for FastAPI server | `8000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_DEEPGRAM_API_KEY` | Deepgram API key for transcription | `abc123...` |
| `VITE_BACKEND_URL` | Backend API endpoint | `http://localhost:8000` |

---

## 🎯 API Endpoints

### `GET /`
Health check endpoint

**Response:**
```json
{
  "status": "online",
  "service": "Sentiment Aura API",
  "version": "1.0.0",
  "ai_provider": "groq",
  "model": "llama-3.3-70b-versatile"
}
```

### `GET /health`
Detailed health status

**Response:**
```json
{
  "status": "healthy",
  "ai_provider": "groq",
  "model": "llama-3.3-70b-versatile",
  "api_key_configured": true
}
```

### `POST /process_text`
Analyze sentiment of text

**Request:**
```json
{
  "text": "I am so happy and excited!"
}
```

**Response:**
```json
{
  "sentiment": 0.9,
  "keywords": ["happy", "excited"],
  "emotion": "joy",
  "confidence": 0.95
}
```

---

## 🎨 Visual Design

### Color Palette

- **Positive Sentiment:** `#4CAF50` (Green)
- **Neutral Sentiment:** `#2196F3` (Blue)
- **Negative Sentiment:** `#F44336` (Red)
- **Accent Gradient:** `#667eea → #764ba2` (Purple gradient)

### Design System

- **Glassmorphism** - Frosted glass effect with backdrop blur
- **Gradient Text** - Eye-catching titles with color transitions
- **Smooth Animations** - Gentle transitions and floating effects
- **Responsive Layout** - Adapts to all screen sizes
- **Real-time Border Effects** - Boxes glow based on sentiment
- **Theme Support** - Dark mode (default) and light mode with warm beige palette

---

## 🎭 Component Details

### AppHeader
- Displays branding and logo
- Help button (?) opens instructions modal
- Modal includes usage steps and color guide
- Gradient logo animation with floating effect

### HeroSection
- Animated sparkle icon
- Gradient title text
- Descriptive tagline
- Auto-hides when recording starts

### AuraVisualization
- 2000 particles flowing through Perlin noise field
- Color mapped directly to sentiment: 0° (red), 120° (green), 220° (blue)
- Speed and density respond to emotion intensity
- Smooth interpolation between states
- Reduced background fade for persistent trails
- Adapts brightness for dark and light themes

### TranscriptDisplay
- Shows live speech-to-text
- Auto-scrolling as text appears
- Border glows red, blue, or green based on sentiment
- Displays interim results while speaking
- Accumulates transcript across multiple utterances
- Clears only when Clear button clicked or new recording started

### KeywordsDisplay
- Extracts 3-7 meaningful keywords
- Staggered fade-in animations (200ms delay each)
- Pill-style tags with gradient backgrounds
- Border responds to real-time sentiment
- Hover effects with scale and glow

### Controls
- Start, Stop, Pause, Resume recording buttons with gradients
- Pulsing red dot when actively recording
- Paused indicator when recording is paused
- Clear button appears when recording is stopped and transcript exists
- Connection status indicator with colored dot
- Error banner for connection and API issues

### ThemeToggle
- Sun and moon icon toggle
- Switches between dark mode and light mode
- Smooth transitions for all UI elements
- Updates visualization particle brightness
- Positioned top-left below header

---

## 🧪 Testing

### Backend Testing

```bash
cd backend
source venv/bin/activate

# Test the API
curl -X POST "http://localhost:8000/process_text" \
  -H "Content-Type: application/json" \
  -d '{"text": "I am extremely happy!"}'
```

### Frontend Testing

1. Open browser console (F12)
2. Click "Start Recording"
3. Check for:
   - ✅ Microphone access granted
   - ✅ Deepgram WebSocket connected
   - ✅ Audio chunks being sent
   - ✅ Transcripts appearing
   - ✅ Sentiment scores updating
   - ✅ Border colors changing
   - ✅ Pause stops transcription
   - ✅ Resume continues seamlessly
   - ✅ Clear button resets everything
   - ✅ Theme toggle updates entire UI

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** `GROQ_API_KEY not found`
- **Solution:** Ensure `.env` file exists in `backend/` directory with correct API key

**Problem:** `Port 8000 already in use`
- **Solution:** Change `BACKEND_PORT` in `.env` or kill process using port 8000

### Frontend Issues

**Problem:** Deepgram connection fails
- **Solution:** Verify `VITE_DEEPGRAM_API_KEY` in `frontend/.env`
- **Solution:** Check Deepgram credits at console.deepgram.com

**Problem:** No audio chunks sent
- **Solution:** Allow microphone access in browser
- **Solution:** Check System Preferences → Sound → Input

**Problem:** React Hooks error
- **Solution:** Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
- **Solution:** Clear cache and restart dev server

**Problem:** CSS not loading
- **Solution:** Verify import paths in JSX components
- **Solution:** Check that CSS files are in `component_css/` folder

**Problem:** Pause not stopping transcription
- **Solution:** Verify isPausedRef is being checked in audio processor
- **Solution:** Check console logs for pause and resume messages

**Problem:** Particles showing yellow instead of red
- **Solution:** Verify color mapping uses direct hue values (0 for red, 120 for green, 220 for blue)
- **Solution:** Check sentiment value is negative (< -0.1) for red to appear

**Problem:** Transcript showing text twice
- **Solution:** Ensure handleFinalTranscript sets transcript instead of appending when needed
- **Solution:** Verify Deepgram is not sending duplicate final transcripts
- 
---

## 📊 Performance

- **Transcription Latency:** ~200ms
- **Sentiment Analysis:** ~300ms
- **Total Response Time:** <500ms
- **Frame Rate:** 60 FPS (Perlin noise)
- **Audio Processing:** Real-time streaming
- **Particle Count:** 2000 particles
- **Background Persistence:** Reduced fade for visible trails
---

## 🙏 Acknowledgments

- **Deepgram** - For providing excellent real-time transcription
- **Groq** - For ultra-fast LLM inference
- **p5.js** - For powerful visualization capabilities
- **FastAPI** - For the intuitive Python web framework
- **React** - For the component-based architecture

---

## 📧 Contact

**Project Maintainer:** Rachana Sudhakar

- GitHub: [@rachana1707-S](https://github.com/rachana1707-S)
- Email: rachanasudhakar17@gmail.com
- LinkedIn: [linkedin.com/in/rachanasudhakar](https://www.linkedin.com/in/rachanasudhakar)

---


<div align="center">

**Built with ❤️ using React, FastAPI, and AI**

</div>
