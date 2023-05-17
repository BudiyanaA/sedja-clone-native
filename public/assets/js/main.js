const pdfFile = document.getElementById('pdf-file');
const pdfCanvas = document.getElementById('pdf-canvas');
const pdfContext = pdfCanvas.getContext('2d');
const itemCanvas = document.getElementById('item-canvas');
const itemContext = itemCanvas.getContext('2d');
var settingsPanel = document.getElementById('action');
// const selectedMenu = document.getElementById('selected').value;
var items = [];
var editingItem = null;
var mouse = {
	x: 0,
	y: 0,
};
var startX, startY, endX, endY;
var isDrawing = false;
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

var isFreehand = false;
let freehandPath = [];

var draggingResizer = -1;

itemCanvas.width = 500;
itemCanvas.height = 800;
pdfCanvas.width = 500;
pdfCanvas.height = 800;

pdfFile.addEventListener('change', function() {
	const file = pdfFile.files[0];
	const fileReader = new FileReader();
	console.log(file);

	fileReader.onload = function() {
		const typedArray = new Uint8Array(this.result);
		pdfjsLib.getDocument(typedArray).promise.then(function(pdf) {
			// Mengatur jumlah halaman PDF
      var numPages = pdf.numPages;

			// Loop untuk menampilkan setiap halaman PDF
			for (var pageNum = 1; pageNum <= numPages; pageNum++) {
				(function(pageNum) {
					pdf.getPage(pageNum).then(function(page) {
						const viewport = page.getViewport({scale: 1});
						var canvas = document.createElement('canvas');
						var context = canvas.getContext('2d');
						canvas.width = viewport.width;
						canvas.height = viewport.height;
						canvas.id = 'canvas-' + pageNum;

						// Menambahkan canvas ke dalam elemen container
						// Misalnya, jika Anda memiliki elemen dengan id "pdfContainer"
						document.getElementById('pdfContainer').appendChild(canvas);

						page.render({
							canvasContext: context,
							viewport: viewport
						});

						canvas.addEventListener('click', function(event) {
							canvasClickHandler(event, canvas.id);
						});
					});
				})(pageNum);
			}

			// pdf.getPage(1).then(function(page) {
			// 	const viewport = page.getViewport({scale: 1});
			// 	pdfCanvas.width = viewport.width;
			// 	pdfCanvas.height = viewport.height;

			// 	itemCanvas.width = viewport.width;
			// 	itemCanvas.height = viewport.height;

			// 	page.render({
			// 		canvasContext: pdfContext,
			// 		viewport: viewport
			// 	});
			// });
		});
	};

	fileReader.readAsArrayBuffer(file);
});

function canvasClickHandler(event, canvasId) {
	console.log(canvasId);
	const itemCanvas = document.getElementById(canvasId);
	const itemContext = itemCanvas.getContext('2d');

	const selectedMenu = document.getElementById('selected').value;
	var x = event.offsetX;
	var y = event.offsetY;

	for (var i = items.length - 1; i >= 0; i--) {
		console.log(items)
    var item = items[i];
    var itemX = item.x;
    var itemY = item.y;
		
		if (item.canvas_id != canvasId) continue;

		if (item.type == "text") {
			var itemWidth = itemContext.measureText(item.text).width;
			var itemHeight = parseInt(item.fontSize);
		} else if (["links", "forms", "image", "witheout", "shape", "sign-container"].includes(item.type)) {
			var itemWidth = item.width;
			var itemHeight = item.height;
		} else if (item.type == "symbol") {
			itemX = item.x - item.size;
			itemY = item.y - item.size;
			var itemWidth = item.size * 2;
			var itemHeight = item.size * 2;
		} else {
			var itemWidth = 0
			var itemHeight = 0;
		}	

    if (x >= itemX && x <= itemX + itemWidth && y >= itemY && y <= itemY + itemHeight) {
			editingItem = item;
			drawItems();
			// console.log(item.type);
			hideSettings();
			showSettings(item);
      return;
    } else {
			if (editingItem) {
				editingItem = null;
				drawItems();
			}
		}
  }
	if (selectedMenu == "text") {
		createItem(canvasId, "text", x, y);
	} else if (selectedMenu == "links" || selectedMenu == "witheout" || selectedMenu == "sign-click" ) {
		return;
	} else if (selectedMenu == "forms") {
		createItem(canvasId, "symbol", x, y);
	} else if (selectedMenu == "anotate" && isFreehand == false) {
		activeFreehand();
	}
	hideSettings();
}

