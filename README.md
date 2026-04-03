# 💪 Cloud-Based Smart Workout Tracker

![Deploy](https://github.com/finily1203/workout-tracker/actions/workflows/deploy.yml/badge.svg)

A fully serverless, cloud-native web application built on **Amazon Web Services (AWS)** that enables users to log workout sessions, track fitness progress, and receive AI-powered training recommendations through an intelligent fitness chatbot.

> Developed as part of CSC3156 — Mobile and Cloud Computing at Singapore Institute of Technology (SIT)

---

## 🌐 Live Demo

**CloudFront URL (HTTPS):**
https://d3r1z6dwo5m47x.cloudfront.net

---

## ✨ Features

- 🔐 **User Authentication** — Secure registration and sign-in powered by Amazon Cognito with JWT-based session management
- 🏋️ **Workout Logging** — Record exercises, sets, repetitions, and weight in real time
- 📋 **Session History** — Review all past workout sessions with comprehensive exercise details
- 📈 **Progress Tracking** — Interactive line charts visualising strength progression over time (Recharts)
- 🤖 **AI Fitness Chatbot** — Conversational AI coach powered by Groq (LLaMA 3.3), accessible on every page *(response time may take up to 30 seconds due to AI processing)*
- 📝 **Workout Templates** — Pre-configured 3-day Push/Pull/Legs split templates for quick session setup
- ☁️ **Fully Serverless** — Zero server management with automatic scaling based on demand
- 🏗️ **Infrastructure as Code** — Complete AWS infrastructure provisioned and managed via Terraform
- 🐳 **Containerised** — Docker and Nginx for consistent, reproducible builds
- 🚀 **CI/CD Pipeline** — Automated build and deployment via GitHub Actions on every push to `main`

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
│   │   └── HistoryPage.jsx      # Session history + progress charts
│   ├── aws-config.js            # AWS Cognito + API configuration
│   └── main.jsx                 # Application entry point
├── lambda/
│   ├── createSession/           # POST /sessions
│   ├── getSessions/             # GET /sessions
│   ├── getSession/              # GET /sessions/{sessionId}
│   ├── updateSession/           # PUT /sessions/{sessionId}
│   ├── deleteSession/           # DELETE /sessions/{sessionId}
│   └── getRecommendation/       # POST /recommend (Groq AI chatbot)
├── terraform/
│   ├── main.tf                  # Provider configuration
│   ├── variables.tf             # Input variables
│   ├── dynamodb.tf              # DynamoDB tables
│   ├── lambda.tf                # Lambda functions + IAM roles
│   ├── api_gateway.tf           # API Gateway + route definitions
│   ├── cognito.tf               # Cognito User Pool
│   ├── s3.tf                    # S3 bucket + static hosting
│   ├── cloudfront.tf            # CloudFront distribution
│   └── outputs.tf               # Output values
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions CI/CD pipeline
├── Dockerfile                   # Multi-stage Docker build
├── nginx.conf                   # Nginx web server configuration
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
- Groq API key (available free at https://console.groq.com)

### Local Development

```bash
# Clone the repository
git clone https://github.com/finily1203/workout-tracker.git
cd workout-tracker

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Run with Docker

```bash
# Build the Docker image
docker build -t workout-tracker .

# Run the container
docker run -p 3000:80 workout-tracker

# Access the application at http://localhost:3000
```

---

## ☁️ Deploy with Terraform

All AWS resources can be provisioned with a single command.

### Step 1 — Configure AWS CLI

```bash
aws configure
# Enter your Access Key, Secret Key, region (ap-southeast-1), and output format (json)
```

### Step 2 — Deploy Infrastructure

```bash
cd terraform
terraform init
terraform apply
# Provide your Groq API key when prompted
```

Terraform will provision the following resources:

- ✅ DynamoDB tables
- ✅ Lambda functions
- ✅ API Gateway with route definitions
- ✅ Cognito User Pool
- ✅ S3 bucket
- ✅ CloudFront distribution

### Step 3 — Update Frontend Configuration

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

Add the following secrets to your GitHub repository under **Settings → Secrets and variables → Actions**:

| Secret | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `S3_BUCKET` | S3 bucket name |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID |

Once configured, every push to `main` will automatically trigger a build and deployment.

### Tear Down Infrastructure

To avoid ongoing AWS costs, destroy all provisioned resources:

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
| `date` | String | ISO 8601 date string |
| `muscleGroups` | List | e.g. `["Chest", "Triceps"]` |
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

- **Encryption in transit** — CloudFront enforces HTTPS via the `redirect-to-https` viewer protocol policy (`terraform/cloudfront.tf`)
- **Encryption at rest** — DynamoDB uses AWS-managed encryption by default
- **Secrets management** — Groq API key is injected as a Lambda environment variable via Terraform's `sensitive` variable, ensuring it is never hardcoded or committed to source control (`terraform/variables.tf`, `terraform/lambda.tf`)
- **CI/CD credentials** — GitHub Actions secrets are used for all deployment credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, etc.)
- **Password policy** — Cognito enforces a minimum of 8 characters with mixed case, numbers, and email verification (`terraform/cognito.tf`)


---

## Future Enhancements

We built this application with scalability in mind. Our roadmap for future iterations includes:
- **Strict API Authorization:** Implementing Amazon API Gateway JWT authorisers linked to Cognito to ensure all routes are fully protected.
- **Least-Privilege IAM Policies:** Refactoring the current Lambda execution roles from managed policies (`AmazonDynamoDBFullAccess`) to strict, inline policies scoped exclusively to our specific DynamoDB table ARNs.
- **Social Features:** Allowing users to share their workout milestones or AI-generated routines with friends.
- **Extended AI Capabilities:** Fine-tuning the Groq prompts to generate meal plans and recovery recommendations based on the user's workout intensity.


---

## API Reference

The backend exposes a RESTful interface via Amazon API Gateway to manage workout sessions and interact with the AI chatbot.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/sessions` | Creates a new workout session |
| `GET` | `/sessions` | Retrieves a list of all workout sessions for the user |
| `GET` | `/sessions/{sessionId}` | Retrieves detailed data for a specific workout session |
| `PUT` | `/sessions/{sessionId}` | Updates an existing workout session |
| `DELETE` | `/sessions/{sessionId}` | Deletes a workout session from history |
| `POST` | `/recommend` | Sends user data/queries to the Groq API for AI fitness | 

## 📸 Screenshots

### Login Page
> Secure authentication interface powered by AWS Amplify and Cognito

### Dashboard
> Central home screen with quick-action navigation and AI coach access

### Workout Templates
> Pre-configured Push / Pull / Legs 3-day split templates

### Workout Logging
> Record exercises with sets, repetitions, weight, and session notes

### Progress Charts
> Visualise strength progression over time for each exercise

### AI Fitness Chatbot
> Floating side-panel chatbot accessible from any page within the application

---

## 👥 Team

| Name | Student ID | Role |
|---|---|---|
| Liu YaoTing | 2301427 | Frontend, Backend, Database, AI Chatbot, Terraform, Docker, CI/CD |
| Yang YuJie | 2301383 | Authentication |
| Ian Loi | 2301393 | AI Recommendations & API Layer |

---

## 📚 Course

**CSC3156 — Mobile and Cloud Computing**
Singapore Institute of Technology (SIT)
DigiPen Institute of Technology Singapore
AY2025/2026

---

## 📝 License

This project was developed for academic purposes as part of CSC3156 coursework.




























































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































