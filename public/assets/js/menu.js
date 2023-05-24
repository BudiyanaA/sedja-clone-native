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
}