// itemCanvas.addEventListener('click', function(event) {
// 	const selectedMenu = document.getElementById('selected').value;
//   // var x = event.pageX - itemCanvas.offsetLeft;
//   // var y = event.pageY - itemCanvas.offsetTop;
// 	var x = event.offsetX;
// 	var y = event.offsetY;
//   for (var i = items.length - 1; i >= 0; i--) {
// 		console.log(items)
//     var item = items[i];
//     var itemX = item.x;
//     var itemY = item.y;
// 		if (item.type == "text") {
// 			var itemWidth = itemContext.measureText(item.text).width;
// 			var itemHeight = parseInt(item.fontSize);
// 		} else if (["links", "forms", "image", "witheout", "shape", "sign-container"].includes(item.type)) {
// 			var itemWidth = item.width;
// 			var itemHeight = item.height;
// 		} else if (item.type == "symbol") {
// 			itemX = item.x - item.size;
// 			itemY = item.y - item.size;
// 			var itemWidth = item.size * 2;
// 			var itemHeight = item.size * 2;
// 		} else {
// 			var itemWidth = 0
// 			var itemHeight = 0;
// 		}	

//     if (x >= itemX && x <= itemX + itemWidth && y >= itemY && y <= itemY + itemHeight) {
// 			editingItem = item;
// 			drawItems();
// 			console.log(item.type);
// 			hideSettings();
// 			showSettings(item);
//       return;
//     } else {
// 			if (editingItem) {
// 				editingItem = null;
// 				drawItems();
// 			}
// 		}
//   }
// 	if (selectedMenu == "text") {
// 		createItem("text", x, y);
// 	} else if (selectedMenu == "links" || selectedMenu == "witheout" || selectedMenu == "sign-click" ) {
// 		return;
// 	} else if (selectedMenu == "forms") {
// 		createItem("symbol", x, y);
// 	} else if (selectedMenu == "anotate" && isFreehand == false) {
// 		activeFreehand();
// 	}
// 	hideSettings();
// });

itemCanvas.addEventListener("mousedown", function (evt) {
  const selectedMenu = document.getElementById('selected').value;
	mouse = getMousePos(itemCanvas, evt);
  checkForSelectedItem();

	if (editingItem) {

		draggingResizer = anchorHitTest(evt.offsetX, evt.offsetY);
		if (draggingResizer < 0) {
			isDragging = true;
			dragOffsetX = mouse.x - editingItem.x;
			dragOffsetY = mouse.y - editingItem.y;
		}
		// console.log(draggingResizer);

	} else {
		if (selectedMenu == "links" || selectedMenu == "witheout" || selectedMenu == "sign-click" || (selectedMenu == "sign" && isFreehand == true) || (selectedMenu == "anotate" && isFreehand == true)) {
			startDraw(evt);
		}
	}
}, false);

itemCanvas.addEventListener("mousemove", draw);
itemCanvas.addEventListener("mousemove", moveSelectedItem);

itemCanvas.addEventListener("mouseup", function (evt) {
	const selectedMenu = document.getElementById('selected').value;
	if (!editingItem && (selectedMenu == "links" || selectedMenu == "witheout" || selectedMenu == "sign-click" || (selectedMenu == "sign" && isFreehand == true) || (selectedMenu == "anotate" && isFreehand == true))) {
		endDraw(evt);
	}
	isDragging = false;
	draggingResizer = -1;

}, false);


itemCanvas.addEventListener("dblclick", function (evt) {
	mouse = getMousePos(itemCanvas, evt);
  checkForSelectedItem();

	if (editingItem && editingItem.type == "sign-container") {
		editingItem.signed = true;
		drawItems();
	}
});

