const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Groq AI Configuration
const GROQ_CONFIG = {
    apiKey: process.env.GROQ_API_KEY || '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',
    model: "llama-3.3-70b-versatile",
    endpoint: "https://api.groq.com/openai/v1/chat/completions"
};

// Smart Switch App Knowledge Base
const APP_KNOWLEDGE = `
Smart Switch Data Transfer App - Complete Expert Guide:

APP FEATURES:
1. QUICK TRANSFER (Cloud-based Transfer):
   - Android to Android Transfer
   - Android to iOS Transfer
   - iOS to Android Transfer
   - Send Process: Select Data Categories (Images, Videos, Audio, Files, Contacts) → Click Done Button → Click Send Button → Generate QR Code or PIN Code → Share with Receiver
   - Receive Process: Open Receive → Scan QR Code or Enter PIN Code → Download Files within 24 hours
   - Time Limit: 24 hours automatic deletion for security

2. WIFI TRANSFER (Local Network Transfer):
   - Same WiFi Network or Hotspot Connection required
   - Direct device-to-device transfer
   - No time limits, faster transfer speed
   - Process: Automatic detection, direct file transfer

3. ANDROID TO PC TRANSFER (Computer Transfer):
   - Generate IP Address with Port Number (example: 192.168.1.5:8080)
   - Enter IP in PC web browser to download files
   - No software installation needed on PC

SUPPORTED FILE TYPES:
- Images: Photos, Screenshots
- Videos: Movies, Clips, Recordings
- Audio: Music, Recordings, Sound files
- Files: Documents, PDFs, APK files
- Contacts: Contact lists

SECURITY FEATURES:
- End-to-end encryption
- Auto-delete after 24 hours (Quick Transfer only)
- One-time use QR/PIN codes
- Secure cloud storage during transfer

IMPORTANT NOTES:
- Quick Transfer: 24-hour download window
- WiFi Transfer: No time limits, requires same network
- Android to PC: Active session only, no cloud storage
`;

