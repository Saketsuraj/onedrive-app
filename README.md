# OneDrive App

## Versions:
Node: 18.18.0 and NPM: 9.8.1

## Overview
This app connects to OneDrive to:
- List files
- Download files
- List all users who have access to a file
- Real-time updates when users are added or removed from the file (Not implemented)

## Setup and Execution

Azure App Registration:

   ```bash
Go to the Azure portal and register a new application.
Note down the clientId (Application ID) and clientSecret (Client Secret).
Set the redirect URI to http://localhost:3000/auth/callback.
Under API permissions, add Files.Read, Files.Read.All, Files.ReadWrite, Files.ReadWrite.All, User.Read, and offline_access.
```
Create a .env file with following values


   ```bash
CLIENT_ID=CLIENT_ID
TENANT_ID=tenant-id
CLIENT_SECRET=secret-value
REDIRECT_URI=http://localhost:3000/auth/callback
AUTHORITY=https://login.microsoftonline.com/common
PORT=3000
```

Clone the repository and start the application:
   ```bash
   git clone https://github.com/Saketsuraj/onedrive-app.git
   cd onedrive-app
   npm install
   Add .env file in root directory
   npm start
   Open a browser and enter http://localhost:3000/auth/signin