function startDraw(e) {
	startX = e.offsetX;
	startY = e.offsetY;
	isDrawing = true;
}

function draw(e) {
	if (!isDrawing) return;
	if (isFreehand) {
    const x = e.offsetX;
    const y = e.offsetY;

    freehandPath.push({x: x, y: y});
		
		itemContext.beginPath();
		itemContext.moveTo(startX, startY);
		itemContext.lineTo(x, y);
		itemContext.stroke();

		startX = e.offsetX;
		startY = e.offsetY;
	
	} else {
		endX = e.offsetX;
		endY = e.offsetY;
  	var width = endX - startX;
  	var height = endY - startY;
  	itemContext.clearRect(0, 0, itemCanvas.width, itemCanvas.height);
		drawItems();
  	itemContext.beginPath();
  	itemContext.rect(startX, startY, width, height);
  	itemContext.stroke();
	}
}

function endDraw(e) {
	const selectedMenu = document.getElementById('selected').value;
	isDrawing = false;
	if (selectedMenu == "links" || selectedMenu == "witheout" || selectedMenu == "sign-click") {
		showSettings({type: selectedMenu});
	} else if (selectedMenu == "sign") {
		createItem('sign-freehand');
		isFreehand = false;
		freehandPath = [];
	} else if (selectedMenu == "anotate") {
		createItem('anotate');
		isFreehand = false;
		freehandPath = [];
	}
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top,
	};
}

function checkForSelectedItem() {
	for (var i = items.length - 1; i >= 0; i--) {
	  var item = items[i];
	  var x = item.x;
	  // var y = item.y - parseInt(item.fontSize);
	  var y = item.y;
		if (item.type == "text") {
			var width = itemContext.measureText(item.text).width;
			var height = parseInt(item.fontSize);
		} else if (["links", "forms", "image", "witheout", "shape", "sign-container"].includes(item.type)) {
			var width = item.width;
			var height = item.height;
		} else if (item.type == "sign") {
			if (item.sign_type == "text") {
				var width = itemContext.measureText(item.data).width;
				var height = 16;
			} else if (item.sign_type == "image") {
				var width = item.width;
				var height = item.height;
			}
		} else {
			var width = 0
			var height = 0;
		}	
		
	  if (
			mouse.x >= x &&
			mouse.x <= x + width &&
			mouse.y >= y &&
			mouse.y <= y + height
	  ) {
		editingItem = item;
		return;
	  }
	}
	editingItem = null;
}

function moveSelectedItem(evt) {
	if (editingItem && draggingResizer > -1) {
		var mouseX = evt.offsetX;
		var mouseY = evt.offsetY;

		// resize the image
		switch (draggingResizer) {
			case 0:
					//top-left
					editingItem.x = mouseX;
					editingItem.width = editingItem.x + editingItem.width - mouseX;
					editingItem.y = mouseY;
					editingItem.height = editingItem.y + editingItem.height - mouseY;
					break;
			case 1:
					//top-right
					editingItem.y = mouseY;
					editingItem.width = mouseX - editingItem.x;
					editingItem.height = editingItem.y + editingItem.height - mouseY;
					break;
			case 2:
					//bottom-right
					editingItem.width = mouseX - editingItem.x;
					editingItem.height = mouseY - editingItem.y;
					break;
			case 3:
					//bottom-left
					editingItem.x = mouseX;
					editingItem.width = editingItem.x + editingItem.width - mouseX;
					editingItem.height = mouseY - editingItem.y;
					break;
		}

		if(editingItem.width<25){editingItem.width=25;}
		if(editingItem.height<25){editingItem.height=25;}

		drawItems();
	} else if (isDragging) {
		var mousePos = getMousePos(itemCanvas, evt);
		editingItem.x = mousePos.x - dragOffsetX;
		editingItem.y = mousePos.y - dragOffsetY;
		drawItems();
	}
}

function deleteItem() {
	var confirmed = confirm("Are you sure you want to delete this item?");
  if (confirmed) {
		var index = items.indexOf(editingItem);
  	items.splice(index, 1);
  	drawItems();
		editingItem = null;
		hideSettings();
	}
}

