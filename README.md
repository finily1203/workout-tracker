# 💪 Cloud-Based Smart Workout Tracker

![Deploy](https://github.com/finily1203/workout-tracker/actions/workflows/deploy.yml/badge.svg)

A fully serverless, cloud-native web application built on **Amazon Web Services (AWS)** that enables users to log workout sessions, track fitness progress, and receive AI-powered training recommendations via an intelligent fitness chatbot.

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
- 🤖 **AI Fitness Chatbot** — Conversational AI coach powered by Groq (LLaMA 3.3) available on every page *(AI may take up to 30 seconds to search and generate a response)*
- 📝 **Workout Templates** — Pre-built 3-day Push/Pull/Legs split templates
- ☁️ **Fully Serverless** — No servers to manage; auto-scales with demand
- 🏗️ **Infrastructure as Code** — Entire AWS infrastructure defined and deployed with Terraform
- 🐳 **Containerised** — Docker + Nginx for consistent builds
- 🚀 **CI/CD Pipeline** — Automated deployment via GitHub Actions on every push

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
│ WorkoutSessions │    │  AI Fitness Chatbot          │
│ Users           │    │  (LLaMA 3.3 70B Versatile)   │
└─────────────────┘    └─────────────────────────────┘
```

## 🚀 CI/CD Pipeline

```
git push to main
        ↓
GitHub Actions triggered
        ↓
Docker builds React app (Nginx)
        ↓
Deploy to Amazon S3
        ↓
Invalidate CloudFront cache
        ↓
Live in ~36 seconds ✅
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
| AI Chatbot | Groq API (LLaMA 3.3 70B) |
| Charts | Recharts |
| Hosting | Amazon S3 + CloudFront (HTTPS) |
| Infrastructure as Code | Terraform |
| Containerisation | Docker + Nginx |
| CI/CD | GitHub Actions |
| Region | ap-southeast-1 (Singapore) |

---

## 📁 Project Structure

```
workout-tracker/
├── src/
│   ├── api/
│   │   └── sessions.js          # API calls to Lambda functions
│   ├── components/
│   │   ├── Navbar.jsx           # Navigation bar
│   │   └── ChatBot.jsx          # AI fitness chatbot (floating panel)
│   ├── pages/
│   │   ├── LoginPage.jsx        # Cognito authentication
│   │   ├── DashboardPage.jsx    # Home dashboard
│   │   ├── NewSessionPage.jsx   # Workout logging + templates
│   │   └── HistoryPage.jsx      # History + progress charts
│   ├── aws-config.js            # AWS Cognito + API config
│   └── main.jsx                 # App entry point
├── lambda/
│   ├── createSession/           # POST /sessions
│   ├── getSessions/             # GET /sessions
│   ├── getSession/              # GET /sessions/{sessionId}
│   ├── updateSession/           # PUT /sessions/{sessionId}
│   ├── deleteSession/           # DELETE /sessions/{sessionId}
│   └── getRecommendation/       # POST /recommend (Groq AI chatbot)
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
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions CI/CD pipeline
├── Dockerfile                   # Multi-stage Docker build
├── nginx.conf                   # Nginx web server config
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
- Docker
- Groq API key (free at https://console.groq.com)

### Local Development

```bash
# Clone the repository
git clone https://github.com/finily1203/workout-tracker.git
cd workout-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

### Run with Docker

```bash
# Build Docker image
docker build -t workout-tracker .

# Run container
docker run -p 3000:80 workout-tracker

# Visit http://localhost:3000
```

---

## ☁️ Deploy with Terraform

One command creates all AWS resources automatically.

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

### Step 4 — Set Up CI/CD (GitHub Actions)

Add these secrets to your GitHub repository under Settings → Secrets:

| Secret | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `S3_BUCKET` | S3 bucket name |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID |

Every push to `main` will automatically build and deploy!

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

- All data encrypted **in transit** — CloudFront enforces HTTPS via `redirect-to-https` policy (`terraform/cloudfront.tf`)
- DynamoDB encrypted **at rest** by default (AWS-managed encryption)
- Groq API key injected as a **Lambda environment variable** via Terraform `sensitive` variable — never hardcoded or committed to source control (`terraform/variables.tf`, `terraform/lambda.tf`)
- GitHub Actions secrets used for CI/CD credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, etc.)
- Cognito enforces password policy (min 8 chars, mixed case, numbers) and email verification (`terraform/cognito.tf`)

> **Known limitations:**
> - API Gateway routes do not currently have a JWT authorizer attached — routes are reachable without a valid Cognito token
> - Lambda IAM role uses `AmazonDynamoDBFullAccess` (AWS managed policy) rather than a least-privilege inline policy scoped to specific table ARNs

---

## 📸 Screenshots

### Login Page
> Secure authentication powered by AWS Amplify + Cognito

### Dashboard
> Clean home screen with quick actions and AI coach hint

### Workout Templates
> Pre-built Push / Pull / Legs 3-day split templates

### Workout Logging
> Log exercises with sets, reps, weight and coach notes

### Progress Charts
> Track strength progression over time per exercise

### AI Fitness Chatbot
> Floating side panel chatbot available on every page

---

## 👥 Team

| Name | Student ID | Role |
|---|---|---|
| Liu YaoTing | 2301427 | Frontend, Backend, Database, AI Chatbot, Terraform, Docker, CI/CD |
| Yang YuJie | 2301383 | Authentication |
| Ian Loi | 2301393 | AI Recommendations & API Layer |

---

## 📚 Course

**CSC3156 - Mobile and Cloud Computing**
Singapore Institute of Technology (SIT)
DigiPen Institute of Technology Singapore
AY2025/2026

---

## 📝 License

This project was developed for academic purposes as part of CSC3156 coursework.
