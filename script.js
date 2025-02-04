const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

// Set initial canvas size
canvas.width = 800;
canvas.height = 500;
ctx.fillStyle = "#ffffff"; // Default background
ctx.fillRect(0, 0, canvas.width, canvas.height);

let painting = false;
let brushColor = "#000000";
let brushSize = 5;
let backgroundColor = "#ffffff";
let strokes = [];
let redoStack = [];

// Get controls
const colorPicker = document.getElementById("color");
const sizePicker = document.getElementById("size");
const bgColorPicker = document.getElementById("bgcolor");
const undoBtn = document.getElementById("undo");
const clearBtn = document.getElementById("clear");
const saveBtn = document.getElementById("save");

// Update brush color
colorPicker.addEventListener("input", (e) => {
    brushColor = e.target.value;
});

// Update brush size
sizePicker.addEventListener("input", (e) => {
    brushSize = e.target.value;
});

// Update background color
bgColorPicker.addEventListener("input", (e) => {
    backgroundColor = e.target.value;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    redrawStrokes();
});

// Start drawing
canvas.addEventListener("mousedown", (e) => {
    painting = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
    strokes.push([]);
});

canvas.addEventListener("mousemove", (e) => {
    if (!painting) return;

    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.stroke();

    // Store stroke for undo
    strokes[strokes.length - 1].push({
        x: e.offsetX,
        y: e.offsetY,
        color: brushColor,
        size: brushSize,
    });
});

canvas.addEventListener("mouseup", () => {
    painting = false;
    ctx.closePath();
});

// Redraw strokes when background changes
function redrawStrokes() {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    strokes.forEach((stroke) => {
        ctx.beginPath();
        stroke.forEach((point, index) => {
            ctx.strokeStyle = point.color;
            ctx.lineWidth = point.size;
            ctx.lineCap = "round";

            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
            }
        });
        ctx.closePath();
    });
}

// Undo last stroke
undoBtn.addEventListener("click", () => {
    if (strokes.length > 0) {
        redoStack.push(strokes.pop());
        redrawStrokes();
    }
});

// Clear canvas
clearBtn.addEventListener("click", () => {
    strokes = [];
    redoStack = [];
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Save drawing
saveBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "drawing.png";
    link.click();
});