function showSettings(item) {
	// const selectedMenu = document.getElementById('selected').value;
	if (item.type == "text") {
		settingsPanel.innerHTML = generateTextSettings(item);
	} else if (item.type == "links") {
		settingsPanel.innerHTML = generateLinkSettings(item);
	} else if (item.type == "symbol") {
		settingsPanel.innerHTML = generateSymbolSettings(item);
	} else if (item.type == "forms") {
		settingsPanel.innerHTML = generateFormSettings(item);
	} else if (item.type == "image") {
		settingsPanel.innerHTML = generateImageSettings(item);
	} else if (item.type == "witheout") {
		settingsPanel.innerHTML = generateWitheoutSettings(item);
	} else if (item.type == "shape") {
		settingsPanel.innerHTML = generateShapeSettings(item);
	} else if (item.type == "sign-click") {
		settingsPanel.innerHTML = generateSignClickSettings(item);
	}
}

function duplicateItem() {
	if (!editingItem) {
		alert("Please select item to duplicate.");
		return;
	}

  if (editingItem) {
    let newElement = Object.assign({}, editingItem);
    newElement.x += 10;
    newElement.y += 10;
    items.push(newElement);
		drawItems();
  }
}

function createItem(canvasId, type, x = 0, y = 0) {
	let newitem = null;
	if (type == "text") {
		newitem = addText(x, y);
	} else if (type == "links") {
		newitem = addLink(startX, startY, endX, endY) ;
	} else if (type == "symbol") {
		newitem = addSymbol(x, y);
	} else if (["textbox", "textarea", "radio", "checkbox"].includes(type)) {
		newitem = addForm(type);
	} else if (type == "image") {
		const input = document.getElementById("image-input");
  	const file = input.files[0];

  	if (!file.type.match("image.*")) {
  	  alert("Only image files are allowed.");
  	  return;
  	}

  	const reader = new FileReader();
  	reader.onload = function(e) {
  	  const img = new Image();
  	  img.onload = function() {
				newitem = addImage(img);

				newitem.canvas_id = canvasId;
				if (newitem) {
					items.push(newitem);
				}
				hideSettings();
				drawItems();
  	  };
  	  img.src = e.target.result;
  	};
  	reader.readAsDataURL(file);
	} else if (type == "witheout") {
		newitem = addWitheout(startX, startY, endX, endY);
	} else if (type == "box" || type == "circle") {
		newitem = addShape(type);
	} else if (type == "sign-container") {
		newitem = addSignContainer(startX, startY, endX, endY);
	} else if (type == "sign-image") {
		const input = document.getElementById("image-input-sign");
		const file = input.files[0];
		const image = new Image();
	
		image.onload = function() {
			newitem = addImageSign(image);

			newitem.canvas_id = canvasId;
			if (newitem) {
				items.push(newitem);
			}
			hideSettings();
			drawItems();
		};
	
		image.src = URL.createObjectURL(file);
	} else if (type == "sign-text") {
		newitem = addTextSign();
	} else if (type == "sign-freehand") {
		newitem = addFreehandSign(freehandPath);
	} else if (type == "anotate") {
		newitem = addAnotate(freehandPath);
	}

	newitem.canvas_id = canvasId;
	if (newitem) {
		items.push(newitem);
	}
	hideSettings();
	drawItems();
}

function hideSettings() {
	settingsPanel.innerHTML = '';
}

function undo() {
	items.pop();
	drawItems();
}

