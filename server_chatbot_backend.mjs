

import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());


const HF_API_TOKEN = 'Bearer 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'; 

const MODEL_NAME = 'EleutherAI/gpt-neo-2.7B';

app.post('/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_NAME}`, {
            method: 'POST',
            headers: {
                'Authorization': HF_API_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: `Answer the question clearly without repeating.Answer clearly and completly: ${message}`, 
                parameters: {
                    max_length: 100, 
                    temperature: 0.2, 
                    top_p: 0.3, 
                    repetition_penalty: 2
                }
            })
        });

        const data = await response.json();

        
        if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
            const chatbotResponse = data[0].generated_text.trim();
            console.log("Chatbot answer:", chatbotResponse); 
            res.json({ reply: chatbotResponse });
        } else if (data.error) {
            console.error("API error:", data.error);
            res.status(500).json({ reply: `API Error: ${data.error}` });
        } else {
            console.error("Unexpected response format:", data);
            res.status(500).json({ reply: "Unexpected response format from Hugging Face API." });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ reply: "Error processing your request." });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
