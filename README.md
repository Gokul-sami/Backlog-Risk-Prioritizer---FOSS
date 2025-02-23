# RiskLens: Smart Backlog Prioritization

RiskLens is a web application designed to efficiently assess and prioritize backlog risks for streamlined project management. It leverages OpenAI's API to analyze and generate solutions for identified backlogs during project execution, helping teams mitigate risks and optimize workflow efficiency.

## Getting Started

### Cloning the Repository

To get a local copy of this project, run the following command:

```sh
git clone https://github.com/Gokul-sami/Backlog-Risk-Prioritizer---FOSS.git
cd Backlog-Risk-Prioritizer---FOSS
```

### Running the Project

1. Ensure you have **Python** and **Node.js** installed.
2. Navigate to the `backend` folder and set up the backend environment.
3. Navigate to the `frontend` folder and set up the frontend.
4. Run the application.

## Frontend Details
The frontend is built using **React + Vite**, providing a minimal setup with HMR and ESLint rules. It includes the following key functionalities:

- **GitHub Authentication**: Users can log in using GitHub OAuth.
- **Repository Selection**: Users can select their GitHub repositories and execute them within a containerized environment.
- **Log Viewer**: Displays real-time logs from the running containers.
- **Environment & Start Command Configuration**: Allows users to define startup commands and environment variables for their repositories.

### Setting Up the Frontend

Follow these steps to initialize and run the frontend:

1. Navigate to the `frontend` folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open your browser and go to `http://localhost:5173/` to access the application.

## Backend Details

The backend is built using **Node.js and Express** with authentication and repository management features. It includes:

- **GitHub OAuth Authentication**
- **Cloning and Running Repositories in Docker**
- **Fetching Logs and Handling Errors**

### Setting Up the Backend

1. Navigate to the `backend` folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add the following environment variables:
   ```env
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   SESSION_SECRET=your_secret_key
   FRONTEND_URL=http://localhost:5173
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Start the backend server:
   ```sh
   npm start
   ```

### API Endpoints

- **Authentication Routes:**
  - `GET /auth/github`: Redirects to GitHub OAuth login.
  - `GET /auth/github/callback`: Handles authentication callback.
  - `GET /auth/user`: Returns authenticated user data.
  - `GET /auth/logout`: Logs out the user.

- **GitHub Repository Routes:**
  - `GET /github/repos`: Fetches user repositories.
  - `POST /github/clone`: Clones a repository.
  - `GET /github/files`: Lists files in a cloned repository.

- **Docker Execution Routes:**
  - `POST /docker/run`: Clones and runs a repository inside a Docker container.

### Docker Configuration

A **Dockerfile** is included for containerization:

```Dockerfile
FROM node:18
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend .
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

This setup ensures a smooth and efficient development environment, enhancing project execution and backlog prioritization.

