const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ==========================================
// 1. CONFIGURATION
// ==========================================

const AUTH_URL = 'http://38.242.218.46/iToken/api/Clients/clientAuthentication'; 

const AUTH_PAYLOAD = {
  secret_key: "2222222222222222",
  password: "password1"
};

const API_ENDPOINT = 'http://38.242.218.46/iToken/api/digipass/getCrontoCode';

// ==========================================
// 2. HELPER: GET TOKEN
// ==========================================

async function getAuthToken() {
  try {
    console.log("1. Authenticating...");
    const response = await axios.post(AUTH_URL, AUTH_PAYLOAD, {
      headers: { 'Content-Type': 'application/json' }
    });

    const data = response.data;
    // Check for success code "0" and return the token from respMsg
    if (data.respCode !== "0") {
      throw new Error(`Auth failed: ${data.msgType}`);
    }
    return data.respMsg; 

  } catch (error) {
    console.error("Auth Error:", error.response ? error.response.data : error.message);
    throw new Error("Authentication failed.");
  }
}

// ==========================================
// 3. ROUTES
// ==========================================

// --- ROUTE A: ACTIVATION ---
app.post('/api/activate', async (req, res) => {
  try {
    const { user_id } = req.body;
    const token = await getAuthToken();

    const payload = {
      user_id: user_id,
      auth_code: "000000246",
      cronto_type: "Activation"
    };

    console.log(`2. Requesting Activation Code for: ${user_id}...`);
    
    const response = await axios.post(API_ENDPOINT, payload, {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });

    res.json(response.data);

  } catch (error) {
    handleError(res, error);
  }
});

// --- ROUTE B: TRANSACTION SIGNING ---
app.post('/api/sign', async (req, res) => {
  try {
    const { origin, beneficiary, name, amount } = req.body;
    const token = await getAuthToken();

   
    const dataArray = [
      String(origin),
      String(beneficiary),
      String(name),
      String(amount)
    ];

    
    const transactionPayload = {
     
      cronto_type: "Transaction",
      datafields: dataArray,      
      fingerprint: "test111111111111" 
    };

    console.log(`2. Signing Transaction with data: [${dataArray.join(', ')}]...`);
    
    const response = await axios.post(API_ENDPOINT, transactionPayload, {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });

    console.log("> Success! Transaction Signature received.");
    
    
    console.log("Response Data:", JSON.stringify(response.data, null, 2));
    
    res.json(response.data);

  } catch (error) {
    handleError(res, error);
  }
});

// ==========================================
// 4. UTILS & SERVER
// ==========================================

function handleError(res, error) {
  console.log("--- ERROR ---");
  if (error.response) {
    console.log("Status:", error.response.status);
    console.log("Data:", JSON.stringify(error.response.data, null, 2));
  } else {
    console.log("Message:", error.message);
  }
  res.status(500).json({ ret_code: -1, ret_msg: "Server connection failed" });
}

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});