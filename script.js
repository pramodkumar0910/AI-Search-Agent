const button = document.getElementById("searchBtn");
const questionInput = document.getElementById("question");
const chatBox = document.getElementById("chatBox");

// 🔁 Replace this with your Production Webhook URL
const WEBHOOK_URL = "https://pramodkumar.app.n8n.cloud/webhook/chat";

button.addEventListener("click", sendMessage);

questionInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {

    const question = questionInput.value.trim();

    if (!question) return;

    // User message
    addMessage(question, "user");

    questionInput.value = "";

    // AI loading message
    const loading = document.createElement("div");

loading.classList.add("message", "ai");

loading.innerHTML = `
<div class="loading">
    <div class="spinner"></div>
    Thinking...
</div>
`;

chatBox.appendChild(loading);

chatBox.scrollTop = chatBox.scrollHeight;

    try {

        const response = await fetch(WEBHOOK_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                sessionId: "user1",
                message: question
            })

        });

        const data = await response.json();

        // Remove loading
        loading.remove();

        // Display AI response
        const aiMessage = addMessage("", "ai");

const aiText =
    data.output ||
    data.response ||
    data.answer ||
    JSON.stringify(data, null, 2);

typeMessage(aiMessage, aiText);

    } catch (error) {

        loading.remove();

        addMessage("❌ Error connecting to AI Agent.", "ai");

        console.error(error);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

function addMessage(text, sender) {

    const div = document.createElement("div");

    div.classList.add("message");
    div.classList.add(sender);

    div.innerText = text;

    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;

    return div;
}
async function typeMessage(element, text) {

    element.innerHTML = "";

    for (let i = 0; i < text.length; i++) {

        element.innerHTML += text.charAt(i);

        chatBox.scrollTop = chatBox.scrollHeight;

        await new Promise(resolve => setTimeout(resolve, 15));

    }

}