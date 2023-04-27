function addShape(type) {
    if (type != null) {
      var item = {
              x: 0,
              y: 0,
              width: 50,
              height: 50,
              shape_type: type,
              borderWidth: 1,
              borderColor: "#000000",
              backgroundColor: "#ffffff",
              type: "shape"
      };
      return item;
    }
    return null;
  }
  
  function generateShapeSettings(item) {
      const html = `
      <div class="form-group">
        <label>Border Width:</label>
        <input value=${item.borderWidth} type="range" id="border-width-shape" min="1" max="10" value="1" oninput="changeSelectedShape()">
      </div>
      <div class="form-group">
        <label>Border Color:</label>
        <input value=${item.borderColor} type="color" id="border-color-shape" value="#000000" oninput="changeSelectedShape()">
      </div>
      <div class="form-group">
        <label>Background Color:</label>
        <input value=${item.backgroundColor} type="color" id="background-color-shape" value="#ffffff" oninput="changeSelectedShape()">
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
  
  function changeSelectedShape() {
    borderWidth = document.getElementById("border-width-shape").value;
      borderColor = document.getElementById("border-color-shape").value;
      backgroundColor = document.getElementById("background-color-shape").value;
      
      if (!editingItem) {
          alert("Please select item to update.");
          return;
      }
  
      editingItem.borderWidth = borderWidth;
      editingItem.borderColor = borderColor;
      editingItem.backgroundColor = backgroundColor;
  
    drawItems();
  }
  