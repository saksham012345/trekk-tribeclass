# Trekk Tribe - Enhanced Adventure Travel Platform

A comprehensive travel platform that connects travelers for group trips and adventures, now with advanced notification system, enhanced trip management, and real-time updates.

## 🚀 New Enhanced Features

### Real-time Notification System
- **Socket.IO Integration**: Real-time notifications for instant updates
- **Email Notifications**: Optional email alerts using Nodemailer
- **In-app Notification Panel**: Beautiful notification center with unread badges
- **Notification Types**:
  - Trip join/leave notifications for organizers
  - Trip deletion alerts for participants
  - Trip update notifications
  - System announcements

### Advanced Trip Management
- **Trip Deletion**: Organizers can delete trips with automatic participant notifications
- **Leave Trip Functionality**: Travelers can leave joined trips
- **Smart Cleanup**: Automatic participant data cleanup
- **Enhanced Validations**: Better error handling and user feedback

### Session & Cookie Management
- **Cookie-based Sessions**: Secure session management with MongoDB store
- **Enhanced Authentication**: JWT tokens with cookie-based sessions
- **Persistent Login**: Remember user sessions across browser restarts

## Core Features

- **User Authentication**: Register as a traveler or organizer
- **Trip Creation**: Organizers can create and manage trips
- **Trip Discovery**: Browse and search for trips by category, destination, price
- **Trip Joining**: Travelers can join trips with available spots
- **User Profiles**: Manage your account and view your trips
- **Real-time Updates**: Instant notifications and status updates

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Socket.IO Client
- **Backend**: Node.js, Express, TypeScript, Socket.IO
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Cookie-based Sessions
- **Notifications**: Socket.IO, Nodemailer
- **Session Store**: connect-mongo
- **Containerization**: Docker

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local development)
- MongoDB (for local development)

### Setup Environment Variables

1. Copy environment files:
   ```bash
   cp .env.example .env
   cp web/.env.example web/.env
   cp services/api/.env.example services/api/.env
   ```

2. Update the environment variables as needed:
   - Database connection string
   - JWT secret
   - Email configuration (optional)
   - Session secret

### Running with Docker (Recommended)

1. Clone the repository
2. Set up environment variables (see above)
3. Install dependencies:
   ```bash
   npm run install:all
   ```
4. Run the application:
   ```bash
   npm run dev
   ```

5. Access the application:
   - **Web App**: http://localhost:3000
   - **API**: http://localhost:4000
   - **MongoDB**: localhost:27017

### Local Development

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Start MongoDB (via Docker):
   ```bash
   docker run -d -p 27017:27017 --name trekk-mongo mongo:6
   ```

3. Start the API:
   ```bash
   npm run dev:api
   ```

4. Start the web app (in another terminal):
   ```bash
   npm run dev:web
   ```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info

### Trips
- `GET /trips` - Get all trips (with search/filter)
- `POST /trips` - Create a new trip (organizers only)
- `GET /trips/:id` - Get trip by ID
- `PUT /trips/:id` - Update trip (organizer/admin only)
- `DELETE /trips/:id` - Delete trip (organizer/admin only)
- `POST /trips/:id/join` - Join a trip
- `DELETE /trips/:id/leave` - Leave a trip

### Notifications
- `GET /notifications` - Get user notifications (paginated)
- `GET /notifications/unread-count` - Get unread notification count
- `PUT /notifications/mark-read` - Mark specific notifications as read
- `PUT /notifications/mark-all-read` - Mark all notifications as read
- `DELETE /notifications/:id` - Delete a notification
- `POST /notifications/test` - Create test notification (dev only)

### Real-time Events (Socket.IO)
- `new_notification` - Receive new notifications in real-time
- `notification_read` - Acknowledge notification as read

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://127.0.0.1:27017/trekktribe
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
PORT=4000
```

### Frontend (web/.env)
```env
REACT_APP_API_URL=http://localhost:4000
```

## Available Scripts

- `npm run dev` - Start all services with Docker
- `npm run build` - Build all Docker images
- `npm run stop` - Stop all services
- `npm run clean` - Stop services and remove volumes
- `npm run dev:api` - Start API in development mode
- `npm run dev:web` - Start web app in development mode
- `npm run install:all` - Install all dependencies

## Project Structure

```
├── services/
│   └── api/              # Node.js API
│       ├── src/
│       │   ├── models/   # MongoDB models
│       │   ├── routes/   # API routes
│       │   ├── middleware/ # Auth middleware
│       │   └── utils/    # Utilities (notifications, etc.)
│       └── package.json
├── web/                  # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts (notifications)
│   │   ├── pages/        # Page components
│   │   └── config/       # API configuration
│   └── package.json
├── docker-compose.yml
└── package.json          # Root package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the application
5. Submit a pull request

## License

This project is licensed under the MIT License.
