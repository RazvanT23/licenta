
function sendMessage() {
    const input = document.getElementById("userInput").value.toLowerCase();
    let chatbotResponse = "";

    if (input.includes("lose weight") || (input.includes("lose") && input.includes("kg"))) {
        chatbotResponse = `
            <p>For weight loss, we recommend the following products:</p>
            <ul>
                <li><a href="wheyprotein.html">Whey Protein - High-quality protein to support muscle recovery</a></li>
                <li><a href="#">Green Tea - Effective fat burner</a></li>
            </ul>`;
    } else if (input.includes("muscle") || input.includes("gain")) {
        chatbotResponse = `
            <p>For muscle gain, check out these products:</p>
            <ul>
                <li><a href="wheyprotein.html">Whey Protein - Helps in muscle recovery and growth</a></li>
                <li><a href="#">Isolate Protein - Pure protein with minimal carbs</a></li>
            </ul>`;
    } else {
        chatbotResponse = `<p>I'm here to help with your fitness goals. Try typing a specific goal like "I want to lose 3 kg" or "I want to gain muscle."</p>`;
    }

    document.getElementById("chatbotResponse").innerHTML = chatbotResponse;
    document.getElementById("userInput").value = ""; 
}
