# TravelSphere 🌍✈️

**TravelSphere** is an AI-powered, vintage-themed smart travel management platform designed to help you plan "Around the World" expeditions. Simply enter your destination, budget, and interests, and let our proprietary telegraphic oracle curate a bespoke itinerary, estimate expenses, and provide destination recommendations.

## Features ✨

- **Expedition Planner**: AI-generated itineraries tailored to your budget and travel days.
- **Destination Oracle**: Rule-based destination recommendation system based on your budget and primary interests.
- **Travel Dashboard**: A central hub to view all your charted expeditions.
- **Budget Tracking**: Log expenses and ensure you stay within your financial bounds.
- **Dynamic Currency**: Plan and track expenses in your local currency (USD, EUR, GBP, INR, etc.).
- **Vintage Aesthetic**: Beautiful, immersive UI styled like a classic 19th-century explorer's journal.

## Tech Stack 🛠️

- **Frontend**: React + Tailwind CSS
- **Backend**: Python FastAPI
- **Database**: MongoDB
- **AI Integration**: Gemini API (via Google GenAI)

---

## Setup Instructions 🚀

This project is beginner-friendly! Follow these simple steps to get both the backend and frontend up and running.

### 1. Prerequisites
You will need the following installed on your machine:
- [Python 3.8+](https://www.python.org/downloads/)
- [Node.js (v16+)](https://nodejs.org/en/download/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (Make sure MongoDB is running on your system, usually at `mongodb://localhost:27017`)

### 2. Backend Setup (FastAPI)

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. (Optional but recommended) Create a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend` directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_genai_api_key_here
   MONGODB_URL=mongodb://localhost:27017
   ```
5. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   > The backend will now be running at `http://localhost:8000`. You can visit `http://localhost:8000/docs` to see the interactive API documentation.

### 3. Frontend Setup (React)

1. Open **a new terminal window** (keep the backend running) and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the necessary Node packages:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```
   > The frontend will usually run at `http://localhost:5173`. Open this URL in your web browser.

### 4. Embark on Your Journey! 🧭
With both servers running, open the frontend app in your browser. You can now use the Destination Oracle to find places to go, plan a new trip on the home page, and review your expeditions in the Dashboard!
