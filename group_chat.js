// Load messages when the page loads
window.onload = function () {
    loadMessages();
    checkUser();
};

// Load messages from local storage
function loadMessages() {
    let chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = localStorage.getItem("messages") || "";
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Ensure user is logged in
function checkUser() {
    let username = localStorage.getItem("chatUser");
    if (!username) {
        window.location.href = "index.html";
    }
}

// Send a new message
function sendMessage() {
    let username = localStorage.getItem("chatUser");
    let message = document.getElementById("message").value.trim();

    if (message === "") {
        alert("Please enter a message.");
        return;
    }

    let chatBox = document.getElementById("chat-box");
    let newMessage = `<p><strong>${username}:</strong> ${message}</p>`;

    // Save message in local storage
    let chatHistory = localStorage.getItem("messages") || "";
    chatHistory += newMessage;
    localStorage.setItem("messages", chatHistory);

    // Update chat box
    chatBox.innerHTML += newMessage;
    document.getElementById("message").value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Leave chat and return to user's page
function leaveChat() {
    let username = localStorage.getItem("chatUser");
    if (username) {
        window.location.href = username + ".html"; // Redirect back to their personal page
    } else {
        window.location.href = "index.html";
    }
}
