# 🚀 Quick Start Guide

Get the BCI Research Demo running in **3 minutes**.

---

## Prerequisites

- Node.js ≥ 18.0.0 (`node --version`)
- npm ≥ 9.0.0 (`npm --version`)

---

## Step 1: Install Dependencies

```bash
cd /Users/utkarshmehta/Uk/BCI-CP
npm install
```

This installs packages for backend, frontend, and root monorepo.

**Time:** ~1-2 minutes

---

## Step 2: Create Environment File

```bash
cp .env.example .env
```

Or manually create `.env`:

```env
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
PORT=3001
```

**Time:** <1 minute

---

## Step 3: Initialize Database

```bash
npm run prisma:migrate
```

This creates `dev.db` and sets up the schema.

**Optional:** Seed with sample data

```bash
npm run prisma:seed
```

**Time:** <1 minute

---

## Step 4: Start Development Servers

```bash
npm run dev
```

This starts **both** backend and frontend in parallel:

```
✅ Backend ready:  http://localhost:3001
✅ Frontend ready: http://localhost:3000
```

**Time:** ~30 seconds

---

## Step 5: Open the App

Visit: **http://localhost:3000**

You should see:

1. **Session Init Screen** (blue/purple welcome screen)
2. Enter User ID (or keep default "child-001")
3. Click "Start Session"
4. **Game Board** appears with animals
5. Watch them flash and see predictions
6. **Dashboard** shows performance metrics

---

## 🎮 Using the Demo

### What You'll See

1. **Game Board:**
   - 3-4 animal emojis (🐱 🐶 🐻 🦁)
   - Animals flash one at a time
   - System predicts if you're paying attention

2. **Dashboard:**
   - Session accuracy %
   - Recent accuracy (last 10 trials)
   - Difficulty level (flash speed)
   - Number of objects
   - Accuracy trend chart

3. **Feedback:**
   - ✨ "Correct!" with confidence
   - "Hmm, let's try again" (neutral feedback)
   - Difficulty adjusts automatically

### How It Works

```
System Simulates: → Preprocess: → Extracts: → Classifies:
  P300 signal      Filters        Features    LDA model
  (EEG)            (BP + Notch)   (Mean,      (YES/NO)
                                  Peak,
                                  Latency)
                ↓
         Looks at last 5 predictions
         & recent accuracy
                ↓
         Adapts game difficulty
         (speed, object count)
```

---

## 🛠️ Common Commands

### Development

```bash
# Start both servers
npm run dev

# Start backend only (port 3001)
npm run backend

# Start frontend only (port 3000)
npm run frontend
```

### Database

```bash
# View/edit database visually
npm run prisma:studio
# Opens at http://localhost:5555

# Add sample data
npm run prisma:seed

# Reset database
rm dev.db && npm run prisma:migrate
```

### Building

```bash
# Build both
npm run build

# This creates:
# - backend/dist/
# - frontend/dist/
```

---

## 📝 File Structure Quick Reference

```
backend/          → Express.js + TS
  services/       → EEG, preprocessing, features, LDA, decision logic
  routes/         → API endpoints (/api/eeg, /api/sessions)
  types/          → TypeScript interfaces

frontend/         → React + TS
  components/     → Game board, dashboard, session init
  hooks/          → Custom hooks (useEEGProcessing, useSession)
  utils/          → API client

prisma/           → Database
  schema.prisma   → Data models
  seed.ts         → Sample data
```

---

## 🐛 Troubleshooting

### Issue: "Port 3001 already in use"

```bash
# Kill existing process
lsof -ti :3001 | xargs kill -9

# Start again
npm run backend
```

### Issue: "Database is locked"

```bash
# Remove and recreate
rm dev.db
npm run prisma:migrate
npm run prisma:seed
```

### Issue: "Cannot find module"

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Vite not found"

```bash
# Ensure frontend packages installed
npm install --workspace=frontend
npm run frontend
```

---

## 🔗 Important URLs

| Component | URL | Port |
|-----------|-----|------|
| **Frontend** | http://localhost:3000 | 3000 |
| **Backend API** | http://localhost:3001 | 3001 |
| **Health Check** | http://localhost:3001/health | 3001 |
| **Database Studio** | http://localhost:5555 | 5555 |

---

## 📚 Next Steps

1. **Read the code:**
   - Start with [README.md](README.md)
   - Review [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)

2. **Explore the API:**
   - `curl http://localhost:3001/health`
   - Check DevTools Network tab in browser

3. **Inspect the database:**
   - `npm run prisma:studio`
   - Browse tables visually

4. **Customize the game:**
   - Change emojis: [frontend/src/components/GameBoard.tsx](frontend/src/components/GameBoard.tsx)
   - Adjust difficulty: [backend/src/services/decisionLogicService.ts](backend/src/services/decisionLogicService.ts)

---

## 🧠 Key Concepts

### EEG Signal Simulation
- Simulates P300 evoked potential (target signal: peak at 450ms)
- Non-target = noise only
- 250 Hz sampling rate

### Preprocessing
- Bandpass filter: 0.1-30 Hz (removes DC and noise)
- Notch filter: 50 Hz (removes power line)
- DC offset removal

### Feature Extraction
- Window: 300-600 ms (P300 peak region)
- Features: mean amplitude, peak amplitude, peak latency

### Linear Discriminant Analysis (LDA)
- Separates target from non-target
- From-scratch implementation (no external ML libs)
- Confidence: sigmoid of linear discriminant

### Adaptive Difficulty
- High accuracy (>70%) → faster, more objects
- Low accuracy (<40%) → slower, fewer objects
- Prevents fatigue and maintains engagement

---

## ✅ Verification Checklist

After starting, verify:

- [ ] Backend logs show: "🧠 BCI Backend Server Running"
- [ ] Frontend loads at http://localhost:3000
- [ ] Can enter User ID and click "Start Session"
- [ ] Animals appear and start flashing
- [ ] Dashboard shows metrics
- [ ] Database Studio opens at http://localhost:5555

---

## 📞 Help & Support

### Read These First

1. [README.md](README.md) - Full documentation
2. [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) - Architecture details
3. Code comments - Heavily documented throughout

### Debugging

1. **Backend logs:** Watch terminal running `npm run backend`
2. **Frontend logs:** Open DevTools (F12) → Console tab
3. **Database:** Open Prisma Studio: `npm run prisma:studio`
4. **API calls:** DevTools → Network tab

---

## 🎯 What You're Running

This is a **full-stack research demonstration** showing:

✅ **EEG Signal Simulation** - P300-like spikes
✅ **Signal Processing** - Filters (bandpass, notch)
✅ **Feature Extraction** - Mean, peak, latency
✅ **Machine Learning** - LDA classifier from scratch
✅ **Gamified Interface** - Child-friendly game
✅ **Adaptive Learning** - Difficulty scaling
✅ **Data Persistence** - Prisma ORM + SQLite

All in **100% TypeScript** with clear architecture and extensive documentation.

---

## 🚀 Go Live Checklist

To make it production-ready:

- [ ] Change database to PostgreSQL
- [ ] Add user authentication
- [ ] Deploy backend (Heroku, Railway, etc.)
- [ ] Deploy frontend (Vercel, Netlify, etc.)
- [ ] Set up CI/CD pipeline
- [ ] Add monitoring/logging
- [ ] HTTPS certificate
- [ ] Database backups

---

**You're ready! Start with `npm run dev` and enjoy the demo! 🧠✨**
