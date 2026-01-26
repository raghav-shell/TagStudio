// STATE VARIABLES
let selectedElement = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

// DOM ELEMENTS
const stage = document.getElementById('canvasStage');
const propertiesPanel = document.getElementById('propertiesPanel');
const inputs = {
    shape: document.getElementById('canvasShape'),
    bg: document.getElementById('bgColor'),
    text: document.getElementById('propText'),
    font: document.getElementById('propFont'),
    color: document.getElementById('propColor'),
    size: document.getElementById('propSize')
};

// 1. CANVAS CONFIGURATION (With Auto-Layout Safety)
inputs.shape.addEventListener('change', (e) => {
    const newShape = e.target.value;
    stage.className = `tag-canvas ${newShape}`;
    
    // Auto-Fix: If elements are "out of bounds" after resize, pull them back in
    setTimeout(() => {
        const stageHeight = stage.clientHeight;
        const stageWidth = stage.clientWidth;
        
        document.querySelectorAll('.draggable').forEach(el => {
            const currentTop = parseInt(el.style.top || 0);
            const currentLeft = parseInt(el.style.left || 0);
            
            // If element is lower than new height, reset to top
            if (currentTop > stageHeight - 40) {
                el.style.top = '10px';
            }
            // If element is wider than new width, reset to left
            if (currentLeft > stageWidth - 40) {
                el.style.left = '10px';
            }
        });
    }, 300); // Wait for CSS transition
});

inputs.bg.addEventListener('input', (e) => {
    // This works because texture is transparent
    stage.style.backgroundColor = e.target.value;
});

// 2. ADD TOOL LOGIC
document.getElementById('addTextBtn').addEventListener('click', () => {
    const el = createDraggable('text');
    el.innerText = 'SIZE: M';
    el.style.fontSize = '16px';
    el.style.fontFamily = '-apple-system, sans-serif';
    el.style.fontWeight = '600';
    el.style.color = '#1d1d1f';
    el.style.left = '80px';
    el.style.top = '150px';
    stage.appendChild(el);
    selectElement(el);
});

document.getElementById('addBarcodeBtn').addEventListener('click', () => {
    const el = createDraggable('barcode');
    
    // Create container
    const container = document.createElement('div');
    container.className = 'barcode-container';
    container.style.width = '120px'; // Default width

    // Create bars
    const strip = document.createElement('div');
    strip.className = 'barcode-strip';
    
    // Create number
    const num = document.createElement('div');
    num.className = 'barcode-number';
    num.innerText = Math.floor(100000 + Math.random() * 900000); // Random 6 digit ID

    container.appendChild(strip);
    container.appendChild(num);
    el.appendChild(container);

    el.style.left = '60px';
    el.style.top = '250px';
    stage.appendChild(el);
    selectElement(el);
});

document.getElementById('imageUpload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
            const el = createDraggable('image');
            const img = document.createElement('img');
            img.src = evt.target.result;
            img.style.width = '100px';
            el.appendChild(img);
            el.style.left = '50px';
            el.style.top = '50px';
            stage.appendChild(el);
            selectElement(el);
        };
        reader.readAsDataURL(file);
    }
});

// 3. DRAG ENGINE
function createDraggable(type) {
    const div = document.createElement('div');
    div.classList.add('draggable');
    div.dataset.type = type;

    div.addEventListener('mousedown', (e) => {
        isDragging = true;
        selectedElement = div;
        const rect = div.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        selectElement(div);
        e.stopPropagation(); // Stop click from hitting stage
    });

    return div;
}

window.addEventListener('mousemove', (e) => {
    if (isDragging && selectedElement) {
        e.preventDefault();
        const stageRect = stage.getBoundingClientRect();
        let newX = e.clientX - stageRect.left - dragOffset.x;
        let newY = e.clientY - stageRect.top - dragOffset.y;
        
        selectedElement.style.left = `${newX}px`;
        selectedElement.style.top = `${newY}px`;
    }
});

window.addEventListener('mouseup', () => { isDragging = false; });

// 4. SELECTION & EDITING
stage.addEventListener('mousedown', (e) => {
    if (e.target === stage) deselectAll();
});

function selectElement(el) {
    document.querySelectorAll('.draggable').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');
    selectedElement = el;
    propertiesPanel.classList.remove('properties-hidden');

    const isText = el.dataset.type === 'text';
    document.getElementById('textControls').style.display = isText ? 'block' : 'none';

    if (isText) {
        inputs.text.value = el.innerText;
        inputs.font.value = el.style.fontFamily.replace(/"/g, "");
        inputs.color.value = rgbToHex(el.style.color);
        inputs.size.value = parseInt(el.style.fontSize);
    } else {
        // For Barcode/Image, size controls width
        const child = el.firstElementChild; // img or .barcode-container
        inputs.size.value = parseInt(child.style.width) || parseInt(getComputedStyle(child).width);
    }
}

function deselectAll() {
    selectedElement = null;
    document.querySelectorAll('.draggable').forEach(d => d.classList.remove('selected'));
    propertiesPanel.classList.add('properties-hidden');
}

// 5. LIVE PROPERTY UPDATES
inputs.text.addEventListener('input', (e) => {
    if (selectedElement?.dataset.type === 'text') selectedElement.innerText = e.target.value;
});

inputs.font.addEventListener('change', (e) => {
    if (selectedElement?.dataset.type === 'text') selectedElement.style.fontFamily = e.target.value;
});

inputs.color.addEventListener('input', (e) => {
    if (selectedElement?.dataset.type === 'text') selectedElement.style.color = e.target.value;
});

inputs.size.addEventListener('input', (e) => {
    if (!selectedElement) return;
    if (selectedElement.dataset.type === 'text') {
        selectedElement.style.fontSize = `${e.target.value}px`;
    } else {
        // Resize image or barcode container
        selectedElement.firstElementChild.style.width = `${e.target.value}px`;
    }
});

document.getElementById('deleteBtn').addEventListener('click', () => {
    if (selectedElement) {
        selectedElement.remove();
        deselectAll();
    }
});

// 6. SAVE LOGIC (LocalStorage)
document.getElementById('saveBtn').addEventListener('click', () => {
    const data = {
        shape: inputs.shape.value,
        bg: stage.style.backgroundColor,
        elements: []
    };
    
    document.querySelectorAll('.draggable').forEach(el => {
        data.elements.push({
            type: el.dataset.type,
            left: el.style.left,
            top: el.style.top,
            content: el.dataset.type === 'text' ? el.innerText : (el.querySelector('img')?.src || ''),
            styles: el.dataset.type === 'text' ? 
                { fontSize: el.style.fontSize, color: el.style.color, fontFamily: el.style.fontFamily } : 
                { width: el.firstElementChild.style.width }
        });
    });
    
    localStorage.setItem('tagStudioData', JSON.stringify(data));
    
    // Feedback
    const btn = document.getElementById('saveBtn');
    btn.innerText = 'Saved ✓';
    setTimeout(() => btn.innerText = 'Save Project', 2000);
});

// 7. EXPORT PDF LOGIC
document.getElementById('exportBtn').addEventListener('click', () => {
    deselectAll();
    window.print();
});

// Helper: RGB to Hex
function rgbToHex(rgb) {
    if (!rgb || rgb.startsWith('#')) return rgb || '#000000';
    const rgbValues = rgb.match(/\d+/g);
    if (!rgbValues) return '#000000';
    return "#" + rgbValues.map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
}