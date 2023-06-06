function addAnotate(path) {
	if (path != null) {
		const { minX, minY, maxX, maxY } = freehandPath.reduce((prev, curr) => {
			return {
				minX: Math.min(prev.minX, curr.x),
				minY: Math.min(prev.minY, curr.y),
				maxX: Math.max(prev.maxX, curr.x),
				maxY: Math.max(prev.maxY, curr.y),
			};
		}, { minX: freehandPath[0].x, minY: freehandPath[0].y, maxX: freehandPath[0].x, maxY: freehandPath[0].y });
		
		const width = document.getElementById("width-anotate").value;
		const color = document.getElementById("color-anotate").value;

		const item = {
			type: "anotate",
			data: freehandPath,
			x: 0,
			y: 0,
			height: 0, 
			rotation: 0,
			width: width,
			color: color,
		};

		return item;
	}
	return null;
}