# EventSphere Frontend

Cloud-native event booking platform frontend - deployed on Google Cloud Run.

## Project Info

- **Student Name:** [Your Name]
- **Student ID:** [Your ID]
- **GCP Project ID:** eventsphere-504909
- **Deployed URL:** https://eventsphere-frontend-XXX.a.run.app _(set after deployment)_

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

### Environment Variables

| Variable            | Description          | Example                |
| ------------------- | -------------------- | ---------------------- |
| `REACT_APP_API_URL` | Backend API endpoint | `https://34.123.45.67` |

## Deployment to Cloud Run

### Prerequisites

- `gcloud` CLI installed and authenticated
- Docker installed (for local testing)

### Deploy

```bash
# From repository root:
gcloud run deploy eventsphere-frontend \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars REACT_APP_API_URL=https://34.XXX.YYY.ZZZ

# Output will show deployed service URL
```

### Update Deployment

```bash
# After code changes, push to Cloud Run:
gcloud run deploy eventsphere-frontend \
  --source . \
  --region asia-south1 \
  --update-env-vars REACT_APP_API_URL=https://34.XXX.YYY.ZZZ
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

See `src/services/api.js` for all available endpoints.

## Testing

### Browser Testing

1. Open `https://eventsphere-frontend-XXX.a.run.app`
2. Register a user
3. Browse available events
4. Book tickets
5. Submit a review

### Network Debugging

Open browser DevTools → Network tab to inspect API calls:

- Check HTTPS is being used
- Verify `REACT_APP_API_URL` is correctly set
- Look for CORS errors (if any)

## Troubleshooting

### CORS Errors in Browser Console

**Problem:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:** Ensure API Gateway includes your frontend URL in `allowedOrigins`:

```yaml
# In config-repo application.yml:
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          "[/**]":
            allowedOrigins:
              - "https://34.XXX.YYY.ZZZ" # LB IP
              - "https://eventsphere-frontend-XXX.a.run.app" # Your frontend URL
```

Then restart API Gateway.

### API Returns 503 Service Unavailable

**Problem:** Backend is down or health checks are failing

**Solution:**

```bash
# Check backend service health
gcloud compute backend-services get-health eventsphere-backend-service --global

# Verify instances are running
gcloud compute instance-groups managed list-instances mig-api-gateway
```

### Cloud Run Deployment Fails

**Problem:** `Error building image`

**Solution:**

```bash
# Clear docker build cache and try again
gcloud run deploy eventsphere-frontend \
  --source . \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --no-cache
```

## Performance Notes

- Cloud Run instances auto-scale based on load
- First request may take 5-10 seconds (cold start)
- Subsequent requests are typically < 200ms
- Deployed URL is cached globally by Google's CDN

## Security

- HTTPS only (enforced by Cloud Run)
- Self-signed cert for testing (replace with CA cert in production)
- No API keys stored in frontend code
- Environment variables injected at deploy time

## Next Steps

1. Customize UI components in `src/components/`
2. Add more pages/routes using `react-router-dom`
3. Implement authentication/session management
4. Add image upload for reviews (GCS integration)
5. Setup monitoring and logging

## Support

For issues or questions, check:

- Backend logs: `gcloud compute ssh <instance>` → `pm2 logs`
- Frontend logs: Cloud Run console → Logs tab
- API debugging: Browser DevTools → Network tab
