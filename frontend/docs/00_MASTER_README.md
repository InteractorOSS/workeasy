<!-- 00_MASTER_README.md -->

# Project Overview

A React + Express prototype that:

- Fetches the last 10 starred Gmail messages (from today onward) via Interactor.com  
- Displays them in a simple table UI  
- Handles authentication via an OAuth popup  

## Getting Started

1. **Clone & install**  
   ```bash
   git clone <repo-url>
   cd project
   # Backend
   cd backend && npm install
   # Frontend
   cd ../frontend && npm install

	2.	Environment Variables
	•	Backend: copy .env.example → .env and set:

INTERACTOR_ENDPOINT=https://console.interactor.com/api/v1/
INTERACTOR_API_KEY=<your-api-key>
PORT=4000


	•	Frontend: create .env.local with:

REACT_APP_API_BASE_URL=http://localhost:4000


	3.	Run

# Backend (port 4000)
cd backend && npm start
# Frontend (port 3000)
cd ../frontend && npm start


	4.	Usage
	•	On load, the app auto-fetches starred Gmail messages.
	•	If not authenticated, it shows Connect Gmail.
	•	After OAuth, it re-fetches and displays a table of Subject, From, Labels, and Snippet.