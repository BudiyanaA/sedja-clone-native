/**
 * 
 * var editingItem: from main.js
 * func drawItems(): from main.js
 * 
 * TODO:
1. Setting value on form (edit)
 */

let symbol = null;
let size = 50;
let rotation = 0;

function addSymbol(x, y) {
  if (symbol != null) {
    var item = {
      x: x,
      y: y,
      rotation: 0, 
      size: 50, 
      symbol_type: symbol, 
      type: "symbol",
    };
    return item;
  }
  return null;
}

function setSymbol(type) {
  symbol = type;
}

function generateSymbolSettings(item) {
	const html = `
    <div class="form-group">
      <label>Size:</label>
      <input type="range" min="10" max="100" value="50" id="size-range-symbol" onchange="changeSizeSymbol()">
    </div>
    <div class="form-group">
      <label>Rotate:</label>
      <input type="range" min="0" max="360" value="0" id="rotate-range-symbol" onchange="rotateSymbol()">
    </div>
    <div class="form-group">
      <button onclick="deleteItem()"><i class="fas fa-trash-alt"></i></button>
    </div>
  `;
  return html;
}

function changeSizeSymbol() {
  size = document.getElementById("size-range-symbol").value;
	editingItem.size = size;
  drawItems();
}

function rotateSymbol() {
  rotation = document.getElementById("rotate-range-symbol").value;
	editingItem.rotation = rotation;
  drawItems();
}

function generateFormSettings(item) {
	const html = `
    <div class="form-group">
      <label>Width:</label>
      <input type="range" min="10" max="200" value="${item.width}" id="size-width-form" onchange="changeSizeForm()">
    </div>
    <div class="form-group">
      <label>Height:</label>
      <input type="range" min="10" max="100" value="${item.height}" id="size-height-form" onchange="changeSizeForm()">
    </div>
    <div class="form-group">
      <label for="border-color">Border Color:</label>
      <input type="color" id="border-color-form" value="${item.borderColor}" onchange="changeBorderColorForm()">
    </div>
    <div class="form-group">
      <label for="text-alignment-form">Text Alignment:</label>
      <select id="text-alignment-form" onchange="changeTextAlignmentForm()">
        <option ${item.textAlignment == "left" ? "selected" : ""} value="left">Left</option>
        <option ${item.textAlignment == "center" ? "selected" : ""} value="center">Center</option>
        <option ${item.textAlignment == "right" ? "selected" : ""} value="right">Right</option>
      </select>
    </div>
    <div class="form-group">
      <label for="border-color">Font Size:</label>
      <input type="number" id="font-size-form" min="8" max="72" value="${item.fontSize}" onchange="setFontSizeForm()">
    </div>
    <div class="form-group">
      <button onclick="duplicateItem()">Duplicate</button>
    </div>
    <div class="form-group">
      <button onclick="deleteItem()">Delete</button>
    </div>
  `;
  return html;
}

function changeSizeForm() {
  if (editingItem) {
    let width = document.getElementById('size-width-form').value;
    let height = document.getElementById('size-height-form').value
    editingItem.width = width;
    editingItem.height = height;
		drawItems();
  }
}

function changeBorderColorForm() {
  if (editingItem) {
    let borderColor = document.getElementById('border-color-form').value;
    editingItem.borderColor = borderColor;
    drawItems();
  }
}

function changeTextAlignmentForm() {
  if (editingItem) {
    let textAlignment = document.getElementById('text-alignment-form').value;
    editingItem.textAlignment = textAlignment;
    drawItems();
  }
}

function setFontSizeForm() {
  if (editingItem) {
    let fontSize = parseInt(document.getElementById('font-size-form').value);
    editingItem.fontSize = fontSize;
    drawItems();
  }
}

function addForm(type) {
  setSymbol(null);
  var item;
  switch (type) {
		case "textbox":
      item = {
        form_type: 'textbox',
        x: 50,
        y: 50,
        width: 150,
        height: 20,
        borderColor: '#000000',
        textAlignment: 'left',
        fontSize: 12,
        type: 'forms'
      };
      break;
    case "textarea":
      item = {
        form_type: 'textarea',
        x: 50,
        y: 100,
        width: 200,
        height: 100,
        borderColor: '#000000',
        textAlignment: 'left',
        fontSize: 12,
        type: 'forms'
      };
      break;
    case "radio":
      item = {
        form_type: 'radio',
        x: 50,
        y: 250,
        width: 20,
        height: 20,
        borderColor: '#000000',
        textAlignment: 'left',
        fontSize: 12,
        type: 'forms'
      }
      break;
    case "checkbox":
      item = {
        form_type: 'checkbox',
        x: 50,
        y: 300,
        width: 20,
        height: 20,
        borderColor: '#000000',
        textAlignment: 'left',
        fontSize: 12,
        type: 'forms'
      }
      break;
    default:
      break;
  }

  return item;
}