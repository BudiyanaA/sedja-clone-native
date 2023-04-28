function addImageSign(image) {
	if (image != null) {
		var item = {
      type: "sign",
      data: image,
      x: 0,
      y: 0,
			width: image.width, 
			height: image.height, 
      rotation: 0,
      sign_type: "image",
		};
    return item;
  }
  return null;
}

function addTextSign() {
	var text = prompt("Masukkan tulisan:");

  if (text) {
		const item = {
			type: "sign",
			data: text,
			x: 0,
			y: 0,
			size: 16,
			rotation: 0,
			sign_type: "text",
		};
		return item;
  }
	return null;
}

function addFreehandSign(path) {
	if (path != null) {
		const { minX, minY, maxX, maxY } = freehandPath.reduce((prev, curr) => {
			return {
				minX: Math.min(prev.minX, curr.x),
				minY: Math.min(prev.minY, curr.y),
				maxX: Math.max(prev.maxX, curr.x),
				maxY: Math.max(prev.maxY, curr.y),
			};
		}, { minX: freehandPath[0].x, minY: freehandPath[0].y, maxX: freehandPath[0].x, maxY: freehandPath[0].y });
		
		const item = {
			type: "sign",
			data: path,
			x: minX,
			y: minY,
			width: maxX - minX, 
			height: maxY - minY, 
			rotation: 0,
			sign_type: "freehand",
		};

		return item;
	}
	return null;
}