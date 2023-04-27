function addWitheout(startX, startY, endX, endY) {
    const width = endX - startX;
    const height = endY - startY;
    if (width > 0 && height > 0) {
      var item = {
        x: startX,
        y: startY,
        width: width, 
        height: height,
        borderWidth: 1, 
        borderColor: "#000000",
              backgroundColor: "#ffffff",
        type: "witheout",
      };
      return item;
    }
    return null;
  }
  
  function generateWitheoutSettings(item) {
      const html = `
    <div class="form-group">
      <label>Border Width:</label>
      <input value='${item.borderWidth}' type="range" id="border-width-witheout" oninput="changeSelectedWitheout()" min="1" max="10" value="1">
    </div>
    <div class="form-group">
      <label>Border Color:</label>
      <input value='${item.borderColor}' type="color" id="border-color-witheout" oninput="changeSelectedWitheout()" value="#000000">
    </div>
    <div class="form-group">
      <label>Background Color:</label>
      <input value='${item.backgroundColor}' type="color" id="background-color-witheout" oninput="changeSelectedWitheout()" value="#ffffff">
    </div>
    <div class="form-group">
      <button onclick="createItem('witheout')">Create Witheout</button>
    </div>
    <div class="form-group">
      <button onclick="duplicateItem()">Duplicate Selected</button>
    </div>
    <div class="form-group">
      <button onclick="deleteItem()"><i class="fas fa-trash-alt"></i></button>
    </div>
    `;
    return html;
  }
  
  function changeSelectedWitheout() {
    borderWidth = document.getElementById("border-width-witheout").value;
      borderColor = document.getElementById("border-color-witheout").value;
      backgroundColor = document.getElementById("background-color-witheout").value;
      
      if (!editingItem) {
          alert("Please select item to update.");
          return;
      }
  
      editingItem.borderWidth = borderWidth;
      editingItem.borderColor = borderColor;
      editingItem.backgroundColor = backgroundColor;
  
    drawItems();
  }