function drawItems() {
  // itemContext.clearRect(0, 0, itemCanvas.width, itemCanvas.height);
	var canvases = document.querySelectorAll('canvas');
	canvases.forEach(function(canvas) {
	  var context = canvas.getContext('2d');
	  context.clearRect(0, 0, canvas.width, canvas.height);
	});

  for (var i = 0; i < items.length; i++) {
		var item = items[i];
		const itemCanvas = document.getElementById(item.canvas_id);
		const itemContext = itemCanvas.getContext('2d');
		
		if (item.type == "text") {
			itemContext.font = item.fontStyle + " " + item.fontWeight + " " + item.fontSize + " " + item.font;
			itemContext.fillStyle = item.color;
			itemContext.textBaseline = "top";
			itemContext.textAlign = "left";
			itemContext.fillText(item.text, item.x, item.y);
		} else if (item.type == "links") {
			itemContext.beginPath();
			itemContext.rect(item.x, item.y, item.width, item.height);
			itemContext.fillStyle = "rgba(0, 0, 255, 0.1)";
			itemContext.fill();
			itemContext.strokeStyle = "blue";
			itemContext.stroke();

			if (item.link_type === "external") {
				itemContext.font = "12px Arial";
				itemContext.fillStyle = "blue";
				itemContext.fillText("External Link", item.x + 5, item.y + 15);
				itemContext.fillText(item.link, item.x + 5, item.y + 30);
			} else if (item.link_typ === "email") {
				itemContext.font = "12px Arial";
				itemContext.fillStyle = "blue";
				itemContext.fillText("Email Link", item.x + 5, item.y + 15);
				itemContext.fillText(item.link, item.x + 5, item.y + 30);
			} else if (item.link_typ === "phone") {
				itemContext.font = "12px Arial";
				itemContext.fillStyle = "blue";
				itemContext.fillText("Phone Link", item.x + 5, item.y + 15);
				itemContext.fillText(item.link, item.x + 5, item.y + 30);
			} else if (item.link_typ === "pdf") {
				itemContext.font = "12px Arial";
				itemContext.fillStyle = "blue";
				itemContext.fillText("Internal PDF Link", item.x + 5, item.y + 15);
			}
		} else if (item.type == "symbol") {
			itemContext.save();
			itemContext.translate(item.x, item.y);
			itemContext.rotate(item.rotation * Math.PI / 180);
			itemContext.beginPath();

			if (item.symbol_type === "check") {
				itemContext.moveTo(-item.size/2, 0);
				itemContext.lineTo(-item.size/6, item.size/3);
				itemContext.lineTo(item.size/2, -item.size/3);
			} else if (item.symbol_type === "cross") {
				itemContext.moveTo(-item.size/2, -item.size/2);
				itemContext.lineTo(item.size/2, item.size/2);
				itemContext.moveTo(item.size/2, -item.size/2);
				itemContext.lineTo(-item.size/2, item.size/2);
			} else if (item.symbol_type === "dot") {
				itemContext.arc(0, 0, item.size/2, 0, 2*Math.PI);
				itemContext.fill();
			}

			itemContext.stroke();
			itemContext.restore();
		} else if (item.type == "forms") {
			itemContext.beginPath();
			itemContext.rect(item.x, item.y, item.width, item.height);
			itemContext.strokeStyle = item.borderColor;
			itemContext.stroke();

			if (item.form_type === "textbox" || item.form_type === "textarea") {
				itemContext.textAlign = item.textAlignment;
				itemContext.font = item.fontSize + 'px Arial';
			}
			if (item.form_type === "textarea") {
				itemContext.fillText('Textarea', item.x + 10, item.y + 20);
			} else if (item.form_type === "radio") {
				itemContext.arc(item.x + 10, item.y + 10, 5, 0, 2 * Math.PI);
				itemContext.stroke();
				itemContext.fillText('Radio Button', item.x + 20, item.y + 15);
			} else if (item.form_type === "checkbox") {
				itemContext.rect(item.x + 5, item.y + 5, 10, 10);
				itemContext.stroke();
				itemContext.fillText('Checkbox Button', item.x + 20, item.y + 15);
			} else {
				itemContext.fillText('Textbox', item.x + 10, item.y + 15);
			}
		} else if (item.type == "image") {
			itemContext.drawImage(item.src, item.x, item.y, item.width, item.height);
		} else if (item.type == "witheout") {
			itemContext.beginPath();
			itemContext.rect(item.x, item.y, item.width, item.height);
			itemContext.fillStyle = item.backgroundColor;
			itemContext.fill();
			itemContext.lineWidth = item.borderWidth;
			itemContext.strokeStyle = item.borderColor;
			itemContext.stroke();
		} else if (item.type == "shape") {
			itemContext.beginPath();
			if (item.shape_type === "box") {
				itemContext.rect(item.x, item.y, item.width, item.height);
			} else if (item.shape_type === "circle") {
				itemContext.arc(item.x + item.width/2, item.y + item.height/2, item.width/2, 0, 2*Math.PI);
			}
			itemContext.lineWidth = item.borderWidth;
			itemContext.strokeStyle = item.borderColor;
			itemContext.stroke();
			itemContext.fillStyle = item.backgroundColor;
			itemContext.fill();
		} else if (item.type == "sign-container") {
			itemContext.beginPath();
			itemContext.rect(item.x, item.y, item.width, item.height);
			itemContext.fillStyle = item.backgroundColor;
			itemContext.fill();
			itemContext.lineWidth = item.borderWidth;
			itemContext.strokeStyle = item.borderColor;
			itemContext.stroke();

			if (item.signed) {
				itemContext.beginPath();
				itemContext.arc(item.x + item.width/2, item.y + item.height/2, item.width/4, 0, 2 * Math.PI);
				itemContext.fillStyle = "black";
				itemContext.fill();
			}
		} else if (item.type == "sign") { 
			if (item.sign_type == "image") {
				itemContext.drawImage(item.data, item.x, item.y, item.width, item.height);
			} else if (item.sign_type == "text") {
				itemContext.font = "normal normal 16px Arial";
				itemContext.fillStyle = "#000000";
				itemContext.textBaseline = "top";
				itemContext.textAlign = "left";
				itemContext.fillText(item.data, item.x, item.y);
			} else if (item.sign_type == "freehand") {
				itemContext.beginPath();
				item.data.forEach(function(coord, index) {
					if (index === 0) {
						itemContext.moveTo(coord.x, coord.y);
					} else {
						itemContext.lineTo(coord.x, coord.y);
					}
				});
				itemContext.stroke();
			}
		} else if (item.type == "anotate") { 
			itemContext.strokeStyle = 'yellow';
			itemContext.lineWidth = 10;
			itemContext.lineJoin = 'round';
			itemContext.lineCap = 'round';

			itemContext.beginPath();
			item.data.forEach(function(coord, index) {
				if (index === 0) {
					itemContext.moveTo(coord.x, coord.y);
				} else {
					itemContext.lineTo(coord.x, coord.y);
				}
			});
			itemContext.stroke();
		}
  }

	if (editingItem) {
		itemContext.beginPath();
		itemContext.rect(editingItem.x-5, editingItem.y-5, 10, 10);
		itemContext.rect(editingItem.x+editingItem.width-5, editingItem.y-5, 10, 10);
		itemContext.rect(editingItem.x-5, editingItem.y+editingItem.height-5, 10, 10);
		itemContext.rect(editingItem.x+editingItem.width-5, editingItem.y+editingItem.height-5, 10, 10);
		itemContext.strokeStyle = "#000000";
		itemContext.stroke();
	}
}

function activeFreehand() {
	isFreehand = true;
}

function anchorHitTest(x, y) {
	const size = 10;
	const position = 5;

	// top-left
	if (
		x >= editingItem.x - position &&
		x <= editingItem.x - position + size &&
		y >= editingItem.y - position &&
		y <= editingItem.y - position + size
	) {
		return (0);
	}

	// top-right
	if (
		x >= editingItem.x + editingItem.width - position &&
		x <= editingItem.x + editingItem.width - position + size &&
		y >= editingItem.y - position &&
		y <= editingItem.y - position + size
	) {
		return (1);
	}
	// bottom-right
	if (
		x >= editingItem.x + editingItem.width - position &&
		x <= editingItem.x + editingItem.width - position + size &&
		y >= editingItem.y + editingItem.height - position &&
		y <= editingItem.y + editingItem.height - position + size
	) {
		return (2);
	}
	// bottom-left
	if (
		x >= editingItem.x - position &&
		x <= editingItem.x - position + size &&
		y >= editingItem.y + editingItem.height - position &&
		y <= editingItem.y + editingItem.height - position + size
	) {
		return (3);
	}
	return (-1);

}