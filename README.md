# EventSphere Frontend

Cloud-native event booking platform frontend deployed on **Google Cloud Run (Serverless)**.

## Student Information

- **Student Name:** Dinidu Sachintha
- **Student Number:** 241711028
- **Slack Handle:** [U0BF767MA4S](https://ijse-eca-hdse-71-72.slack.com/team/U0BF767MA4S)
- **GCP Project ID:** eventsphere-504909

## Tech Stack

- **Framework:** React 18.3.1
- **Build Tool:** Create React App (react-scripts 5.0.1)
- **Styling:** Tailwind CSS 3.4 + shadcn/ui primitives
- **HTTP Client:** Axios 1.19
- **Routing:** React Router DOM 6.30
- **Icons:** Lucide React 1.33
- **Runtime:** Node.js 20 (Alpine Linux)
- **Deployment:** Google Cloud Run (fully managed, serverless)
- **Containerization:** Docker

## Features

- User registration and JWT-based authentication
- Browse events by venue with responsive UI
- Book tickets for available events
- Submit reviews and ratings for attended events
- Real-time synchronization with backend microservices
- Responsive design with Tailwind CSS and Radix UI primitives

## Local Development

### Prerequisites

- Node.js 18+ (recommended: Node.js 20 LTS)
- npm 9+
- GCP project with Cloud Run enabled (for deployment)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Production build
npm run build

# Run test suite
npm test
```

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_BASE_URL=<your-backend-api-url>
```

## Deployment

The application is containerized and deployed to **Google Cloud Run**.

- **Live URL:** https://eventsphere-frontend-149096254626.asia-south1.run.app

### Architecture

```
Frontend (Cloud Run)
    ↓ HTTPS
External Load Balancer
    ↓
API Gateway (Spring Cloud Gateway)
    ↓
Microservices → Databases
```

## Testing

1. Open the live URL: https://eventsphere-frontend-149096254626.asia-south1.run.app
2. Register a new user
3. Browse available events by venue
4. Book tickets
5. Submit reviews for attended events

## API Integration

The frontend uses a centralized API client located in `src/services/api.js`:

```javascript
import { registerUser } from "./services/api";

const user = await registerUser({
  name: "John Doe",
  email: "john@example.com",
  phone: "555-1234",
});
```
