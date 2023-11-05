const menu = document.querySelectorAll('.btn-menu');
const submenu = document.getElementById('submenu');
const subselected = document.querySelector('#subselected');

menu.forEach(item => {
  item.addEventListener('click', () => {
    subselected.value = "";
    if (!item.classList.contains('active')) {
      menu.forEach(btn => {
        btn.classList.remove('active');
      });
      item.classList.add('active');
      document.querySelector('#selected').value = item.value;
      if (submenuItem[item.value]) {
        submenu.innerHTML = submenuItem[item.value];
      } else {
        submenu.innerHTML = "";
      } 
    } else {
      item.classList.remove('active');
      document.querySelector('#selected').value = "";
    }
  
    console.log(item.value);
    editingItem = null;
  });
});

function setSelectedSubmenu(value) {
  const subselected = document.querySelector('#subselected');
  if (subselected.value != value) {
    subselected.value = value;
  } else {
    subselected.value = "";
  }
}

const submenuItem = {
  forms: `
    <div>
      <button id="checkButton" onclick="setSymbol('check')"><i class="fas fa-check"></i></button>
      <button id="crossButton" onclick="setSymbol('cross')"><i class="fas fa-times"></i></button>
      <button id="dotButton" onclick="setSymbol('dot')"><i class="fas fa-circle"></i></button>
    </div>
    <div>
      <button onclick="setSymbol('textbox')">Add Textbox</button>
	    <button onclick="setSymbol('textarea')">Add Textarea</button>
	    <button onclick="setSymbol('radio')">Add Radio Button</button>
	    <button onclick="setSymbol('checkbox')">Add Checkbox Button</button>
    </div>
  `,
  images:  `
    <input type="file" id="image-input">
    <!-- <button onclick="createItem('image')">Add Image</button> -->
    <div>
      <ul id="image-list"></ul>
    </div>
  `,
  anotate: `
    <div class="form-group">
      <label>Border Width:</label>
      <input type="range" id="width-anotate" min="5" max="15" value="1">
    </div>
    <div class="form-group">
      <label>Border Color:</label>
      <input type="color" id="color-anotate" value="#000000">
    </div>
    <!-- <div class="form-group">
      <label for="brush-anotate">Brush:</label>
      <select id="brush-anotate">
        <option value="brush1">Brush 1</option>
        <option value="brush2">Brush 2</option>
        <option value="brush3">Brush 3</option>
        <option value="brush4">Brush 4</option>
        <option value="brush5">Brush 5</option>
      </select>
    </div> -->
  `,
  shapes: `
    <div>
      <button onclick="setSelectedSubmenu('box')">Create Box</button>
      <button onclick="setSelectedSubmenu('circle')">Create Circle</button>
    </div>
  `,
  sign: `
    <div>
      <input type="file" id="image-input-sign" accept="image/*">
      <button onclick="setSelectedSubmenu('sign-image')">File</button>
      <button onclick="setSelectedSubmenu('sign-text')">Tulisan</button>
      <button onclick="activeFreehand()" id="freehand-button">Gambar</button>
    </div>
  `,
  more: `
    <div>
      <button onclick="undo()">Undo</button>
    </div>
  `,
  "sign-click": `
    <input type="file" name="file" id="sign-image-input">
  ` 
}