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
const API_ENDPOINT = 'http://38.242.218.46/iToken/api/digipass/getCrontoCode';
const VALIDATE_ENDPOINT = 'http://38.242.218.46/iToken/api/digipass/signatureValidator';

const AUTH_PAYLOAD = {
  secret_key: "2222222222222222",
  password: "password1"
};

const transactionStore = new Map();

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
   
    const { user_id, auth_code } = req.body;
    const token = await getAuthToken();

    
    const payload = {
      user_id: user_id,
      auth_code: auth_code, 
      cronto_type: "Activation"
    };

    // ==========================================
    // 🛑 DEBUG LOG: EXACT OUTGOING PAYLOAD
    // ==========================================
    console.log("\n================================================");
    console.log("📲 EXACT ACTIVATION PAYLOAD LEAVING NODE.JS:");
    console.log("================================================");
    console.log(JSON.stringify(payload, null, 2));
    console.log("================================================\n");
    
    const response = await axios.post(API_ENDPOINT, payload, {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });

    console.log("> Success! Activation Code received.");
    res.json(response.data);

  } catch (error) {
    handleError(res, error);
  }
});

// --- ROUTE B: TRANSACTION SIGNING (GENERATION) ---


app.post('/api/sign', async (req, res) => {
  try {
    const { user_id, origin, beneficiary, name, amount } = req.body;
    const token = await getAuthToken();

    if (!user_id || !origin || !beneficiary || !name || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const dataArray = [
      String(beneficiary),
      String(origin),
      String(name),
      String(amount)
    ];

    
    transactionStore.set(user_id, dataArray);

    const transactionPayload = {
      user_id,
      datafields: dataArray,   
      cronto_type: "Transaction",
      fingerprint: "test111111111111"
    };

    console.log("\n================================================");
    console.log("🚀 TRANSACTION PAYLOAD:");
    console.log(JSON.stringify(transactionPayload, null, 2));
    console.log("================================================\n");

    const response = await axios.post(API_ENDPOINT, transactionPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({
      ...response.data,
      datafield: dataArray 
    });

  } catch (error) {
    handleError(res, error);
  }
});


// --- ROUTE C: SIGNATURE VALIDATION ---
app.post('/api/validate-signature', async (req, res) => {
  try {
    const { user_id, signature } = req.body;
    const token = await getAuthToken();

    const storedDatafield = transactionStore.get(user_id);

    if (!storedDatafield) {
      return res.status(400).json({
        error: "No transaction data found. Sign first."
      });
    }

    const validationPayload = {
      user_id,
      signature,
      datafield: storedDatafield  
    };

    console.log("\n================================================");
    console.log("🛡️ VALIDATION PAYLOAD:");
    console.log(JSON.stringify(validationPayload, null, 2));
    console.log("================================================\n");

    const response = await axios.post(VALIDATE_ENDPOINT, validationPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log("Validation API Response:", response.data);

    // optional cleanup
    transactionStore.delete(user_id);

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