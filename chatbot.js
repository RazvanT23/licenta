async function sendMessage() {
    const input = document.getElementById("userInput").value;
    document.getElementById("userInput").value = ""; 

    try {
        const response = await fetch('http://localhost:3001/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input })
        });

        const data = await response.json();
        const chatbotResponse = data.reply || "Error.";

        
        document.getElementById("chatbotResponse").innerHTML += `<p><strong>User:</strong> ${input}</p><p><strong>Chatbot:</strong> ${chatbotResponse}</p><br>`;
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("chatbotResponse").innerHTML += `<p><strong>Chatbot:</strong> Error.</p>`;
    }
}
