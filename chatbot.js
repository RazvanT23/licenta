async function sendMessage() {
    const input = document.getElementById("userInput").value;
    const userId = localStorage.getItem("userId"); // Retrieve user ID from local storage
    document.getElementById("userInput").value = "";

    try {
        const response = await fetch('http://localhost:3001/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input, user_id: userId })
        });

        const data = await response.json();
        const chatbotResponse = data.reply || "Error.";

        document.getElementById("chatbotResponse").innerHTML += `<p><strong>User:</strong> ${input}</p><p><strong>Chatbot:</strong> ${chatbotResponse}</p><br>`;
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("chatbotResponse").innerHTML += `<p><strong>Chatbot:</strong> An error occurred.</p>`;
    }
}


    


async function sendRefundRequest() {
    const orderId = document.getElementById("orderId").value;
    const refundReason = document.getElementById("refundReason").value;
    const userId = localStorage.getItem("userId"); // Assuming user ID is stored in local storage

    try {
        const response = await fetch('http://localhost:3001/refund', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderId, user_id: userId, refund_reason: refundReason })
        });

        const data = await response.json();
        document.getElementById("chatbotResponse").innerHTML += `<p><strong>Chatbot:</strong> ${data.message}</p>`;
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("chatbotResponse").innerHTML += `<p><strong>Chatbot:</strong> An error occurred.</p>`;
    }
}
