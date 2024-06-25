# OneDrive App

## Overview
This app connects to OneDrive to:
- List files
- Download files
- List all users who have access to a file
- Real-time updates when users are added or removed from the file (Not implemented)

## Setup and Execution

Clone the repository and start the application:
   ```bash
   git clone https://github.com/Saketsuraj/onedrive-app.git
   cd onedrive-app
   npm install
   Register an App on the azure portal in the Active Directory
   Get client ID and other details from Azure and store them in a .env file
   npm start
   Open a browser and enter http://localhost:3000/auth/signin
