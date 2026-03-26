# 💪 Cloud-Based Smart Workout Tracker

A fully serverless, cloud-native web application built on **Amazon Web Services (AWS)** that enables users to log workout sessions, track fitness progress, and receive AI-powered training recommendations.

> Built as part of CSC3156 - Mobile and Cloud Computing at Singapore Institute of Technology (SIT)

---

## 🌐 Live Demo

**S3 Hosted URL:**
http://workout-tracker-app-21.s3-website-us-east-1.amazonaws.com

---

## ✨ Features

- 🔐 **User Authentication** — Secure sign up / sign in via Amazon Cognito with JWT tokens
- 🏋️ **Workout Logging** — Log exercises, sets, reps, and weight in real time
- 📋 **Session History** — View all past workout sessions with full exercise details
- 📈 **Progress Charts** — Interactive line charts showing strength progression over time (Recharts)
- 🤖 **AI Recommendations** — Personalised next workout suggestions powered by Groq (LLaMA 3.3)
- ☁️ **Fully Serverless** — No servers to manage; auto-scales with demand

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Frontend                         │
│         React.js SPA hosted on Amazon S3             │
└─────────────────────┬───────────────────────────────┘
                      │ HTTPS
┌─────────────────────▼───────────────────────────────┐
│                  API Gateway                         │
│           Amazon API Gateway (HTTP API)              │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│                Backend Logic                         │
│              AWS Lambda Functions                    │
│   createSession | getSessions | getSession           │
│   updateSession | deleteSession | getRecommendation  │
└──────────┬──────────────────────┬───────────────────┘
           │                      │
┌──────────▼──────┐    ┌──────────▼──────────────────┐
│   DynamoDB      │    │       Groq API               │
│ WorkoutSessions │    │  AI Workout Recommendations  │
│ Users           │    │  (LLaMA 3.3 70B Versatile)   │
└─────────────────┘    └─────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite |
| Authentication | Amazon Cognito |
| API Layer | Amazon API Gateway (HTTP API) |
| Backend Logic | AWS Lambda (Node.js 22.x) |
| Database | Amazon DynamoDB |
| AI Recommendations | Groq API (LLaMA 3.3 70B) |
| Charts | Recharts |
| Hosting | Amazon S3 (Static Website) |

---

## 📁 Project Structure

```
workout-tracker/
├── src/
│   ├── api/
│   │   └── sessions.js          # API calls to Lambda functions
│   ├── components/
│   │   └── Navbar.jsx           # Navigation bar
│   ├── pages/
│   │   ├── LoginPage.jsx        # Cognito authentication
│   │   ├── DashboardPage.jsx    # Home + AI recommendations
│   │   ├── NewSessionPage.jsx   # Workout logging
│   │   └── HistoryPage.jsx      # History + progress charts
│   ├── aws-config.js            # AWS Cognito + API config
│   └── main.jsx                 # App entry point
├── public/
├── index.html
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- AWS Account (or Learner Lab)
- Groq API key (free at https://console.groq.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/finily1203/workout-tracker.git
cd workout-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

### Configuration

Update `src/aws-config.js` with your own AWS credentials:

```javascript
export const awsConfig = {
    Auth: {
        Cognito: {
            userPoolId: "YOUR_USER_POOL_ID",
            userPoolClientId: "YOUR_CLIENT_ID",
            region: "us-east-1"
        }
    }
};

export const API_URL = "YOUR_API_GATEWAY_URL";
```

### AWS Setup Required
1. **DynamoDB** — Create `WorkoutSessions` and `Users` tables
2. **Lambda** — Deploy all 6 functions from `/lambda` folder
3. **API Gateway** — Create HTTP API with routes pointing to Lambda
4. **Cognito** — Create User Pool with email sign-in

---

## 📊 DynamoDB Schema

### WorkoutSessions Table
| Attribute | Type | Description |
|---|---|---|
| `userId` | String (PK) | Cognito user ID |
| `sessionId` | String (SK) | UUID generated per session |
| `date` | String | ISO date string |
| `muscleGroups` | List | e.g. ["Chest", "Triceps"] |
| `exercises` | List | Array of exercise objects |
| `notes` | String | Session notes |

### Exercise Object Structure
```json
{
  "name": "Bench Press",
  "sets": [
    { "reps": 10, "weight": 60 },
    { "reps": 8, "weight": 65 }
  ]
}
```

---

## 🔒 Security

- All API routes protected via **Amazon Cognito JWT authorizer**
- IAM **least-privilege roles** applied to Lambda functions
- All data encrypted **in transit** (HTTPS) and **at rest** (DynamoDB default encryption)
- API keys stored securely — never committed to source control

---

## 📸 Screenshots

### Login Page
> Secure authentication powered by AWS Amplify + Cognito

### Dashboard with AI Recommendations
> Personalised workout suggestions based on training history

### Workout Logging
> Log exercises with sets, reps, and weight

### Progress Charts
> Track strength progression over time

---

## 👥 Team

| Name | Student ID | Role |
|---|---|---|
| Liu YaoTing | 2301427 | Frontend, Backend, Database, AI Integration, Deployment |
| Yang YuJie | 2301383 | Authentication |
| Ian Loi | 2301393 | AI Recommendations & API Layer |

---

## 📚 Course

**CSC3156 - Mobile and Cloud Computing**
Singapore Institute of Technology (SIT) × DigiPen Institute of Technology Singapore
AY2025/2026

---

## 📝 License

This project was developed for academic purposes as part of CSC3156 coursework.
