const menu = document.querySelectorAll('.btn-menu');
const submenu = document.getElementById('submenu');

menu.forEach(item => {
  item.addEventListener('click', () => {
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

const submenuItem = {
  forms: `
    <div>
      <button id="checkButton" onclick="setSymbol('check')"><i class="fas fa-check"></i></button>
      <button id="crossButton" onclick="setSymbol('cross')"><i class="fas fa-times"></i></button>
      <button id="dotButton" onclick="setSymbol('dot')"><i class="fas fa-circle"></i></button>
    </div>
    <div>
      <button onclick="createItem('textbox')">Add Textbox</button>
	    <button onclick="createItem('textarea')">Add Textarea</button>
	    <button onclick="createItem('radio')">Add Radio Button</button>
	    <button onclick="createItem('checkbox')">Add Checkbox Button</button>
    </div>
  `,
  images:  `
    <input type="file" id="image-input">
    <button onclick="createItem('image')">Add Image</button>
    <div>
      <ul id="image-list"></ul>
    </div>
  `,
  shapes: `
    <div>
      <button onclick="createItem('box')">Create Box</button>
      <button onclick="createItem('circle')">Create Circle</button>
    </div>
  `,
}