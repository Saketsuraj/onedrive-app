require('dotenv').config();
const msal = require('@azure/msal-node');

const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID,
    authority: process.env.AUTHORITY,
    clientSecret: process.env.CLIENT_SECRET,
  },
};

const pca = new msal.ConfidentialClientApplication(msalConfig);

const authUrlParameters = {
  scopes: ["user.read", "files.readwrite"],
  redirectUri: process.env.REDIRECT_URI,
};

async function getAuthUrl() {
  try {
    const authUrl = await pca.getAuthCodeUrl(authUrlParameters);
    return authUrl;
  } catch (error) {
    console.error('Error getting auth URL:', error);
    throw error;
  }
}

async function getTokenByCode(authCode) {
  const tokenRequest = {
    code: authCode,
    scopes: ["user.read", "files.readwrite"],
    redirectUri: process.env.REDIRECT_URI,
  };

  try {
    const tokenResponse = await pca.acquireTokenByCode(tokenRequest);
    return tokenResponse.accessToken;
  } catch (error) {
    console.error('Error acquiring token by code:', error);
    throw error;
  }
}

module.exports = {
  getAuthUrl,
  getTokenByCode,
};
