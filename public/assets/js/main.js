const pdfFile = document.getElementById('pdf-file');
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

function renderPDFPage(page, pdfCanvas, itemCanvas) {
	const viewport = page.getViewport({scale: 1});
	const pdfContext = pdfCanvas.getContext('2d');

	pdfCanvas.width = viewport.width;
	pdfCanvas.height = viewport.height;
	itemCanvas.width = viewport.width;
	itemCanvas.height = viewport.height;

	const wrapper = document.createElement('div');
	wrapper.classList.add("canvas-wrapper");
	wrapper.appendChild(pdfCanvas);
	wrapper.appendChild(itemCanvas);
	document.getElementById('pdfContainer').appendChild(wrapper);
	wrapper.id = "canvas-wrapper";
	// console.log(viewport.height + 10)
	// wrapper.style.height = (viewport.height / 6.6) + "%";
	wrapper.style.height = (viewport.height + 10) + "px";

	page.render({
		canvasContext: pdfContext,
		viewport: viewport
	});

	itemCanvas.addEventListener('click', function(event) {
		canvasClickHandler(event, itemCanvas.id);
	});
	itemCanvas.addEventListener('mousedown', function(event) {
		canvasMousedownHandler(event, itemCanvas.id);
	});
	itemCanvas.addEventListener('mousemove', function(event) {
		canvasMousemoveDrawHandler(event, itemCanvas.id);
		canvasMousemoveDragHandler(event, itemCanvas.id);
	});
	itemCanvas.addEventListener('mouseup', function(event) {
		canvasMouseupHandler(event, itemCanvas.id);
	});
	itemCanvas.addEventListener('dblclick', function(event) {
		canvasDblclickHandler(event, itemCanvas.id);
	});
}

async function loadPDFFile(file) {
	try {
		// startLoading();
		const typedArray = await file.arrayBuffer();
		const pdf = await pdfjsLib.getDocument(typedArray).promise;
		const numPages = pdf.numPages;

		const pdfContainer = document.getElementById('pdfContainer');
		const pdfFragment = document.createDocumentFragment();

		for (let pageNum = 1; pageNum <= numPages; pageNum++) {
			const page = await pdf.getPage(pageNum);
			const pdfCanvas = document.createElement('canvas');
			const itemCanvas = document.createElement('canvas');
			const pdfCanvasId = 'pdf-canvas-' + pageNum;
			const itemCanvasId = 'item-canvas-' + pageNum;
			pdfCanvas.classList.add("pdf-canvas");
			itemCanvas.classList.add("item-canvas");
			pdfCanvas.id = pdfCanvasId;
			itemCanvas.id = itemCanvasId;

			renderPDFPage(page, pdfCanvas, itemCanvas);
			// console.log(pageNum / numPages);
		}
		// finishLoading();
	} catch(error) {
		console.error(error);
	}
}

pdfFile.addEventListener('change', function() {
	var divElement = document.getElementById("pdfContainer");

	if (divElement) {
	  while (divElement.firstChild) {
		divElement.removeChild(divElement.firstChild);
	  }
	}

	const file = pdfFile.files[0];
	console.log(file);

	loadPDFFile(file);
});

