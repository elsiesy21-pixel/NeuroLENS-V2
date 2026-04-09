const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const analyzeBtn = document.getElementById("analyzeBtn");
const scanner = document.getElementById("scanner");
const resultsBox = document.getElementById("results");
const analysisText = document.getElementById("analysis");

// CRITICAL FIX: Fill the canvas with white so the AI doesn't see a black void
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let drawing = false;

// Drawing Event Listeners
canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mouseleave", () => drawing = false);

canvas.addEventListener("mousemove", (e) => {
    if(!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.fillStyle = "#0f172a"; // Dark clinical ink
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI*2);
    ctx.fill();
});

// Clear Button
document.getElementById("clearBtn").onclick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Repaint the white background after clearing
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Hide results again
    if(resultsBox) resultsBox.classList.add("hidden");
};

// Analyze Button
analyzeBtn.onclick = async () => {
    // Show UI loading state
    if(scanner) scanner.classList.remove("hidden");
    if(resultsBox) resultsBox.classList.remove("hidden");
    analysisText.innerText = "Scanning Neural Markers...";
    analyzeBtn.disabled = true;

    try {
        // Convert to JPEG format for the API
        const dataURL = canvas.toDataURL("image/jpeg", 0.8);

        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: dataURL })
        });

        const data = await response.json();
        
        // Output the AI response OR the exact error message
        analysisText.innerText = data.text;
        
    } catch (err) {
        analysisText.innerText = "Network Error: Could not reach the Vercel backend.";
    } finally {
        if(scanner) scanner.classList.add("hidden");
        analyzeBtn.disabled = false;
    }
};
