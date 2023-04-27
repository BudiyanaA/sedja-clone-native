/**
 * 
 * var editingItem: from main.js
 * func drawItems(): from main.js
 * 
 */

function addText(x, y) {
    var text = prompt("Masukkan teks:");
    if (text != null) {
      var item = {
        text: text,
        x: x,
        y: y,
        font: "Arial",
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: "normal",
        textDecoration: "none",
        color: "#000000",
        link: "",
              type: "text",
      };
      return item;
    }
    return null;
  }
  
  function generateTextSettings(item) {
      const html = `
          <div class="form-group">
              <label for="font-input">Text:</label>
              <input value='${item.text}' type="text" id="text-input" onchange="setTextAttributeFromInput(this)" data-attribute="text">
          </div>
        <div class="form-group">
          <label for="font-input">Jenis Font:</label>
          <input value=${item.font} type="text" id="font-input" onchange="setTextAttributeFromInput(this)" data-attribute="font">
        </div>
        <div class="form-group">
          <label for="font-size-input">Ukuran Font:</label>
          <input value=${parseInt(item.fontSize)} type="number" id="font-size-input" onchange="setTextAttributeFromInput(this)" data-attribute="fontSize">
        </div>
        <div class="form-group">
          <label for="font-style-select">Gaya Font:</label>
          <select id="font-style-select" onchange="setTextAttributeFromInput(this)" data-attribute="fontStyle">
            <option ${item.fontStyle == "normal" ? "selected" : ""} value="normal">Normal</option>
            <option ${item.fontStyle == "italic" ? "selected" : ""} value="italic">Italic</option>
            <option ${item.fontStyle == "oblique" ? "selected" : ""} value="oblique">Oblique</option>
          </select>
        </div>
        <div class="form-group">
          <label for="font-weight-select">Ketebalan Font:</label>
          <select id="font-weight-select" onchange="setTextAttributeFromInput(this)" data-attribute="fontWeight">
            <option ${item.fontWeight == "normal" ? "selected" : ""} value="normal">Normal</option>
            <option ${item.fontWeight == "bold" ? "selected" : ""} value="bold">Bold</option>
            <option ${item.fontWeight == "lighter" ? "selected" : ""} value="lighter">Lighter</option>
            <option ${item.fontWeight == "bolder" ? "selected" : ""} value="bolder">Bolder</option>
          </select>
        </div>
        <div class="form-group">
          <label for="text-decoration-select">Dekorasi Teks:</label>
          <select id="text-decoration-select" onchange="setTextAttributeFromInput(this)" data-attribute="textDecoration">
            <option ${item.textDecoration == "none" ? "selected" : ""} value="none">None</option>
            <option ${item.textDecoration == "underline" ? "selected" : ""} value="underline">Underline</option>
            <option ${item.textDecoration == "overline" ? "selected" : ""} value="overline">Overline</option>
            <option ${item.textDecoration == "line-through" ? "selected" : ""} value="line-through">Line-Through</option>
          </select>
        </div>
        <div class="form-group">
          <label for="color-input">Warna Teks:</label>
          <input value=${item.color} type="color" id="color-input" onchange="setTextAttributeFromInput(this)" data-attribute="color">
        </div>
        <div class="form-group">
          <label for="link-input">Link:</label>
          <input value="${item.link}" type="text" id="link-input" onchange="setTextAttributeFromInput(this)" data-attribute="link">
          <button onclick="convertToLink()">Convert to link</button>
        </div>
        <div class="form-group">
          <button onclick="deleteItem()">Delete</button>
        </div>
      `;
    return html;
  }
  function setTextAttributeFromInput(input) {
    var attribute = input.getAttribute('data-attribute');
    var value = input.value;
    setTextAttribute(editingItem, attribute, value);
  }
  
  function setTextAttribute(item, attribute, value) {
    switch (attribute) {
          case "text":
        item.text = value;
        break;
      case "font":
        item.font = value;
        break;
      case "fontSize":
        item.fontSize = value + "px";
        break;
      case "fontStyle":
        item.fontStyle = value;
        break;
      case "fontWeight":
        item.fontWeight = value;
        break;
      case "textDecoration":
        item.textDecoration = value;
        break;
      case "color":
        item.color = value;
        break;
      case "link":
        item.link = value;
        break;
    }
    drawItems();
  }
  
  function convertToLink() {
    if (editingItem != null) {
      var link = prompt("Masukkan URL:");
      if (link != null && link != "") {
        setTextAttribute(editingItem, "link", link);
        var a = document.createElement("a");
        a.href = link;
        a.target = "_blank";
        a.innerHTML = editingItem.text;
        var span = document.createElement("span");
        span.appendChild(a);
        var html = span.innerHTML;
        setTextAttribute(editingItem, "text", html);
        drawItems();
      }
    }
  }