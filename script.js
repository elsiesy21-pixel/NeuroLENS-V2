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
    document.getElementById("analysis").innerText = "SCANNING NEURAL MARKERS...";
    
    try {
        const dataURL = canvas.toDataURL("image/jpeg", 0.8);

        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: dataURL })
        });

        const data = await response.json();
        document.getElementById("analysis").innerText = data.text;
    } catch (err) {
        document.getElementById("analysis").innerText = "Connection Error: Check Vercel Logs.";
    }
};
