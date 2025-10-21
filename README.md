# Cultural Quest - Full Stack Application

A gamified cultural exploration platform where users can explore different cultures, collect artifacts, play mini-games, and connect with people from around the world.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB
- npm

### Setup

1. **Start MongoDB**
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   mongod
   ```

2. **Start Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Backend runs on: http://localhost:5000

3. **Start Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on: http://localhost:8080

---

## 🔑 Features

### 🌍 Interactive 3D Globe
- Realistic Earth with 10 clickable countries
- Click any country to explore its culture
- Smooth animations and hover effects

### 🎮 Kerala Cultural Games
- **Boat Race (Vallam Kali)**: Traditional snake boat racing game
- **Cuisine Quiz**: Test knowledge of Kerala's food culture
- Earn XP and level up your profile
- Learn cultural history through gameplay

### 👥 NPC Storytelling System
- 3 unique NPCs with cultural stories
- Interactive dialogues
- NPCs introduce games and traditions
- Ravi (Boatman), Lakshmi (Chef), Kumar (Merchant)

### 🗺️ Kerala Interactive Map
- Explore Kerala with character movement
- 7 landmarks to discover
- 3 mini-games integrated
- Zoom, pan, and quick travel

### 🏆 XP & Progression System
- Earn XP from games (25-100 XP per game)
- Automatic level-up (1000 XP = 1 level)
- Regional leaderboards
- Profile badges based on level

### 👫 Community Hub
- Region-filtered user lists
- Chat with local players
- Multiplayer game lobbies
- Challenge other players

### 🔐 Authentication
- User registration & login
- JWT token authentication
- Secure HTTP-only cookies
- Demo mode for testing

---

## 📡 API Endpoints

### Authentication
```
POST   /v1/user/signup        Register
POST   /v1/user/login         Login
GET    /v1/user/auth-status   Verify
GET    /v1/user/logout        Logout
```

### Profile
```
GET    /v1/profile/me              Get profile
PUT    /v1/profile/me              Update profile
GET    /v1/profile/region/:region  Get users by region
GET    /v1/profile/leaderboard     Get leaderboard
```

---

## 🏗️ Tech Stack

**Frontend:**
- React 18.3 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Axios
- Three.js (3D globe)

**Backend:**
- Express 4.21 + TypeScript
- MongoDB + Mongoose
- JWT authentication
- bcrypt

---

## 🔒 Security

- Passwords hashed with bcrypt
- JWT tokens with HTTP-only cookies
- CORS configured
- Input validation

---

## 📁 Project Structure

```
cultural-quest-exchange/
├── backend/              # Express API
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── models/       # Database schemas
│   │   ├── routes/       # API routes
│   │   └── utils/        # Utilities
│   └── .env              # Environment variables
│
└── frontend/             # React app
    ├── src/
    │   ├── services/     # API calls
    │   ├── contexts/     # State management
    │   ├── pages/        # Page components
    │   └── components/   # Reusable components
    └── .env              # Environment variables
```

---

## 🐛 Troubleshooting

**Backend won't start:**
- Check if MongoDB is running
- Verify port 5000 is available

**Frontend can't connect:**
- Verify backend is running
- Check `.env` file exists

**Authentication issues:**
- Clear browser cookies
- Check JWT_SECRET is set

---

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
JWT_SECRET=your-secret-key
COOKIE_SECRET=your-cookie-secret
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/v1
```

---

**Happy coding! 🚀**
