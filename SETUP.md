# Cultural Quest - Setup Guide

## Backend Integration Complete! ✅

Your frontend is now fully integrated with your Express backend. Here's how to get everything running:

---

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally on port 27017)
- npm or yarn

---

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
The `.env` file has been created with:
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
COOKIE_SECRET=your-super-secret-cookie-key-change-this-in-production
```

**⚠️ IMPORTANT:** Change these secrets in production!

### 4. Start MongoDB
Make sure MongoDB is running on `mongodb://localhost:27017`

```bash
# On Windows (if installed as service)
net start MongoDB

# On Mac/Linux
mongod
```

### 5. Build and run backend
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

Backend will run on: **http://localhost:5000**

---

## Frontend Setup

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment configuration
The `.env` file has been created with:
```
VITE_API_URL=http://localhost:5000/v1
```

### 4. Run frontend
```bash
npm run dev
```

Frontend will run on: **http://localhost:8080**

---

## API Endpoints

### Authentication
- `POST /v1/user/signup` - Create new user
- `POST /v1/user/login` - Login user
- `GET /v1/user/auth-status` - Verify authentication
- `GET /v1/user/logout` - Logout user

### Profile
- `GET /v1/profile/me` - Get current user profile
- `PUT /v1/profile/me` - Update profile
- `GET /v1/profile/region/:region` - Get users by region
- `GET /v1/profile/leaderboard` - Get leaderboard

---

## What Changed?

### Backend Changes ✅
1. **Added profile fields to User model:**
   - `avatar`, `level`, `xp`, `region`, `bio`

2. **Created new profile endpoints:**
   - Get profile
   - Update profile
   - Get users by region
   - Get leaderboard

3. **Updated auth responses:**
   - Now returns full user object with profile data

### Frontend Changes ✅
1. **Removed Supabase authentication** (kept for chat features)

2. **Created API service layer:**
   - `services/api.ts` - Axios instance with credentials
   - `services/authService.ts` - Authentication API calls
   - `services/profileService.ts` - Profile API calls

3. **Updated AuthContext:**
   - Now uses backend API instead of Supabase
   - Handles JWT cookies automatically

4. **Updated useProfile hook:**
   - Fetches profile from backend
   - Updates profile via backend API

5. **Updated Scoreboard:**
   - Uses backend leaderboard endpoint

---

## Testing the Integration

### 1. Start both servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 2. Create a test account
- Go to http://localhost:8080/auth
- Click "Register" tab
- Create account with:
  - Username: `TESTUSER`
  - Password: `test123`
  - Region: `Kerala`

### 3. Verify authentication
- You should be automatically logged in
- Check browser DevTools > Application > Cookies
- You should see `auth_token` cookie

### 4. Test profile
- Go to Profile page
- Your profile should load from backend
- Try editing your profile

---

## Database Structure

### MongoDB Collection: `users`
```javascript
{
  _id: ObjectId,
  username: String (uppercase, unique),
  password: String (hashed),
  role: String (default: 'user'),
  avatar: String (auto-generated),
  level: Number (default: 1),
  xp: Number (default: 0),
  region: String (default: 'Global'),
  bio: String (default: ''),
  loginTimestamps: [Date],
  createdAt: Date,
  updatedAt: Date
}
```

---

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Check if port 5000 is available
- Verify `.env` file exists in backend folder

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check browser console for CORS errors
- Verify `.env` file exists in frontend folder

### Authentication not working
- Clear browser cookies
- Check backend logs for errors
- Verify JWT_SECRET and COOKIE_SECRET are set

### Profile not loading
- Check if user is authenticated
- Verify backend profile endpoints are working
- Check browser Network tab for API calls

---

## Next Steps

### Optional Improvements:
1. **Add password reset functionality**
2. **Implement email verification**
3. **Add profile picture upload**
4. **Create achievement system**
5. **Add XP gain mechanics**
6. **Implement friend system**

### Security Enhancements:
1. Change JWT_SECRET and COOKIE_SECRET to strong random values
2. Add rate limiting to API endpoints
3. Implement HTTPS in production
4. Add input sanitization
5. Implement CSRF protection

---

## Need Help?

If you encounter any issues:
1. Check the console logs (both frontend and backend)
2. Verify all dependencies are installed
3. Make sure MongoDB is running
4. Check that ports 5000 and 8080 are available

Happy coding! 🚀
