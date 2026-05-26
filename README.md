# Occasio

Occasio is a full-stack web application built with a modern tech stack. It features a React-based frontend and an Express-based Node.js backend, containerized for easy deployment using Docker.

## Tech Stack

### Frontend
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **State Management:** Redux Toolkit & React Query
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS
- **Maps:** Leaflet & React Leaflet

### Backend
- **Runtime:** Node.js with TypeScript
- **Framework:** Express
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Tokens) & Passport.js (Google OAuth20)
- **Payments:** Razorpay
- **Email:** Nodemailer

## Project Structure

- `/Frontend`: Contains the Vite + React client-side application.
- `/Backend`: Contains the Node.js + Express server API.
- `docker-compose.yml`: Defines the services to run the entire stack locally.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Docker](https://www.docker.com/) & Docker Compose (optional, for containerized setup)
- [MongoDB](https://www.mongodb.com/) (if running locally without Docker)

### Environment Variables
You will need to set up environment variables for both the frontend and backend.

1. **Frontend:** Create a `.env` file in the `Frontend` directory.
2. **Backend:** Create a `.env` file in the `Backend` directory. You will need variables for MongoDB URI, JWT Secret, Razorpay keys, etc.

### Running with Docker (Recommended)

You can spin up the entire application stack using Docker Compose:

```bash
docker-compose up --build
```

- The frontend will be available at: `http://localhost:5173`
- The backend will be available at: `http://localhost:5000`

### Running Locally (Without Docker)

#### Backend Setup
```bash
cd Backend
npm install
npm run dev
```

#### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

## Available Scripts

### Frontend
- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Lints the code.
- `npm run preview`: Locally previews the production build.

### Backend
- `npm run dev`: Starts the backend server in development mode using `tsx`.
- `npm run build`: Compiles TypeScript to JavaScript.
- `npm run start`: Runs the compiled output in production.
- `npm run lint`: Lints the code.

## License
ISC
