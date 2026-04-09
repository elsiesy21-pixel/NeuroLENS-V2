const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let drawing = false

canvas.addEventListener("mousedown", () => drawing = true)
canvas.addEventListener("mouseup", () => drawing = false)
canvas.addEventListener("mouseleave", () => drawing = false)

canvas.addEventListener("mousemove", draw)

function draw(e){

if(!drawing) return

const rect = canvas.getBoundingClientRect()

const x = e.clientX - rect.left
const y = e.clientY - rect.top

ctx.fillStyle = "#111"

ctx.beginPath()
ctx.arc(x,y,3,0,Math.PI*2)

ctx.fill()

}

document.getElementById("clearBtn").onclick = ()=>{
ctx.clearRect(0,0,canvas.width,canvas.height)
}

document.getElementById("analyzeBtn").onclick = async ()=>{

document.getElementById("analysis").innerText = "Analyzing drawing..."

try{

const dataURL = canvas.toDataURL()

const response = await fetch("/api/generate",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
image:dataURL
})
})

if(!response.ok){
const text = await response.text()
document.getElementById("analysis").innerText = "Server error: " + text
return
}

const data = await response.json()

document.getElementById("analysis").innerText = data.text

}catch(err){

document.getElementById("analysis").innerText = "Error connecting to AI."

}

}
