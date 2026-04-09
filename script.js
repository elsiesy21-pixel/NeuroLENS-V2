const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const analyzeBtn = document.getElementById("analyzeBtn");
const scanner = document.getElementById("scanner");
const resultsBox = document.getElementById("results");
const analysisText = document.getElementById("analysis");

let drawing = false;

// Basic drawing setup
canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => drawing = false);
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

document.getElementById("clearBtn").onclick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    resultsBox.classList.add("hidden");
};

analyzeBtn.onclick = async () => {
    // Show UI loading state
    scanner.classList.remove("hidden");
    resultsBox.classList.remove("hidden");
    analysisText.innerText = "Analyzing neural markers...";
    analyzeBtn.disabled = true;

    try {
        const dataURL = canvas.toDataURL("image/jpeg", 0.8);
        const base64Image = dataURL.split(',')[1]; // Get just the base64 string

        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64Image })
        });

        const data = await response.json();
        analysisText.innerText = data.text;
    } catch (err) {
        analysisText.innerText = "Connection Error: Ensure your Vercel /api/generate route is configured.";
    } finally {
        scanner.classList.add("hidden");
        analyzeBtn.disabled = false;
    }
};
