## 🏷️ TagStudio - Professional Clothing Label Designer

Web Dev II (Batch 2029) - End Term Project
TagStudio is a fully functional, DOM-based web application that allows fashion brands and clothing manufacturers to design custom product tags, neck labels, and stickers. It features a drag-and-drop interface, real-time customization, and print-ready PDF export—all built with 100% Vanilla JavaScript (No Frameworks).

## 🚀 Problem Statement
Small clothing brands often struggle to visualize and create professional labels for their garments without expensive design software. TagStudio solves this by providing a browser-based, interactive tool to:
Visualize different tag shapes (Hangtags, Neck Labels).
Place logos, text, and barcodes precisely using drag-and-drop.
Export designs instantly for manufacturing.


## ✨ Key Features (Technical Highlights)
This project fulfills all Web Dev II requirements:
Advanced DOM Manipulation:
Elements (Text, Barcodes, Images) are created dynamically using document.createElement.
Real-time CSS updates for fonts, colors, and dimensions.
Automatic layout adjustment when resizing the canvas shape.

Complex Event Handling:
Drag & Drop Engine: A custom-built drag engine using mousedown, mousemove, and mouseup (No external drag libraries used).
Contextual UI: Properties panel automatically appears/disappears based on the selected element.
State Management & Persistence:
LocalStorage: Designs are saved locally and persist even if the browser is closed.
JSON Serialization: The entire canvas state (positions, styles, content) is serialized to JSON for storage.
Native Browser APIs:
Print API: Uses window.print() combined with @media print CSS to generate clean, vector-based PDF exports without external dependencies.
FileReader API: Allows users to upload local images (logos) directly to the canvas.

## 📂 Project Structure
1. index.html (Structure)
Contains the semantic HTML5 layout inspired by macOS applications.
Divides the viewport into the Navigation Bar, Frosted Glass Sidebar (Controls), and the Workspace (Canvas).
Includes specific containers for the "Hole Punch" visual and draggable layers.

2. style.css (Presentation)
No Frameworks: All styling is custom-written CSS3.
Apple-Like Aesthetic: Uses backdrop-filter: blur(30px) for glassmorphism effects and San Francisco system fonts.
3D Shadows: Implements filter: drop-shadow to ensure shadows respect the custom clipping paths of hangtags.
Print Logic: Includes a specific @media print block that hides the UI and renders only the tag for PDF export.

3. script.js (Logic)
Drag Engine: Calculates cursor offsets to ensure smooth movement of elements.
State Machine: Tracks the currently selectedElement to update the sidebar inputs in real-time.
Persistence: Handles the localStorage saving and loading logic.
Auto-Layout: Detects if an element is "out of bounds" when the tag shape changes and pulls it back onto the canvas.

## 🛠️ How to Run Locally
Since this project uses no backend or frameworks, it is extremely easy to run.
Method 1: Direct Open
Download the repository/folder.
Double-click index.html.
The app will open in your default browser.

## Method 2: VS Code Live Server (Recommended)
Open the project folder in VS Code.
Install the "Live Server" extension.
Right-click index.html and select "Open with Live Server".

## 📋 Usage Guide
Select Shape: Use the top-left dropdown to switch between "Hang Tag", "Neck Label", or "Square Sticker".
Add Elements: Click "Add Text" or "Add Barcode" to drop items onto the tag.
Customize: Click any element on the tag to select it. The sidebar will reveal options to change font, color, and size.
Drag & Drop: Click and hold any element to move it around.
Save: Click "Save Project" to store your work.
Export: Click "Export PDF" to save your design as a printable file.
