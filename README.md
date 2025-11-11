```markdown
# Sentiment Aura

Real-time sentiment analysis with voice input using AI.

## What It Does

- Captures audio from your microphone
- Converts speech to text in real-time (using Deepgram)
- Analyzes sentiment of the text (using Groq AI)
- Shows sentiment score, keywords, emotions, and confidence

## Tech Stack

**Frontend:**
- React + Vite
- Axios (API calls)
- Custom hooks for audio/transcription

**Backend:**
- FastAPI (Python)
- Groq API (sentiment analysis)
- Deepgram API (speech-to-text)

## Project Structure

```
sentiment-aura/
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuraVisualization.jsx
│   │   │   ├── TranscriptDisplay.jsx
│   │   │   ├── KeywordsDisplay.jsx
│   │   │   └── Controls.jsx
│   │   ├── hooks/
│   │   │   ├── useDeepgram.js
│   │   │   └── useAudioStream.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── .gitignore
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   └── .gitignore
├── .gitignore
└── README.md
```

## Setup

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Create virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```
GROQ_API_KEY=your_groq_api_key
BACKEND_PORT=8000
```

5. Run backend:
```bash
python main.py
```

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
VITE_BACKEND_URL=http://localhost:8000
VITE_DEEPGRAM_API_KEY=your_deepgram_api_key
```

4. Run frontend:
```bash
npm run dev
```

## How It Works

1. **Microphone → Audio Stream**: `useAudioStream` captures audio from mic
2. **Audio → Text**: `useDeepgram` sends audio to Deepgram, gets transcript
3. **Text → Backend**: `api.js` sends transcript to FastAPI
4. **Backend → AI**: FastAPI sends text to Groq for sentiment analysis
5. **Display**: Frontend shows sentiment score, keywords, emotions

## API Endpoints

**Backend (FastAPI):**
- `GET /` - Health check
- `GET /health` - Detailed health check
- `POST /process_text` - Analyze sentiment

**Input:**
```json
{
  "text": "I love this!"
}
```

**Output:**
```json
{
  "sentiment": 0.9,
  "keywords": ["love"],
  "emotion": "joy",
  "confidence": 0.95
}
```

## Environment Variables

**Backend (.env):**
- `GROQ_API_KEY` - Your Groq API key
- `BACKEND_PORT` - Port for backend (default: 8000)

**Frontend (.env):**
- `VITE_BACKEND_URL` - Backend URL (default: http://localhost:8000)
- `VITE_DEEPGRAM_API_KEY` - Your Deepgram API key

## Notes

- Sentiment score: -1.0 (negative) to 1.0 (positive)
- Audio format: PCM 16-bit, 16kHz, mono
- Deepgram model: Nova-2
- Groq model: llama-3.3-70b-versatile

## TODO

- [ ] Frontend UI components
- [ ] Real-time visualization
- [ ] Better error handling
- [ ] Deployment configuration
```