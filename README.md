# EventSphere Frontend

Cloud-native event booking platform frontend - deployed on Google Cloud Run.

## Project Info

- **Student Name:** [Dinidu Sachintha]
- **Batch:** [Batch 71]


## Technology Stack

- **Frontend Framework:** React 18.2
- **HTTP Client:** Axios
- **Styling:** CSS3 (no framework, vanilla CSS)
- **Runtime:** Node.js 20 on Alpine Linux
- **Deployment:** Google Cloud Run (serverless)
- **Container:** Docker

## Features

- User registration and authentication
- Browse events by venue
- Book tickets for events
- Submit reviews for attended events
- Real-time synchronization with backend microservices

## Setup & Local Development

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- GCP project with Cloud Run enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/[your-username]/eventsphere-frontend.git
cd eventsphere-frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# For local dev (assumes backend running on localhost:8080):
npm run dev

# For production build:
npm run build
```

## Architecture

Frontend → (HTTPS) → External Load Balancer → API Gateway (Spring Cloud Gateway) → Microservices → Databases

## API Integration

The frontend uses `src/services/api.js` to call the backend:

```javascript
// Example: Register a user
import { registerUser } from "./services/api";

const user = await registerUser({
  name: "John Doe",
  email: "john@example.com",
  phone: "555-1234",
});
```

### Browser Testing

1. Open `https://eventsphere-frontend-149096254626.asia-south1.run.app`
2. Register a user
3. Browse available events
4. Book tickets
5. Submit a review
