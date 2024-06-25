require('dotenv').config();
const express = require('express');
const axios = require('axios');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const { getAuthUrl, getTokenByCode } = require('./auth');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

app.use(express.json());

let accessToken = '';

// API to authenticate with Azure portal
app.get('/auth/signin', async (req, res) => {
  try {
    const authUrl = await getAuthUrl();
    console.log('Redirecting to auth URL:', authUrl);
    res.redirect(authUrl);
  } catch (error) {
    console.error('Error getting auth URL:', error);
    res.status(500).send('Error getting auth URL');
  }
});

app.get('/auth/callback', async (req, res) => {
  const authCode = req.query.code;
  console.log('Authorization code received:', authCode);

  try {
    accessToken = await getTokenByCode(authCode);
    console.log('Access token acquired:', accessToken);
    res.redirect('/files');
  } catch (error) {
    console.error('Error acquiring token by code:', error);
    res.status(500).send('Error acquiring token by code');
  }
});

function ensureAuthenticated(req, res, next) {
  if (!accessToken) {
    return res.status(401).send('User is not authenticated');
  }
  next();
}

// API to list files in onedrive
app.get('/files', ensureAuthenticated, async (req, res) => {
  try {
    const response = await axios.get('https://graph.microsoft.com/v1.0/me/drive/root/children', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error listing files:', error.response ? error.response.data : error.message);
    res.status(500).send(error.response ? error.response.data : error.message);
  }
});

// API to download the file
app.get('/files/:id/download', ensureAuthenticated, async (req, res) => {
  try {
    const fileId = req.params.id;
    const response = await axios.get(`https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/content`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      responseType: 'stream'
    });
    response.data.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error.response ? error.response.data : error.message);
    res.status(500).send(error.response ? error.response.data : error.message);
  }
});

// API to list permission for a file in onedrive
app.get('/files/:id/permissions', ensureAuthenticated, async (req, res) => {
  try {
    const fileId = req.params.id;
    const response = await axios.get(`https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/permissions`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error listing file permissions:', error.response ? error.response.data : error.message);
    res.status(500).send(error.response ? error.response.data : error.message);
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
