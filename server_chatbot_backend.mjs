import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import mysql from 'mysql2/promise';
import similarity from 'string-similarity';

const app = express();
app.use(cors());
app.use(express.json());

const HF_API_TOKEN = 'Bearer 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'; 
const MODEL_NAME = 'EleutherAI/gpt-neo-2.7B';

// Configure MySQL connection
const db = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'razvandiandra',
    database: 'user_authentication'
});




app.post('/chat', async (req, res) => {
    const { message, user_id } = req.body;

    try {
        const hfResponse = await fetch(`https://api-inference.huggingface.co/models/${MODEL_NAME}`, {
            method: 'POST',
            headers: {
                'Authorization': HF_API_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: `Extract the "order_id" and "reason" from this message: "${message}". Respond ONLY in JSON format.`,
                parameters: { max_length: 50, temperature: 0.2 }
            })
        });

        const hfData = await hfResponse.json();
        let parsedData;

        try {
            parsedData = JSON.parse(hfData[0]?.generated_text.trim());
        } catch (parseError) {
            const regex = /(?:^|\s)(\d+)\s+(.*)/i;
            const match = regex.exec(message);
            if (match) {
                parsedData = { order_id: match[1], reason: match[2].trim() };
            } else {
                // If unable to parse refund details, fallback to HuggingFace for a general response
                const generalResponse = await fetch(`https://api-inference.huggingface.co/models/${MODEL_NAME}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': HF_API_TOKEN,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        inputs: `The user says: "${message}". Respond as a helpful and friendly chatbot.`,
                        parameters: { max_length: 100, temperature: 0.7 }
                    })
                });
            
                const generalData = await generalResponse.json();
                const generalReply = generalData[0]?.generated_text.trim() || "I'm sorry, I didn't understand that.";
            
                res.json({ reply: generalReply });
                return;
            }
            
        }

        const { order_id, reason } = parsedData;

        // Retrieve all refund reasons from the database
        const [allReasons] = await db.query('SELECT reason, label FROM refund_reasons');

        // Find the closest match to the user-provided reason
        const reasonStrings = allReasons.map(r => r.reason);
        const matches = similarity.findBestMatch(reason, reasonStrings);
        const bestMatch = matches.bestMatch;

        let status;
        if (bestMatch.rating > 0.7) { // Threshold for similarity
            const matchedReason = allReasons.find(r => r.reason === bestMatch.target);
            status = matchedReason.label === 1 ? 'Approved' : 'Rejected';
        } else {
            status = 'Rejected';
        }

        // Insert or update refund request
        const [existingRequest] = await db.query('SELECT * FROM refund_requests WHERE order_id = ?', [order_id]);
        if (existingRequest.length === 0) {
            await db.query(
                'INSERT INTO refund_requests (order_id, user_id, reason, status) VALUES (?, ?, ?, ?)',
                [order_id, user_id || 1, reason, status]
            );
        } else {
            await db.query(
                'UPDATE refund_requests SET status = ?, reason = ? WHERE order_id = ?',
                [status, reason, order_id]
            );
        }

        res.json({ reply: `Your refund request for order ID ${order_id} has been ${status.toLowerCase()}.` });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ reply: "Error processing your request." });
    }
});





const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
