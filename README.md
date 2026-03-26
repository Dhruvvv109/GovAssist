# GovAssist — Your Smart Guide to Government Schemes

> A clean, mobile-first web app helping Indian citizens discover and apply for government schemes using AI.

## Tech Stack
- **Frontend:** React (Vite) + Tailwind CSS + React Router
- **Backend:** Node.js + Express
- **AI:** OpenAI GPT-3.5 (with smart mock fallback)

---

## 🚀 Quick Start

### 1. Start the Backend

```bash
cd backend
npm install
node server.js
```
Server runs at: **http://localhost:5000**

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```
App runs at: **http://localhost:5173**

---

## 🤖 AI Setup (Optional)

To enable real AI responses, add your OpenAI API key to `backend/.env`:
```
OPENAI_API_KEY=sk-...your-key-here...
```
**Note:** Without a key, the chatbot uses smart pre-programmed mock responses that still work great for demos.

---

## 📁 Project Structure

```
govassist/
├── frontend/               # React app
│   └── src/
│       ├── components/     # Navbar, SchemeCard, Chatbot
│       ├── pages/          # Landing, Dashboard, ProfileSetup, SchemeDetails
│       └── utils/api.js    # API wrappers
└── backend/
    └── server.js           # Express API + mock data
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schemes` | Get all schemes |
| POST | `/api/checkEligibility` | Filter schemes by user profile |
| POST | `/api/ai/chatbot` | AI chatbot (OpenAI or mock) |

---

## 📱 Mobile Conversion
1. Use [Expo](https://expo.dev/) with [NativeWind](https://www.nativewind.dev/) for React Native
2. Replace `<div>` → `<View>`, `<p>` → `<Text>`, `<button>` → `<TouchableOpacity>`
3. Replace `react-router-dom` with `@react-navigation/native`

---

*Built for IDTH Project Demo.*
