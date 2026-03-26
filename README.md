# 💪 Cloud-Based Smart Workout Tracker

A fully serverless, cloud-native web application built on **Amazon Web Services (AWS)** that enables users to log workout sessions, track fitness progress, and receive AI-powered training recommendations.

> Built as part of CSC3156 - Mobile and Cloud Computing at Singapore Institute of Technology (SIT)

---

## 🌐 Live Demo

**CloudFront URL (HTTPS):**
https://d3r1z6dwo5m47x.cloudfront.net

---

## ✨ Features

- 🔐 **User Authentication** — Secure sign up / sign in via Amazon Cognito with JWT tokens
- 🏋️ **Workout Logging** — Log exercises, sets, reps, and weight in real time
- 📋 **Session History** — View all past workout sessions with full exercise details
- 📈 **Progress Charts** — Interactive line charts showing strength progression over time (Recharts)
- 🤖 **AI Recommendations** — Personalised next workout suggestions powered by Groq (LLaMA 3.3)
- ☁️ **Fully Serverless** — No servers to manage; auto-scales with demand
- 🏗️ **Infrastructure as Code** — Entire AWS infrastructure defined and deployed with Terraform

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Frontend                         │
│    React.js SPA hosted on Amazon S3 + CloudFront     │
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
| Hosting | Amazon S3 + CloudFront (HTTPS) |
| Infrastructure as Code | Terraform |
| Region | ap-southeast-1 (Singapore) |

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
├── lambda/
│   ├── createSession/           # POST /sessions
│   ├── getSessions/             # GET /sessions
│   ├── getSession/              # GET /sessions/{sessionId}
│   ├── updateSession/           # PUT /sessions/{sessionId}
│   ├── deleteSession/           # DELETE /sessions/{sessionId}
│   └── getRecommendation/       # POST /recommend (Groq AI)
├── terraform/
│   ├── main.tf                  # Provider config
│   ├── variables.tf             # Input variables
│   ├── dynamodb.tf              # DynamoDB tables
│   ├── lambda.tf                # Lambda functions + IAM role
│   ├── api_gateway.tf           # API Gateway + routes
│   ├── cognito.tf               # Cognito User Pool
│   ├── s3.tf                    # S3 bucket + static hosting
│   ├── cloudfront.tf            # CloudFront distribution
│   └── outputs.tf               # Output values
├── public/
├── index.html
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- AWS Account
- Terraform v1.0+
- AWS CLI v2+
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

---

## ☁️ Deploy with Terraform

The easiest way to deploy — one command creates all AWS resources automatically.

### Step 1 — Configure AWS CLI
```bash
aws configure
# Enter your Access Key, Secret Key, region (ap-southeast-1), output (json)
```

### Step 2 — Deploy Infrastructure
```bash
cd terraform
terraform init
terraform apply
# Enter your Groq API key when prompted
```

Terraform will create:
- ✅ DynamoDB tables
- ✅ Lambda functions
- ✅ API Gateway + routes
- ✅ Cognito User Pool
- ✅ S3 bucket
- ✅ CloudFront distribution

### Step 3 — Update Frontend Config
Copy the output values from Terraform and update `src/aws-config.js`:

```javascript
export const awsConfig = {
    Auth: {
        Cognito: {
            userPoolId: "YOUR_USER_POOL_ID",
            userPoolClientId: "YOUR_CLIENT_ID",
            region: "ap-southeast-1"
        }
    }
};

export const API_URL = "YOUR_API_GATEWAY_URL";
```

### Step 4 — Build and Deploy Frontend
```bash
cd ..
npm run build
aws s3 sync dist/ s3://YOUR_S3_BUCKET_NAME --delete
```

### Tear Down (Save Costs)
```bash
cd terraform
terraform destroy
```

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
- IAM **least-privilege roles** applied to Lambda functions via Terraform
- All data encrypted **in transit** (HTTPS via CloudFront) and **at rest** (DynamoDB default encryption)
- API keys injected as **Lambda environment variables** — never hardcoded or committed to source control
- Groq API key managed securely via Terraform sensitive variables

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
| Liu YaoTing | 2301427 | Frontend, Backend, Database, AI Integration, Terraform, Deployment |
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
