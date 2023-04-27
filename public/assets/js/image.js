function addImage(img) {
    if (img != null) {
          var item = {
              src: img,
              x: 0,
              y: 0,
              width: img.width, 
              height: img.height, 
              symbol_type: symbol, 
              type: "image",
          };
      addImageToList(img);
      return item;
    }
    return null;
  }
  
  function addImageToList(img) {
      var imageList = document.getElementById("image-list");
  
    const li = document.createElement("li");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
      // removeImageFromCanvas(img);
      removeImageFromList(li);
    });
      img.setAttribute("height", 50);
      img.setAttribute("width", 50);
    li.appendChild(img);
    li.appendChild(deleteButton);
    imageList.appendChild(li);
  }
  
  function removeImageFromList(li) {
      var imageList = document.getElementById("image-list");
    imageList.removeChild(li);
  }
  
  function generateImageSettings(item) {
      const html = `
      <div class="form-group">
        <button onclick="deleteItem()"><i class="fas fa-trash-alt"></i></button>
      </div>
    `;
    return html;
  }