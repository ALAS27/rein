// Load stored files on page load
window.onload = function() {
    loadFiles();
};

// Open file picker when "Upload" button is clicked
document.getElementById("uploadBtn").addEventListener("click", function() {
    document.getElementById("fileInput").click();
});

// Handle file selection and upload
function handleFileSelect() {
    let fileInput = document.getElementById("fileInput");
    let file = fileInput.files[0];

    if (!file) return; // No file selected

    let reader = new FileReader();
    reader.onload = function(event) {
        let files = JSON.parse(localStorage.getItem("files") || "[]");

        files.push({ 
            name: file.name, 
            content: event.target.result, 
            type: file.type 
        });

        localStorage.setItem("files", JSON.stringify(files));

        loadFiles();
    };

    reader.readAsDataURL(file);
}

// Load files from storage with image preview
function loadFiles() {
    let fileList = document.getElementById("fileList");
    fileList.innerHTML = "";

    let files = JSON.parse(localStorage.getItem("files") || "[]");

    files.forEach((file, index) => {
        let li = document.createElement("li");
        li.classList.add("file-item");

        // Check if file is an image, otherwise show default file icon
        let filePreview = file.type.startsWith("image/")
            ? `<img src="${file.content}" class="file-thumbnail">`
            : `<img src="default-file.png" class="file-thumbnail">`;

        li.innerHTML = `
            ${filePreview}
            <a href="${file.content}" download="${file.name}" class="file-link">${file.name}</a>
            <div class="file-actions">
                <button class="rename" onclick="renameFile(${index})">Rename</button>
                <button class="delete" onclick="deleteFile(${index})">Delete</button>
            </div>
        `;
        fileList.appendChild(li);
    });
}

// Rename file
function renameFile(index) {
    let files = JSON.parse(localStorage.getItem("files") || "[]");
    let newName = prompt("Enter new file name:", files[index].name);

    if (newName && newName.trim() !== "") {
        files[index].name = newName.trim();
        localStorage.setItem("files", JSON.stringify(files));
        loadFiles();
    }
}

// Delete file
function deleteFile(index) {
    let files = JSON.parse(localStorage.getItem("files") || "[]");
    files.splice(index, 1);
    localStorage.setItem("files", JSON.stringify(files));

    loadFiles();
}
