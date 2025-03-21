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
    let newMessage = `<div class='message'><strong>${username}:</strong> ${message} <span class='time'>${new Date().toLocaleTimeString()}</span></div>`;

    // Save message in local storage
    let chatHistory = localStorage.getItem("messages") || "";
    chatHistory += newMessage;
    localStorage.setItem("messages", chatHistory);

    // Update chat box
    chatBox.innerHTML += newMessage;
    document.getElementById("message").value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Upload media (image/video)
function uploadFile() {
    let fileInput = document.getElementById("fileInput");
    let file = fileInput.files[0];

    if (file) {
        let reader = new FileReader();
        reader.onload = function (event) {
            let fileType = file.type.startsWith("image") ? "image" : "video";
            let chatBox = document.getElementById("chat-box");
            let mediaHTML = fileType === "image" ? `<img class='chat-image' src='${event.target.result}'>` : `<video class='chat-video' controls><source src='${event.target.result}' type='video/mp4'></video>`;

            let newMessage = `<div class='message'><strong>${localStorage.getItem("chatUser")}:</strong> ${mediaHTML} <span class='time'>${new Date().toLocaleTimeString()}</span></div>`;

            let chatHistory = localStorage.getItem("messages") || "";
            chatHistory += newMessage;
            localStorage.setItem("messages", chatHistory);
            chatBox.innerHTML += newMessage;
            chatBox.scrollTop = chatBox.scrollHeight;
        };
        reader.readAsDataURL(file);
    }
}

// Leave chat and return to user's page
function leaveChat() {
    let username = localStorage.getItem("chatUser");
    if (username) {
        window.location.href = username + "_file/" + username + ".html"; // Redirect to user's page
    } else {
        window.location.href = "index.html";
    }
}

// Admin options (Julius only)
function isAdmin() {
    return localStorage.getItem("chatUser") === "julius_alas";
}

function bumpMessage() {
    alert("Message bumped to the top!");
}

function removeMessage() {
    let chatBox = document.getElementById("chat-box");
    if (chatBox.lastChild) {
        chatBox.removeChild(chatBox.lastChild);
        localStorage.setItem("messages", chatBox.innerHTML);
    }
}