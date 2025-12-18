# BCI Research Demonstration Prototype

**"Breaking Barriers: Feasibility of Affordable Brain-Computer Interfaces for Pediatric Cerebral Palsy"**

## 🧠 Overview

This is a **fully-typed, end-to-end Brain-Computer Interface (BCI) research demonstration** built in TypeScript. It faithfully implements the BCI pipeline described in the research paper while maintaining clear separation of concerns and explainable architecture.

**⚠️ Disclaimer:** This is a **research demonstration prototype**, NOT a medical device. All EEG signals are simulated for educational and research purposes only.

---

## 📋 Table of Contents

1. [Architecture](#-architecture)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Setup & Installation](#-setup--installation)
5. [Running the Application](#-running-the-application)
6. [API Documentation](#-api-documentation)
7. [Implementation Details](#-implementation-details)
8. [Paper-to-Code Mapping](#-paper-to-code-mapping)
9. [Customization](#-customization)

---

## 🏗️ Architecture

### High-Level Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                 BCI PIPELINE (Backend)                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. EEG SIMULATION                                        │
│     └─→ Generate P300-like signals (target/non-target)   │
│                                                           │
│  2. PREPROCESSING                                         │
│     └─→ Bandpass filter (0.1-30 Hz)                      │
│     └─→ Notch filter (50 Hz)                             │
│     └─→ DC offset removal                                │
│                                                           │
│  3. FEATURE EXTRACTION                                    │
│     └─→ Mean amplitude (300-600ms window)                │
│     └─→ Peak amplitude                                   │
│     └─→ Peak latency                                     │
│                                                           │
│  4. CLASSIFICATION (LDA)                                  │
│     └─→ Linear Discriminant Analysis                     │
│     └─→ Binary decision: YES / NO                        │
│                                                           │
│  5. DECISION & ADAPTATION                                │
│     └─→ Multi-trial smoothing                            │
│     └─→ Adaptive difficulty scaling                      │
│     └─→ Session state persistence (Prisma)              │
│                                                           │
└─────────────────────────────────────────────────────────┘
         │
         │ REST API (/api/eeg, /api/sessions)
         ▼
┌─────────────────────────────────────────────────────────┐
│           GAMIFIED INTERFACE (Frontend)                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  • Child-friendly animated game board                     │
│  • 3-4 animal/shape stimuli with flashing               │
│  • Real-time performance dashboard                       │
│  • Adaptive difficulty feedback                          │
│  • Session management & progress tracking                │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🧱 Tech Stack

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js (TypeScript)
- **Database:** Prisma ORM + SQLite (default) / PostgreSQL
- **Architecture:** Microservice-ready with typed services and routes

### **Frontend**
- **Library:** React 18 (TypeScript only)
- **Styling:** Tailwind CSS
- **UI Components:** Custom + Recharts (charts)
- **Build Tool:** Vite (fastest TS bundler)

### **Database**
- **ORM:** Prisma
- **Default:** SQLite (zero-config)
- **Production-Ready:** PostgreSQL compatible

---

## 📁 Project Structure

```
BCI-CP/
├── backend/                    # Express.js + TypeScript
│   ├── src/
│   │   ├── index.ts           # Server entry point
│   │   ├── services/
│   │   │   ├── eegSignalService.ts       # EEG simulation
│   │   │   ├── preprocessingService.ts   # Filtering
│   │   │   ├── featureExtractionService.ts  # Feature extraction
│   │   │   ├── ldaClassifier.ts          # LDA classification
│   │   │   └── decisionLogicService.ts   # Session & adaptation
│   │   ├── routes/
│   │   │   ├── eegRoutes.ts        # /api/eeg endpoints
│   │   │   └── sessionRoutes.ts    # /api/sessions endpoints
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript interfaces
│   │   └── utils/                  # Utilities (if needed)
│   ├── package.json
│   ├── tsconfig.json
│   └── .gitignore
│
├── frontend/                   # React + TypeScript
│   ├── src/
│   │   ├── main.tsx            # Entry point
│   │   ├── App.tsx             # Main app component
│   │   ├── App.css             # Styles
│   │   ├── index.css           # Global styles
│   │   ├── components/
│   │   │   ├── SessionInit.tsx       # Session creation
│   │   │   ├── GameBoard.tsx         # Game interface
│   │   │   ├── GameObject.tsx        # Stimulus object
│   │   │   └── CalibrationDashboard.tsx  # Metrics
│   │   ├── hooks/
│   │   │   ├── useEEGProcessing.ts  # Signal processing hook
│   │   │   └── useSession.ts        # Session management hook
│   │   ├── types/
│   │   │   └── index.ts        # TypeScript interfaces
│   │   └── utils/
│   │       └── apiClient.ts    # API client
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   ├── package.json
│   └── .gitignore
│
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Auto-generated
│
├── package.json                # Root monorepo config
└── README.md                   # This file
```

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** or **yarn**
- **SQLite** (automatic) or **PostgreSQL**

### Installation Steps

1. **Clone or navigate to the project:**

```bash
cd /Users/utkarshmehta/Uk/BCI-CP
```

2. **Install dependencies (monorepo):**

```bash
npm install
```

This installs dependencies for both `/backend` and `/frontend` workspaces.

3. **Set up environment variables:**

Create `.env` in the root directory:

```env
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
PORT=3001
```

Or for PostgreSQL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/bci_db"
NODE_ENV="development"
PORT=3001
```

4. **Initialize Prisma database:**

```bash
npm run prisma:migrate
```

This creates the SQLite database and runs migrations.

5. **(Optional) Seed database:**

```bash
npm run prisma:seed
```

---

## ▶️ Running the Application

### Development Mode (Both Backend + Frontend)

```bash
npm run dev
```

This starts:
- **Backend:** `http://localhost:3001`
- **Frontend:** `http://localhost:3000`

### Run Backend Only

```bash
npm run backend
```

Server starts on `http://localhost:3001`

### Run Frontend Only

```bash
npm run frontend
```

Frontend starts on `http://localhost:3000`

### Production Build

```bash
npm run build
```

Compiles TypeScript and bundles frontend for production.

### Database Tools

```bash
# Open Prisma Studio (visual database browser)
npm run prisma:studio
```

---

## 📡 API Documentation

### Base URL

```
http://localhost:3001/api
```

### EEG Signal Endpoints

#### **1. Simulate EEG Signal**

```http
GET /api/eeg/simulate?type=target&noiseLevel=0.5
```

**Query Parameters:**
- `type`: `'target'` | `'nontarget'` (required)
- `noiseLevel`: 0-1 (optional, default 0.5)

**Response:**

```json
{
  "timestamps": [0, 4, 8, 12, ...],
  "rawSignal": [0.3, -0.2, 0.5, ...]
}
```

---

#### **2. Preprocess Signal**

```http
POST /api/eeg/preprocess

{
  "rawSignal": [0.3, -0.2, 0.5, ...],
  "timestamps": [0, 4, 8, 12, ...]
}
```

**Response:**

```json
{
  "rawSignal": [0.3, -0.2, 0.5, ...],
  "filteredSignal": [0.25, -0.15, 0.42, ...]
}
```

---

#### **3. Extract Features**

```http
POST /api/eeg/extract-features

{
  "filteredSignal": [0.25, -0.15, 0.42, ...],
  "timestamps": [0, 4, 8, 12, ...]
}
```

**Response:**

```json
{
  "mean": 0.15,
  "peak": 2.34,
  "latency": 450.2
}
```

---

#### **4. Classify Features (LDA)**

```http
POST /api/eeg/classify

{
  "mean": 0.15,
  "peak": 2.34,
  "latency": 450.2
}
```

**Response:**

```json
{
  "prediction": "YES",
  "confidence": 0.85
}
```

---

### Session Management Endpoints

#### **5. Create Session**

```http
POST /api/sessions

{
  "userId": "child-001"
}
```

**Response:**

```json
{
  "id": "clpxxxxxxx",
  "userId": "child-001",
  "startedAt": "2024-01-18T10:00:00Z",
  "status": "active",
  "totalTrials": 0,
  "accuracy": 0,
  "calibration": {
    "flashSpeed": 1.0,
    "objectCount": 3,
    "recentAccuracy": 0.5
  }
}
```

---

#### **6. Get Session**

```http
GET /api/sessions/:sessionId
```

**Response:** Full session with all trials and calibration state

---

#### **7. Record Trial**

```http
POST /api/sessions/:sessionId/trials

{
  "trialNumber": 1,
  "targetType": "target",
  "prediction": "YES",
  "confidence": 0.85,
  "responseTime": 450
}
```

**Response:**

```json
{
  "trial": { ... },
  "calibration": {
    "flashSpeed": 1.05,
    "objectCount": 3,
    "recentAccuracy": 0.6
  },
  "feedback": {
    "notification": "Great job! You're doing well.",
    "recentAccuracy": 0.6,
    "sessionAccuracy": 0.75
  }
}
```

---

#### **8. Smooth Predictions**

```http
POST /api/sessions/:sessionId/smooth-predictions

{
  "predictions": [
    { "prediction": "YES", "confidence": 0.85 },
    { "prediction": "YES", "confidence": 0.72 },
    { "prediction": "NO", "confidence": 0.55 }
  ]
}
```

**Response:**

```json
{
  "decision": "YES",
  "confidence": 0.76
}
```

---

## 🔬 Implementation Details

### 1. **EEG Signal Simulation**

**File:** [backend/src/services/eegSignalService.ts](backend/src/services/eegSignalService.ts)

**Key Features:**
- Generates P300-like spikes (300-600 ms window)
- Gaussian noise addition (configurable)
- Sampling rate: 250 Hz (typical for portable systems)
- Box-Muller transform for Gaussian noise

**Target Signal Characteristics:**
- Peak amplitude: ~5 µV (realistic for P300)
- Gaussian envelope centered at 450 ms
- Sigma: 75 ms (width of P300)

**Non-Target Signal:**
- Pure noise baseline
- No distinctive feature

---

### 2. **Preprocessing Pipeline**

**File:** [backend/src/services/preprocessingService.ts](backend/src/services/preprocessingService.ts)

**Filters Applied:**

1. **Bandpass Filter (0.1-30 Hz)**
   - Removes DC drift
   - Removes high-frequency noise
   - Multiple-pass moving average (order 2)

2. **Notch Filter (50 Hz)**
   - Reduces power line interference
   - Attenuates periodic components at 50 Hz

3. **DC Offset Removal**
   - Centers signal to zero mean

**Design Philosophy:** Simulates real IIR/FIR filters without requiring external DSP libraries.

---

### 3. **Feature Extraction**

**File:** [backend/src/services/featureExtractionService.ts](backend/src/services/featureExtractionService.ts)

**Extraction Window:** 300-600 ms (P300 time window)

**Features:**
1. **Mean Amplitude**
   - Average voltage in P300 window
   - Discriminates target vs. non-target

2. **Peak Amplitude**
   - Maximum absolute voltage
   - Indicates signal strength

3. **Peak Latency**
   - Time of maximum amplitude
   - Temporal information

---

### 4. **Linear Discriminant Analysis (LDA)**

**File:** [backend/src/services/ldaClassifier.ts](backend/src/services/ldaClassifier.ts)

**Implementation (from scratch, no ML libraries):**

```typescript
// Decision rule:
// score = w^T * x + b
// P(YES | x) = sigmoid(score)
// Prediction = YES if P > threshold
```

**Training Algorithm:**

1. Calculate class means (μ_yes, μ_no)
2. Calculate pooled covariance matrix Σ
3. Compute weight vector: **w** = Σ⁻¹ * (μ_yes - μ_no)
4. Compute bias: **b** = -0.5 * **w**^T * (μ_yes + μ_no)

**Regularization:** Small L2 penalty on diagonal for numerical stability

**Sigmoid Confidence:** Converts linear discriminant to probability [0,1]

**Why LDA?**
- Classical method proven in BCI literature
- Interpretable decision boundary
- Fast inference
- Defensible in academic settings

---

### 5. **Decision Logic & Adaptation**

**File:** [backend/src/services/decisionLogicService.ts](backend/src/services/decisionLogicService.ts)

**Multi-Trial Smoothing:**
- Collects recent predictions
- Weighted average (recent predictions weighted higher)
- Majority voting for final decision
- Reduces noise in single-trial predictions

**Adaptive Difficulty:**

| Recent Accuracy | Action | Reason |
|---|---|---|
| > 70% | Increase difficulty | Child is engaging well |
| 40-70% | Maintain | Optimal challenge zone |
| < 40% | Decrease difficulty | Prevent frustration/fatigue |

**Difficulty Parameters:**
- **Flash Speed:** 0.6x - 1.5x (0.6 = 40% slower, 1.5 = 50% faster)
- **Object Count:** 3-4 objects
- **Trial Interval:** 2000-3000 ms (prevent fatigue)

**Design Rationale:** Paper emphasizes fatigue-aware, non-negative feedback for pediatric users.

---

## 📚 Paper-to-Code Mapping

### Research Paper Structure → Implementation

| Paper Section | Implementation | File |
|---|---|---|
| **2.1: EEG Acquisition** | Simulated P300-like signals | `eegSignalService.ts` |
| **2.2: Preprocessing** | Bandpass + Notch filters | `preprocessingService.ts` |
| **2.3: Feature Extraction** | Mean, Peak, Latency (300-600ms) | `featureExtractionService.ts` |
| **2.4: Classification** | Linear Discriminant Analysis | `ldaClassifier.ts` |
| **2.5: Decision Logic** | Multi-trial smoothing | `decisionLogicService.ts` |
| **3.1: Gamified Interface** | React-based game board | `GameBoard.tsx` |
| **3.2: Feedback Loop** | Performance dashboard | `CalibrationDashboard.tsx` |
| **3.3: Adaptation** | Difficulty scaling | `decisionLogicService.ts` |

### Key Figures from Paper

**Figure 1: P300 Waveform**
- Simulated in `eegSignalService.ts`
- 300-600 ms post-stimulus spike

**Figure 2: BCI Pipeline**
- Complete backend implementation
- Signal → Preprocessing → Features → Classification

**Table 1: Stimulus Parameters**
- Sampling rate: 250 Hz
- Duration: 1000 ms
- Noise level: configurable

---

## 🎮 Frontend Architecture

### Component Hierarchy

```
App (main state management)
├── SessionInit (session creation)
├── GameBoard (stimulus presentation)
│   ├── GameObject × N (individual animals)
│   └── Trial logic
├── CalibrationDashboard (metrics & feedback)
└── Session controls (pause/resume/end)
```

### State Management

**React Hooks:**
- `useState`: Session, calibration, game state
- `useCallback`: Event handlers
- `useEffect`: Auto-trial loop, session fetching

**Custom Hooks:**
- `useEEGProcessing()`: Signal pipeline execution
- `useSession()`: Session CRUD operations

### Responsive Design

- **Mobile-first:** Tailwind CSS
- **Grid layout:** Auto-responsive
- **Touch-friendly:** Large buttons (48px+)
- **Accessible:** ARIA labels, semantic HTML

---

## 🛠️ Customization

### Change Number of Objects

Edit [frontend/src/components/GameBoard.tsx](frontend/src/components/GameBoard.tsx):

```typescript
const EMOJIS = ['🐱', '🐶', '🐻', '🦁', '🐰']; // Add more
```

Edit [prisma/schema.prisma](prisma/schema.prisma):

```prisma
objectCount     Int      @default(5)    // New default
```

---

### Change Stimulus Emojis

Edit [frontend/src/components/GameBoard.tsx](frontend/src/components/GameBoard.tsx):

```typescript
const EMOJIS = ['🍎', '🎈', '⭐', '🎨'];
```

---

### Adjust Difficulty Scaling

Edit [backend/src/services/decisionLogicService.ts](backend/src/services/decisionLogicService.ts):

```typescript
if (recentAccuracy > 0.75) {  // Change threshold
  newFlashSpeed = Math.min(2.0, currentFlashSpeed * 1.2);  // Adjust multiplier
}
```

---

### Add Authentication

1. Install `@prisma/client` and JWT library
2. Add `User` model to Prisma schema
3. Add middleware to Express routes
4. Add login/signup to frontend

---

### Deploy to Production

**Backend (Heroku/Railway):**

```bash
npm run build
npm start  # Uses compiled dist/
```

**Frontend (Vercel/Netlify):**

```bash
npm run build
# Deploy dist/ folder
```

**Database (PostgreSQL on Heroku):**

```bash
heroku addons:create heroku-postgresql:hobby-dev
npm run prisma:migrate
```

---

## 📖 Code Examples

### Example 1: Process a Single Trial Programmatically

```typescript
import { apiClient } from './utils/apiClient';

async function processTrial(type: 'target' | 'nontarget') {
  // Simulate EEG
  const signal = await apiClient.simulateEEG(type, 0.5);
  
  // Preprocess
  const preprocessed = await apiClient.preprocessSignal(
    signal.rawSignal,
    signal.timestamps
  );
  
  // Extract features
  const features = await apiClient.extractFeatures(
    preprocessed.filteredSignal,
    signal.timestamps
  );
  
  // Classify
  const result = await apiClient.classify(features);
  
  console.log(`Prediction: ${result.prediction}, Confidence: ${result.confidence}`);
  return result;
}
```

---

### Example 2: Create and Run a Session

```typescript
async function runSession(userId: string) {
  // Create session
  const session = await apiClient.createSession(userId);
  console.log(`Session created: ${session.id}`);
  
  // Run 10 trials
  for (let i = 1; i <= 10; i++) {
    const result = await processTrial('target');
    
    const response = await apiClient.recordTrial(
      session.id,
      i,
      'target',
      result.prediction,
      result.confidence,
      1000
    );
    
    console.log(`Trial ${i}: ${response.feedback.notification}`);
  }
}
```

---

## 🔍 Debugging

### Backend Logs

```bash
npm run backend
# Logs print to console
```

Look for:
- `LDA trained successfully`
- EEG signal timestamps
- Classification results

### Frontend Logs

Open browser DevTools (F12):
- Check Console tab for errors
- Use React Developer Tools extension
- Inspect Network tab for API calls

### Database Inspection

```bash
npm run prisma:studio
# Opens visual database browser at http://localhost:5555
```

---

## 📝 License

This is research demonstration code. Use freely for educational and research purposes.

---

## 🙏 Acknowledgments

- Based on: "Breaking Barriers: Feasibility of Affordable Brain-Computer Interfaces for Pediatric Cerebral Palsy"
- TypeScript for type safety and clarity
- React for reactive UI
- Prisma for database management
- Tailwind CSS for styling

---

## 📧 Support

For questions or issues:

1. Check this README
2. Review code comments (heavily documented)
3. Read the research paper for architectural context
4. Inspect backend logs and database state

---

**Happy researching! 🧠✨**
