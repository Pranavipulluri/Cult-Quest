# Quick Start Guide 🚀

Get your Cultural Quest app running in 5 minutes!

---

## Prerequisites

✅ Node.js (v16+)  
✅ MongoDB installed  
✅ Git (optional)

---

## Step 1: Start MongoDB

### Windows
```bash
net start MongoDB
```

### Mac/Linux
```bash
mongod
```

Or if using Homebrew:
```bash
brew services start mongodb-community
```

**Verify:** MongoDB should be running on `mongodb://localhost:27017`

---

## Step 2: Start Backend

Open a terminal:

```bash
# Navigate to backend
cd backend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
connected to db
listening on port 5000
```

✅ Backend is ready at **http://localhost:5000**

---

## Step 3: Start Frontend

Open a **new terminal**:

```bash
# Navigate to frontend
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
VITE v5.4.1  ready in XXX ms
➜  Local:   http://localhost:8080/
```

✅ Frontend is ready at **http://localhost:8080**

---

## Step 4: Test the App

1. **Open browser:** http://localhost:8080

2. **Create account:**
   - Click "Register"
   - Username: `TESTUSER`
   - Password: `test123`
   - Region: `Kerala`
   - Click "Create Account"

3. **Explore:**
   - View your profile
   - Edit your bio
   - Check the leaderboard
   - Try demo mode

---

## That's It! 🎉

Your app is now running with:
- ✅ Backend API on port 5000
- ✅ Frontend UI on port 8080
- ✅ MongoDB database
- ✅ Full authentication
- ✅ Profile management

---

## Quick Commands

### Stop Servers
Press `Ctrl+C` in each terminal

### Restart Backend
```bash
cd backend
npm run dev
```

### Restart Frontend
```bash
cd frontend
npm run dev
```

### View Database
```bash
mongosh
use AUTH
db.users.find().pretty()
```

---

## Troubleshooting

### "Port already in use"
Kill the process using the port:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### "Cannot connect to MongoDB"
Make sure MongoDB is running:
```bash
# Check if running
mongosh --eval "db.version()"
```

### "Module not found"
Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

📖 Read [SETUP.md](SETUP.md) for detailed setup  
📋 Check [INTEGRATION_CHECKLIST.md](INTEGRATION_CHECKLIST.md) for testing  
📊 Review [INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md) for architecture  

---

## Need Help?

Check the console logs:
- **Backend:** Terminal running `npm run dev` in backend folder
- **Frontend:** Terminal running `npm run dev` in frontend folder
- **Browser:** Press F12 > Console tab

Common issues are usually:
1. MongoDB not running
2. Wrong port numbers
3. Missing dependencies

---

Happy coding! 🚀