function canvasClickHandler(event, canvasId) {
	const itemCanvas = document.getElementById(canvasId);
	const itemContext = itemCanvas.getContext('2d');

	const selectedMenu = document.getElementById('selected').value;
	const selectedSubMenu = document.getElementById('subselected').value;
	const x = event.offsetX;
	const y = event.offsetY;

	for (let i = items.length - 1; i >= 0; i--) {
		console.log(items)
    var item = items[i];
    var itemX = item.x;
    var itemY = item.y;
		
		if (item.canvas_id !== canvasId) continue;

		let itemWidth = 0;
		let itemHeight = 0;

		switch (item.type) {
			case 'links':
			case 'text':
				itemWidth = itemContext.measureText(item.text).width;
				itemHeight = parseInt(item.fontSize);
				break;
			case 'forms':
			case 'image':
			case 'witheout':
			case 'shape':
			case 'sign-container':
				itemWidth = item.width;
				itemHeight = item.height;
				break;
			case 'symbol':
				itemX = item.x - item.size;
				itemY = item.y - item.size;
				itemWidth = item.size * 2;
				itemHeight = item.size * 2;
				break;
		}

    if (x >= itemX && x <= itemX + itemWidth && y >= itemY && y <= itemY + itemHeight) {
			editingItem = item;
			drawItems();
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

	switch (selectedMenu) {
		case 'links':
			createItem(canvasId, 'links', x, y);
			break;
		case 'text':
			createItem(canvasId, 'text', x, y);
			break;
		case 'witheout':
		case 'sign-click':
			return;
		case 'forms':
			createItem(canvasId, 'symbol', x, y);
			break;
		case 'anotate':
			if (isFreehand === false) {
				activeFreehand();
			}
			break;
		case 'images':
			createItem(canvasId, 'image');
			break;
		case 'sign':
			if (selectedSubMenu === 'sign-image') {
				createItem(canvasId, 'sign-image');
			} else if (selectedSubMenu === 'sign-text') {
				createItem(canvasId, 'sign-text');
			}
			break;
		case 'shapes':
			if (selectedSubMenu === 'box') {
				createItem(canvasId, 'box');
			} else if (selectedSubMenu === 'circle') {
				createItem(canvasId, 'circle');
			}
			break;
	}

	hideSettings();
}

function canvasMousedownHandler(evt, canvasId) {
	const itemCanvas = document.getElementById(canvasId);
	const selectedMenu = document.getElementById('selected').value;
	mouse = getMousePos(itemCanvas, evt);
  checkForSelectedItem(canvasId);

	if (editingItem) {

		draggingResizer = anchorHitTest(evt.offsetX, evt.offsetY); //
		console.log(draggingResizer);
		if (draggingResizer < 0) {
			isDragging = true;
			dragOffsetX = mouse.x - editingItem.x;
			dragOffsetY = mouse.y - editingItem.y;
		}

	} else {
		switch (selectedMenu) {
			// case 'links':
			case 'witheout':
			case 'sign-click':
				startDraw(evt);
				break;
			case 'sign':
				if (isFreehand) {
					startDraw(evt);
				}
				break;
			case 'anotate':
				if (isFreehand) {
					startDraw(evt);
				}
				break;
		}
	}
}

function canvasMousemoveDrawHandler(e, canvasId) {
	const selectedMenu = document.getElementById('selected').value;
	const itemCanvas = document.getElementById(canvasId);
	const itemContext = itemCanvas.getContext('2d');

	if (!isDrawing) return;
	if (isFreehand && (selectedMenu == 'anotate' || selectedMenu == 'sign')) {
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
  	const width = endX - startX;
  	const height = endY - startY;
  	itemContext.clearRect(0, 0, itemCanvas.width, itemCanvas.height);
		drawItems();
  	itemContext.beginPath();
  	itemContext.rect(startX, startY, width, height);
  	itemContext.stroke();
	}
}

function canvasMousemoveDragHandler(evt, canvasId) {
	const itemCanvas = document.getElementById(canvasId);

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

function canvasMouseupHandler(evt, canvasId) {
	const selectedMenu = document.getElementById('selected').value;
	if (!editingItem && (selectedMenu == "witheout" || selectedMenu == "sign-click" || (selectedMenu == "sign" && isFreehand) || (selectedMenu == "anotate" && isFreehand))) {
		endDraw(canvasId); //
	}
	isDragging = false;
	draggingResizer = -1;
}

function canvasDblclickHandler(evt, canvasId) {
	const itemCanvas = document.getElementById(canvasId);

	mouse = getMousePos(itemCanvas, evt);
  checkForSelectedItem(canvasId);

	if (editingItem && editingItem.type == "sign-container") {
		const input = document.getElementById("sign-image-input");
		const file = input.files[0];

		if (!file.type.match("image.*")) {
			alert("Only image files are allowed.");
			return;
		}

		const reader = new FileReader();
		reader.onload = function (e) {
			const img = new Image();
			img.onload = function () {
				editingItem.signed = true;
				editingItem.src = img.src;
				drawItems();
			};
			img.src = e.target.result;
		};
		reader.readAsDataURL(file);

		drawItems();
	} else if (editingItem && editingItem.type == "links") {
		window.open(editingItem.link, '_blank');
	}
}

function startDraw(e) {
	startX = e.offsetX;
	startY = e.offsetY;
	isDrawing = true;
}

function endDraw(canvasId) {
	const selectedMenu = document.getElementById('selected').value;
	isDrawing = false;

	switch (selectedMenu) {
		// case 'links':
		// 	var text = prompt("Masukkan teks:");
		// 	if (text != null) {
		// 		showSettings({ 
		// 			type: selectedMenu, 
		// 			canvas_id: canvasId, 
		// 			link: text 
		// 		});
		// 		createItem(canvasId, 'links');
		// 	}
		// 	break;
		case 'witheout':
			showSettings({ type: selectedMenu, canvas_id: canvasId });
			break;
		case 'sign-click':
			// showSettings({ type: selectedMenu, canvas_id: canvasId });
			createItem(canvasId, 'sign-container');
			break;
		case 'sign':
			createItem(canvasId, 'sign-freehand');
			isFreehand = false;
			freehandPath = [];
			break;
		case 'anotate':
			createItem(canvasId, 'anotate');
			isFreehand = false;
			freehandPath = [];
			break;
		default:
			break;
	}
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top,
	};
}

function checkForSelectedItem(canvasId) {
	const itemCanvas = document.getElementById(canvasId);
	const itemContext = itemCanvas.getContext('2d');

	for (let i = items.length - 1; i >= 0; i--) {
	  const item = items[i];
	  const x = item.x;
	  const y = item.y;

		if (item.canvas_id !== canvasId) continue;

		let width = 0;
		let height = 0;

		switch (item.type) {
			case 'links':
			case 'text':
				width = itemContext.measureText(item.text).width;
				height = parseInt(item.fontSize);
				break;
			case 'forms':
			case 'image':
			case 'witheout':
			case 'shape':
			case 'sign-container':
				width = item.width;
				height = item.height;
				break;
			case 'sign':
				if (item.sign_type === 'text') {
					width = itemContext.measureText(item.data).width;
					height = 16;
				} else if (item.sign_type === 'image') {
					width = item.width;
					height = item.height;
				}
				break;
			default:
				break;
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
	const settingsMapping = {
		text: generateTextSettings,
		links: generateTextSettings,
		symbol: generateSymbolSettings,
		forms: generateFormSettings,
		image: generateImageSettings,
		witheout: generateWitheoutSettings,
		shape: generateShapeSettings,
		'sign-click': generateSignClickSettings
	};

	const generateSettings = settingsMapping[item.type];
	if (generateSettings) {
		settingsPanel.innerHTML = generateSettings(item);
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
	const itemMapping = {
		text: () => addText(x, y),
		links: () => addLink(x, y),
		symbol: () => addForm(x, y),
		textbox: () => addForm(type),
		textarea: () => addForm(type),
		radio: () => addForm(type),
		checkbox: () => addForm(type),
		image: () => {
			const input = document.getElementById("image-input");
			const file = input.files[0];

			if (!file.type.match("image.*")) {
				alert("Only image files are allowed.");
				return;
			}

			const reader = new FileReader();
			reader.onload = function (e) {
				const img = new Image();
				img.onload = function () {
					const newitem = addImage(img);

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
		},
		witheout: () => addWitheout(startX, startY, endX, endY),
		box: () => addShape(type),
		circle: () => addShape(type),
		"sign-container": () => addSignContainer(startX, startY, endX, endY),
		"sign-image": () => {
			const input = document.getElementById("image-input-sign");
			const file = input.files[0];
			const image = new Image();

			image.onload = function () {
				const newitem = addImageSign(image);

				newitem.canvas_id = canvasId;
				if (newitem) {
					items.push(newitem);
				}
				hideSettings();
				drawItems();
			};

			image.src = URL.createObjectURL(file);
		},
		"sign-text": () => addTextSign(),
		"sign-freehand": () => addFreehandSign(freehandPath),
		anotate: () => addAnotate(freehandPath),
	};

	const createItemFunc = itemMapping[type];
	if (createItemFunc) {
		const newItem = createItemFunc();
		newItem.canvas_id = canvasId;
		if (newItem) {
			items.push(newItem);
		}
		hideSettings();
		drawItems();
	}
}

function hideSettings() {
	settingsPanel.innerHTML = '';
}

function undo() {
	items.pop();
	drawItems();
}

function drawItems() {
	var canvases = document.querySelectorAll('.item-canvas');
	canvases.forEach(function(canvas) {
	  var context = canvas.getContext('2d');
	  context.clearRect(0, 0, canvas.width, canvas.height);
	});

  for (let i = 0; i < items.length; i++) {
		let item = items[i];
		const itemCanvas = document.getElementById(item.canvas_id);
		const itemContext = itemCanvas.getContext('2d');
		
		switch (item.type) {
		case "links":
		case "text":
			itemContext.font = item.fontStyle + " " + item.fontWeight + " " + item.fontSize + " " + item.font;
			itemContext.fillStyle = item.color;
			itemContext.textBaseline = "top";
			itemContext.textAlign = "left";
			itemContext.fillText(item.text, item.x, item.y);
			break;
	// 	case "links":
	// 		itemContext.beginPath();
	// 		itemContext.rect(item.x, item.y, item.width, item.height);
	// 		itemContext.fillStyle = "rgba(0, 0, 255, 0.1)";
	// 		itemContext.fill();
	// 		itemContext.strokeStyle = "blue";
	// 		itemContext.stroke();

	// 		var linkLabel, linkText;
    //   switch (item.link_type) {
    //     case "external":
    //       linkLabel = "External Link";
    //       linkText = item.link;
    //       break;
    //     case "email":
    //       linkLabel = "Email Link";
    //       linkText = item.link;
    //       break;
    //     case "phone":
    //       linkLabel = "Phone Link";
    //       linkText = item.link;
    //       break;
    //     case "pdf":
    //       linkLabel = "Internal PDF Link";
    //       break;
    //   }

	// 		if (linkLabel) {
	// 			itemContext.font = "12px Arial";
	// 			itemContext.fillStyle = "blue";
	// 			itemContext.fillText(linkLabel, item.x + 5, item.y + 15);
	// 		}
	// 		if (linkText) {
	// 			itemContext.fillText(linkText, item.x + 5, item.y + 30);
	// 		}

	// 		break;
		case "symbol":
			itemContext.save();
			itemContext.translate(item.x, item.y);
			itemContext.rotate(item.rotation * Math.PI / 180);
			itemContext.beginPath();
			itemContext.strokeStyle = "#000000";
			

			switch (item.symbol_type) {
				case "check":
					itemContext.moveTo(-item.size/2, 0);
					itemContext.lineTo(-item.size/6, item.size/3);
					itemContext.lineTo(item.size/2, -item.size/3);
					break;
				case "cross":
					itemContext.moveTo(-item.size/2, -item.size/2);
					itemContext.lineTo(item.size/2, item.size/2);
					itemContext.moveTo(item.size/2, -item.size/2);
					itemContext.lineTo(-item.size/2, item.size/2);
					break;
				case "dot":
					itemContext.arc(0, 0, item.size/2, 0, 2*Math.PI);
					itemContext.fill();
					break;
			}

			itemContext.stroke();
			itemContext.restore();
		case "forms":
			itemContext.beginPath();
			itemContext.rect(item.x, item.y, item.width, item.height);
			itemContext.strokeStyle = item.borderColor;
			itemContext.stroke();

			let formText;
			switch (item.form_type) {
				case "textbox":
				case "textarea":
					itemContext.textAlign = item.textAlignment;
					itemContext.font = item.fontSize + 'px Arial';
					if (item.form_type === "textarea") {
						formText = 'Textarea';
					}
					break;
				case "radio":
					itemContext.arc(item.x + 10, item.y + 10, 5, 0, 2 * Math.PI);
					itemContext.stroke();
					formText = 'Radio Button';
					break;
				case "checkbox":
					itemContext.rect(item.x + 5, item.y + 5, 10, 10);
					itemContext.stroke();
					formText = 'Checkbox Button';
					break;
				default:
					formText = '';
					break;
			}

			if (formText) {
				itemContext.fillText(formText, item.x + 10, item.y + 15);
			}
			break;
		case "image":
			try {
				// itemContext.drawImage(item.src, item.x, item.y, item.width, item.height);
				if (!item.hasOwnProperty("img_obj")) {
					const image = new Image();
					image.onload = function() {
						item.img_obj = image;
						drawItems();
					};
					image.src = item.src;
				}
				itemContext.drawImage(item.img_obj, item.x, item.y, item.width, item.height);
			} catch (e) {
				console.log(e);
			}
			break;
		case "witheout":
			itemContext.beginPath();
			itemContext.rect(item.x, item.y, item.width, item.height);
			itemContext.fillStyle = item.backgroundColor;
			itemContext.fill();
			itemContext.lineWidth = item.borderWidth;
			itemContext.strokeStyle = item.borderColor;
			itemContext.stroke();
			break;
		case "shape":
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
			break;
		case "sign-container":
			itemContext.beginPath();
			if (item.signed) {
				try {
					if (!item.hasOwnProperty("img_obj")) {
						const image = new Image();
						image.onload = function() {
							item.img_obj = image;
							drawItems();
							return;
						};
						image.src = item.src;
					}
					itemContext.drawImage(item.img_obj, item.x, item.y, item.width, item.height);
				} catch (e) {
					console.log(e);
				}
			} else {
				itemContext.rect(item.x, item.y, item.width, item.height);
				itemContext.fillStyle = item.backgroundColor;
				itemContext.fill();
				itemContext.lineWidth = item.borderWidth;
				itemContext.strokeStyle = item.borderColor;
				itemContext.stroke();
			}
			break;
		case "sign":
			if (item.sign_type == "image") {
				itemContext.drawImage(item.data, item.x, item.y, item.width, item.height);
			} else if (item.sign_type == "text") {
				itemContext.font = "normal normal 16px Arial";
				itemContext.fillStyle = "#FFFF00";
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
			break;
		case "anotate":
			var brushPattern = getBrushPattern(item.brush_type, item.color);
			itemContext.strokeStyle = itemContext.createPattern(brushPattern, 'repeat');
			itemContext.lineWidth = item.width;
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
			break;
		}

		if (editingItem) {
			const editingCanvas = document.getElementById(editingItem.canvas_id);
			const editingContext = editingCanvas.getContext('2d');

			editingContext.beginPath();
			// editingContext.rect(editingItem.x, editingItem.y, 10, 10);
			// editingContext.rect(editingItem.x+editingItem.width-10, editingItem.y, 10, 10);
			// editingContext.rect(editingItem.x, editingItem.y+editingItem.height-10, 10, 10);
			editingContext.fillStyle = "#000000";
			editingContext.rect(editingItem.x+editingItem.width-10, editingItem.y+editingItem.height-10, 10, 10);
			editingContext.fill();
			editingContext.strokeStyle = "#000000";
			editingContext.stroke();
		}
  }
} 

function activeFreehand() {
	isFreehand = true;
}

function anchorHitTest(x, y) {
	const size = 10;
	const position = 10;

	// top-left
	if (
		x >= editingItem.x &&
		x <= editingItem.x + size &&
		y >= editingItem.y &&
		y <= editingItem.y + size
	) {
		return (0);
	}

	// top-right
	if (
		x >= editingItem.x + editingItem.width - position &&
		x <= editingItem.x + editingItem.width - position + size &&
		y >= editingItem.y &&
		y <= editingItem.y + size
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
		x >= editingItem.x &&
		x <= editingItem.x + size &&
		y >= editingItem.y + editingItem.height - position &&
		y <= editingItem.y + editingItem.height - position + size
	) {
		return (3);
	}
	return (-1);

}