// Groq AI Function with Enhanced Error Handling
async function callGroqAI(userQuery) {
    try {
        console.log('🤖 Calling Groq AI with Llama 3.3...');
        
        const requestData = {
            model: GROQ_CONFIG.model,
            messages: [
                {
                    role: "system",
                    content: `You are an expert support assistant for "Smart Switch Data Transfer" mobile app. 

IMPORTANT INSTRUCTIONS:
- Provide CLEAR, STEP-BY-STEP instructions with exact button names
- Use SIMPLE English with helpful emojis for better readability
- Focus on PRACTICAL, ACTIONABLE steps user can follow immediately
- Always mention time limits (24 hours for Quick Transfer)
- Be specific about device types: Android, iPhone, PC
- Use exact button names: "Done", "Send", "Receive", "Scan QR", "Enter PIN"

APP KNOWLEDGE:
${APP_KNOWLEDGE}

Respond in a helpful, friendly, and extremely detailed manner.`
                },
                {
                    role: "user",
                    content: userQuery
                }
            ],
            temperature: 0.7,
            max_tokens: 1200,
            stream: false
        };

        const response = await axios.post(
            GROQ_CONFIG.endpoint,
            requestData,
            {
                headers: {
                    'Authorization': `Bearer ${GROQ_CONFIG.apiKey}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'Smart-Switch-Webhook/1.0'
                },
                timeout: 30000
            }
        );

        if (response.data.choices && response.data.choices[0].message) {
            console.log('✅ Groq AI Response Received Successfully');
            return response.data.choices[0].message.content;
        } else {
            throw new Error('Invalid response format from Groq API');
        }

    } catch (error) {
        console.error('❌ Groq AI Error Details:');
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Message:', error.message);
        
        if (error.response?.status === 401) {
            throw new Error('GROQ_API_KEY_INVALID: Please check your API key');
        } else if (error.response?.status === 429) {
            throw new Error('GROQ_RATE_LIMIT: Too many requests');
        } else if (error.code === 'ECONNABORTED') {
            throw new Error('GROQ_TIMEOUT: Request timed out');
        } else {
            throw new Error(`GROQ_ERROR: ${error.message}`);
        }
    }
}

// Enhanced Fallback System
function getEnhancedFallback(userQuery) {
    const query = userQuery.toLowerCase();
    
    if (query.includes('android') && query.includes('iphone')) {
        return `📱 **Transfer between Android and iPhone - Complete Guide:**

🚀 **QUICK TRANSFER METHOD:**
1. On Android Phone: Open Smart Switch → Quick Transfer → Send Data
2. Select file categories: Images, Videos, Audio, Files, Contacts
3. Choose specific files → Click "Done" button
4. Click "Send" button → Wait for upload completion
5. Generate QR Code or 6-digit PIN Code
6. On iPhone: Open Smart Switch → Quick Transfer → Receive Data
7. Choose: Scan QR Code OR Enter PIN Code
8. Download all files within 24 hours

⚡ **WiFi TRANSFER METHOD:**
1. Connect both phones to same WiFi network
2. On Android: WiFi Transfer → Send → Select files
3. On iPhone: WiFi Transfer → Receive → Download
4. No time limits, direct transfer

🔒 **Security Note:** Quick Transfer data automatically deletes after 24 hours for privacy protection.

Which transfer method would you like to use?`;
    }
    
    if (query.includes('send') && !query.includes('receive')) {
        return `📤 **Send Data - Complete Options:**

🚀 **QUICK TRANSFER SEND:**
• Cloud-based transfer
• Generate QR/PIN codes
• Receiver has 24 hours to download
• Perfect for phone-to-phone transfer

📶 **WiFi TRANSFER SEND:**
• Same network transfer
• Direct device-to-device
• No time limits
• Faster for large files

💻 **ANDROID TO PC SEND:**
• Generate IP address with port
• PC downloads via browser
• No software installation needed

Which send method would you like to use?`;
    }
    
    if (query.includes('receive') || query.includes('get data')) {
        return `📥 **Receive Data - Complete Guide:**

🔗 **QUICK TRANSFER RECEIVE:**
1. Open Quick Transfer → Receive Data
2. Choose: Scan QR Code OR Enter PIN Code
3. Connect to sender → Download files
4. Must download within 24 hours

📶 **WiFi TRANSFER RECEIVE:**
1. Ensure same WiFi network as sender
2. Open WiFi Transfer → Receive
3. Auto-detect sender device
4. Download files directly

💻 **ANDROID TO PC RECEIVE:**
1. Get IP address from sender (format: 192.168.x.x:8080)
2. Open PC web browser
3. Enter exact IP address
4. Download files directly

How did the sender share the data with you?`;
    }
    
    return `🤖 **Smart Switch Data Transfer Assistant**

I'm here to help you transfer data between devices seamlessly!

📱 **MAIN FEATURES:**
🚀 Quick Transfer - Cloud transfer (24-hour limit)
📶 WiFi Transfer - Direct transfer (No limits)  
💻 Android to PC - Browser download

🔒 **Security:** All transfers are encrypted and secure

What would you like to do today?`;
}

// Main Dialogflow Webhook
app.post('/webhook', async (req, res) => {
    console.log('\n=== 🔄 DIALOGFLOW WEBHOOK REQUEST ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Full Body:', JSON.stringify(req.body, null, 2));
    
    const userQuery = req.body.queryResult?.queryText || "Hello";
    const intentName = req.body.queryResult?.intent?.displayName || "Unknown Intent";
    
    console.log('📝 User Query:', userQuery);
    console.log('🎯 Intent Name:', intentName);
    
    try {
        // Call Groq AI
        const aiResponse = await callGroqAI(userQuery);
        console.log('✅ AI Response Generated');
        console.log('Response Length:', aiResponse.length);
        
        const response = {
            fulfillmentText: aiResponse,
            fulfillmentMessages: [
                {
                    text: {
                        text: [aiResponse]
                    }
                }
            ],
            source: "smart-switch-groq-webhook",
            payload: {
                webhook_source: "Groq AI + Llama 3.3",
                timestamp: new Date().toISOString()
            }
        };
        
        console.log('📤 Sending response to Dialogflow...');
        res.json(response);
        
    } catch (error) {
        console.error('❌ Webhook Error:', error.message);
        
        // Use enhanced fallback
        const fallbackResponse = getEnhancedFallback(userQuery);
        
        res.json({
            fulfillmentText: fallbackResponse,
            fulfillmentMessages: [
                {
                    text: {
                        text: [fallbackResponse]
                    }
                }
            ],
            source: "smart-switch-fallback-system"
        });
    }
});

// Health Check Endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: '✅ RUNNING',
        service: 'Smart Switch Groq Webhook',
        model: GROQ_CONFIG.model,
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            webhook: 'POST /webhook',
            health: 'GET /',
            test: 'GET /test',
            groq_status: 'GET /groq-status'
        }
    });
});

// Test Endpoint
app.get('/test', async (req, res) => {
    const testQuestion = "how to transfer photos from android to iphone using quick transfer?";
    
    try {
        const response = await callGroqAI(testQuestion);
        res.json({ 
            status: '✅ TEST SUCCESSFUL',
            model: GROQ_CONFIG.model,
            question: testQuestion,
            answer: response,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.json({ 
            status: '❌ TEST FAILED',
            error: error.message,
            fallback_answer: getEnhancedFallback(testQuestion),
            timestamp: new Date().toISOString()
        });
    }
});

// Groq Status Check
app.get('/groq-status', async (req, res) => {
    try {
        const testResponse = await callGroqAI("Say 'GROQ API IS WORKING' if you can read this.");
        res.json({ 
            groq_status: '✅ CONNECTED',
            model: GROQ_CONFIG.model,
            response: testResponse,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.json({ 
            groq_status: '❌ DISCONNECTED',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Error Handling Middleware
app.use((error, req, res, next) => {
    console.error('🚨 Unhandled Error:', error);
    res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log('\n🚀 SMART SWITCH GROQ WEBHOOK STARTED');
    console.log('=====================================');
    console.log('📍 Port:', PORT);
    console.log('🤖 Model:', GROQ_CONFIG.model);
    console.log('🌐 Environment:', process.env.NODE_ENV || 'development');
    console.log('⏰ Started at:', new Date().toISOString());
    console.log('\n📋 Available Endpoints:');
    console.log('   Health Check: http://localhost:' + PORT + '/');
    console.log('   Test AI: http://localhost:' + PORT + '/test');
    console.log('   Groq Status: http://localhost:' + PORT + '/groq-status');
    console.log('   Webhook: http://localhost:' + PORT + '/webhook');
    console.log('\n✅ Server is ready and waiting for requests...');
});
