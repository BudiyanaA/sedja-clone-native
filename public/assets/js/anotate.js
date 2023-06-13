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
		const brush = document.getElementById("brush-anotate").value;

		const item = {
			type: "anotate",
			data: freehandPath,
			x: 0,
			y: 0,
			height: 0, 
			rotation: 0,
			width: width,
			color: color,
			brush_type: brush,
		};

		return item;
	}
	return null;
}

            // Fungsi untuk mendapatkan pola brush berdasarkan jenisnya
            function getBrushPattern(brush, color) {
							switch (brush) {
									case 'brush1':
											return createBrushPattern1(color);
									case 'brush2':
											return createBrushPattern2(color);
									case 'brush3':
											return createBrushPattern3(color);
									case 'brush4':
											return createBrushPattern4(color);
									case 'brush5':
											return createBrushPattern5(color);
									default:
											return createBrushPattern1(color);
							}
					}

					// Fungsi untuk membuat pola brush 1
					function createBrushPattern1(color) {
							var patternCanvas = document.createElement('canvas');
							var patternContext = patternCanvas.getContext('2d');
							patternCanvas.width = 10;
							patternCanvas.height = 10;
							patternContext.fillStyle = color;
							patternContext.fillRect(0, 0, 10, 10);
							return patternCanvas;
					}

					// Fungsi untuk membuat pola brush 2
					function createBrushPattern2(color) {
							var patternCanvas = document.createElement('canvas');
							var patternContext = patternCanvas.getContext('2d');
							patternCanvas.width = 20;
							patternCanvas.height = 20;
							patternContext.fillStyle = color;
							patternContext.fillRect(0, 0, 10, 10);
							patternContext.fillRect(10, 10, 10, 10);
							return patternCanvas;
					}

					// Fungsi untuk membuat pola brush 3
					function createBrushPattern3(color) {
							var patternCanvas = document.createElement('canvas');
							var patternContext = patternCanvas.getContext('2d');
							patternCanvas.width = 20;
							patternCanvas.height = 20;
							patternContext.fillStyle = color;
							patternContext.fillRect(0, 0, 2, 20);
							patternContext.fillRect(4, 0, 2, 20);
							patternContext.fillRect(8, 0, 2, 20);
							patternContext.fillRect(12, 0, 2, 20);
							patternContext.fillRect(16, 0, 2, 20);
							return patternCanvas;
					}

					// Fungsi untuk membuat pola brush 4
					function createBrushPattern4(color) {
							var patternCanvas = document.createElement('canvas');
							var patternContext = patternCanvas.getContext('2d');
							patternCanvas.width = 20;
							patternCanvas.height = 20;
							patternContext.fillStyle = color;
							patternContext.fillRect(0, 0, 20, 2);
							patternContext.fillRect(0, 4, 20, 2);
							patternContext.fillRect(0, 8, 20, 2);
							patternContext.fillRect(0, 12, 20, 2);
							patternContext.fillRect(0, 16, 20, 2);
							return patternCanvas;
					}

					// Fungsi untuk membuat pola brush 5
					function createBrushPattern5(color) {
							var patternCanvas = document.createElement('canvas');
							var patternContext = patternCanvas.getContext('2d');
							patternCanvas.width = 20;
							patternCanvas.height = 20;
							patternContext.fillStyle = color;
							patternContext.fillRect(0, 0, 2, 2);
							patternContext.fillRect(4, 4, 2, 2);
							patternContext.fillRect(8, 8, 2, 2);
							patternContext.fillRect(12, 12, 2, 2);
							patternContext.fillRect(16, 16, 2, 2);
							return patternCanvas;
					}