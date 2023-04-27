function addSignContainer(startX, startY, endX, endY) {
    const width = endX - startX;
    const height = endY - startY;
    if (width > 0 && height > 0) {
      var item = {
        x: startX,
        y: startY,
        width: width, 
        height: height,
              signed: false,
        borderWidth: 1, 
        borderColor: "#000000",
              backgroundColor: "#808080",
        type: "sign-container",
      };
      return item;
    }
    return null;
  }
  
  function generateSignClickSettings(item) {
      const html = `
      <div class="form-group">
        <button onclick="createItem('sign-container')">Create Container</button>
      </div>
    `;
    return html;
  }