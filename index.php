<?php require 'helper.php'; ?>

<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
  <title>Upload dan Tampil PDF di Canvas</title>
  <link rel="stylesheet" href="<?php echo getBaseUrl() . '/public/assets/css/style.css' ?>" />
  <link rel="stylesheet" href="<?php echo getBaseUrl() . '/public/assets/css/font-awesome.min.css' ?>" />
</head>
<body>
  <div style="margin: auto;">
    <input type="hidden" id="doc-url">
    <input type="file" id="pdf-file" accept="application/pdf">
    <button id="save-button" class="save" onclick="saveFile()">Save</button>
    <button id="update-button" class="save" onclick="updateFile()" style="display:none;">Update</button>
    <input type="text" id="id-docs">
    <button class="load" onclick="loadFile()">Load</button>
    <button onclick="downloadPDF()">Download</button>
  </div>
  <hr>
  <div>
    <button class="btn-menu" value="text">Text</button>
    <button class="btn-menu" value="links">Links</button>
    <button class="btn-menu" value="forms">Forms</button>
    <button class="btn-menu" value="images">Images</button>
    <button class="btn-menu" value="sign">Sign</button>
    <button class="btn-menu" value="witheout">Witheout</button>
    <button class="btn-menu" value="anotate">Anotate</button>
    <button class="btn-menu" value="shapes">Shapes</button>
    <button class="btn-menu" value="more">More</button>
    <button class="btn-menu" value="sign-click">Sign-Click</button>
  </div><br>
  <div id="submenu"></div>
  <br>

  <input type="hidden" name="selected" id="selected" readonly>
  <input type="hidden" name="subselected" id="subselected" readonly>
  
  <div id="action"></div>

  <div id="overlay"></div>
  <div id="loadingModal" class="modal">
      <div class="modal-content">
          <div class="loader"></div>
          <p>Loading...</p>
      </div>
  </div>

  <div class="parent-container" id="pdfContainer"></div>

  <script src="<?php echo getBaseUrl() . '/public/assets/js/pdf.min.js' ?>"></script>
  <script src="<?php echo getBaseUrl() . '/public/assets/js/jspdf.umd.min.js' ?>"></script>
  <script src="<?php echo getBaseUrl() . '/public/assets/js/html2canvas.min.js' ?>"></script>
  <script src="<?php echo getBaseUrl() . '/public/assets/js/menu.js' ?>"></script>
  <script src="<?php echo getBaseUrl() . '/public/assets/js/text.js' ?>"></script>
  <script src="<?php echo getBaseUrl() . '/public/assets/js/links.js' ?>"></script>
  <script src="<?php echo getBaseUrl() . '/public/assets/js/form.js' ?>"></script>
  <script src="<?php echo getBaseUrl() . '/public/assets/js/image.js' ?>"></script>
  <script src="<?php echo getBaseUrl() . '/public/assets/js/witheout.js' ?>"></script>
  <script src="<?php echo getBaseUrl() . '/public/assets/js/shape.js' ?>"></script>
  <script src="<?php echo getBaseUrl() . '/public/assets/js/sign-click.js' ?>"></script>
  <script src="<?php echo getBaseUrl() . '/public/assets/js/sign.js' ?>"></script>
  <script src="<?php echo getBaseUrl() . '/public/assets/js/anotate.js' ?>"></script>
  <script src="<?php echo getBaseUrl() . '/public/assets/js/main.js' ?>"></script>

  <script src="https://unpkg.com/pdf-lib"></script>
  <script src="https://unpkg.com/downloadjs@1.4.7"></script>

  <script>
    function generateId() {
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var id = '';
      for (var i = 0; i < 20; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return id;
    }

function saveFile() {
  var input = document.querySelector('input[type="file"]');
  var file = input.files[0];
  var formData = new FormData();

  formData.append('pdfFile', file);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'upload.php', true);

  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        // Mengambil response dari server
        var response = JSON.parse(this.responseText);

        // Jika pengiriman data berhasil, kirim data ke server database
        if (response.success) {
          var xhrDb = new XMLHttpRequest();
          xhrDb.open('POST', 'koneksi.php', true);
          xhrDb.setRequestHeader('Content-type', 'application/json');

          var baseUrl = window.location.origin;
          var relativeUrl = baseUrl + '/upload/' + file.name;
          var id = generateId();

          items.forEach(function(v){ delete v.img_obj });

          var data = {
            id: id,
            file: file.name,
            url: relativeUrl,
            items: JSON.stringify(items)
          };

          xhrDb.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE) {
              if (this.status === 200 && JSON.parse(this.response).success) {
                console.log("Data berhasil disimpan ke database");
                alert("File berhasil diunggah ke database dengan id: " + id);
              } else {
                console.log("Terjadi kesalahan saat menyimpan data ke database: " + this.status);
                alert("Terjadi kesalahan saat menyimpan data ke database.");
              }
            }
          };

          xhrDb.send(JSON.stringify(data));
        }
      } else {
        console.log("Terjadi kesalahan saat mengunggah file: " + this.status);
        alert("Terjadi kesalahan saat mengunggah file. Kode status: " + this.status);
      }
    }
  };

  xhr.send(formData);
}

function updateFile() {
          var xhrDb = new XMLHttpRequest();
          xhrDb.open('PUT', 'koneksi.php', true);
          xhrDb.setRequestHeader('Content-type', 'application/json');

          var id = document.getElementById('id-docs').value;
          if (id == '') return;

          items.forEach(function(v){ delete v.img_obj });

          var data = {
            id: id,
            items: JSON.stringify(items)
          };

          xhrDb.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE) {
              if (this.status === 200 && JSON.parse(this.response).success) {
                console.log("Data berhasil diupdate ke database");
                alert("File berhasil diupdate ke database dengan id: " + id);
              } else {
                console.log("Terjadi kesalahan saat menyimpan data ke database: " + this.status);
                alert("Terjadi kesalahan saat menyimpan data ke database.");
              }
            }
          };

          xhrDb.send(JSON.stringify(data));
}

function loadFile() {
  const docId = document.getElementById("id-docs").value;
    fetch(`load.php?id=${docId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Dokumen dengan ID ${docId} tidak ditemukan.`);
         }
        return response.json();
      })
      .then(doc => {
        console.log(doc.items);
        console.log(`Data dokumen dengan ID ${docId}: `, doc);
          if (doc.url) {
            document.getElementById("doc-url").value = doc.url;
            var pdfjsLib = window['pdfjs-dist/build/pdf'];
            pdfjsLib.getDocument({
              url: doc.url,
              mode: 'no-cors'
            }).promise.then(async function(pdf) {
              const numPages = pdf.numPages;
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
              }
              items = JSON.parse(doc.items);
              console.log(items);
              drawItems();
            });
          } else {
            items = JSON.parse(doc.items);
            console.log(items);
            drawItems();
          }

          document.getElementById('save-button').style.display = 'none';
          document.getElementById('update-button').style.display = 'block';
        })
        .catch(error => {
          alert("Error saat mengambil dokumen");
          console.log(`Error saat mengambil dokumen: ${error}`);
        });
      } 

  function combineCanvasImagesToHTML() {
    var canvasElements = document.querySelectorAll('.item-canvas');
    var combinedCanvas = document.createElement('canvas');
    var context = combinedCanvas.getContext('2d');
    combinedCanvas.width = 400; // Ganti ukuran dengan lebar halaman PDF
    combinedCanvas.height = 600; // Ganti ukuran dengan tinggi halaman PDF

    canvasElements.forEach(function(canvasElement, index) {
        context.drawImage(canvasElement, 0, 0, canvasElement.width, canvasElement.height, 0, index * 200, 400, 200);
    });

    return combinedCanvas;
  }

      async function downloadPDF() {
        startLoading();
        var pdf = null;
        if (pdfFile.files[0] !== undefined) {
            pdf = await pdfFile.files[0].arrayBuffer();
        } else if ( document.getElementById("doc-url").value != '') {
            const url = document.getElementById("doc-url").value
            pdf = await fetch(url).then(res => res.arrayBuffer())
        } else {
            console.error("download failed")
            return
        }

        try {
          const pdfDoc = await PDFLib.PDFDocument.load(pdf);
          const pages = pdfDoc.getPages();
          const form = pdfDoc.getForm()
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const id = item.canvas_id.split("-")[2];
            const { width, height } = pages[id-1].getSize()

            switch (item.type) {
              case "text":
                fontSize = parseInt(item.fontSize);
                color = hexToRgb(item.color);
                // pages[id-1].moveTo(item.x, height - item.y);
                pages[id-1].drawText(item.text, {
                  x: item.x,
                  y: height - item.y - fontSize + (fontSize / 3.75),
                  size: fontSize,
                  // font: item.fontStyle,
                  color: PDFLib.rgb(color.r, color.g, color.b),
                });
                break;
              case "links":
                fontSize = parseInt(item.fontSize);
                color = hexToRgb(item.color);

                const itemLinkCanvas = document.createElement("canvas");
	              const itemLinkContext = itemLinkCanvas.getContext('2d');
                itemWidth = itemLinkContext.measureText(item.text).width;
                itemY = height - (item.y + fontSize)

                pages[id-1].drawText(item.text, {
                  x: item.x,
                  y: height - item.y - fontSize + (fontSize / 3.75),
                  size: fontSize,
                  // font: item.fontStyle,
                  color: PDFLib.rgb(color.r, color.g, color.b),
                });
                const link = createPageLinkAnnotation(pages[id-1], item.link, [
                  item.x + 3.75, itemY, item.x + 3.75 + itemWidth, itemY + fontSize
                ]);
                pages[id-1].node.set(PDFLib.PDFName.of('Annots'), pdfDoc.context.obj([link]));
                break;
              case "symbol":
                color = hexToRgb("#000000");
                switch (item.symbol_type) {
                  case "check":
                    pages[id-1].drawLine({
                      start: {
                        x: item.x + (-item.size/2), 
                        y: height - (item.y + 0)
                      },
                      end: {
                        x: item.x + (-item.size/6), 
                        y: height - (item.y + (item.size/3))
                      },
                      thickness: 1,
                      color: PDFLib.rgb(color.r, color.g, color.b),
                    });
                    pages[id-1].drawLine({
                      start: {
                        x: item.x + (-item.size/6), 
                        y: height - (item.y + (item.size/3))
                      },
                      end: {
                        x: item.x + (item.size/2), 
                        y: height - (item.y + (-item.size/3))
                      },
                      thickness: 1,
                      color: PDFLib.rgb(color.r, color.g, color.b),
                    });
                    break;
                    case "cross":
                      pages[id-1].drawLine({
                        start: {
                          x: item.x + (-item.size/2), 
                          y: height - (item.y + -item.size/2)
                        },
                        end: {
                          x: item.x + (item.size/2), 
                          y: height - (item.y + (item.size/2))
                        },
                        thickness: 1,
                        color: PDFLib.rgb(color.r, color.g, color.b),
                      });
                      pages[id-1].drawLine({
                        start: {
                          x: item.x + (item.size/2), 
                          y: height - (item.y + (-item.size/2))
                        },
                        end: {
                          x: item.x + (-item.size/2), 
                          y: height - (item.y + (item.size/2))
                        },
                        thickness: 1,
                        color: PDFLib.rgb(color.r, color.g, color.b),
                      });
                    break;
                    case "dot":
                      pages[id-1].drawCircle({ 
                        x: item.x, 
                        y: height - item.y,
                        size: item.size/2,
                        color: PDFLib.rgb(color.r, color.g, color.b),
                      })
					          break;
                }
                break;
              case "forms":
                switch (item.form_type) {
                  case "textbox":
				          case "textarea":
                    const textfield = form.createTextField(`${item.x}${item.y}`)
                    if(item.form_type == "textarea") {
                      textfield.enableMultiline();
                    }
                    textfield.addToPage(pages[id-1], { 
                      x: item.x, 
                      y: height - (item.y + item.height),
                      width: item.width,
                      height: item.height, 
                    })
				          	break;
                  case "radio":
                    const radio = form.createRadioGroup(`${item.x}${item.y}`)
                    radio.addOptionToPage('', pages[id-1], { 
                      x: item.x, 
                      y: height - (item.y + item.height),
                      width: item.width,
                      height: item.height,
                    })
                    break;
                  case "checkbox":
                    const checkbox = form.createCheckBox(`${item.x}${item.y}`)
                    checkbox.addToPage(pages[id-1], { 
                      x: item.x, 
                      y: height - (item.y + item.height),
                      width: item.width,
                      height: item.height,
                    })
                    break;
                }
                break;
              case "image":
                const type = detectImageType(item.src)
                if (type == "JPG") {
                  var image = await pdfDoc.embedJpg(item.src)
                } else if (type == "PNG") {
                  var image = await pdfDoc.embedPng(item.src)
                } else {
                  break;
                }
                
                pages[id-1].drawImage(image, { 
                  x: item.x, 
                  y: height - (item.y + item.height),
                  width: item.width,
                  height: item.height,
                })
                break;
              case "witheout":
                color = hexToRgb(item.backgroundColor);
                brcolor = hexToRgb(item.borderColor);
                pages[id-1].drawRectangle({ 
                  x: item.x, 
                  y: height - (item.y + item.height),
                  width: item.width,
                  height: item.height,
                  color: PDFLib.rgb(color.r, color.g, color.b),
                  borderColor: PDFLib.rgb(brcolor.r, brcolor.g, brcolor.b),
                  borderWidth: parseFloat(item.borderWidth), 
                })
                break;
              case "shape":
                color = hexToRgb(item.backgroundColor);
                brcolor = hexToRgb(item.borderColor);
                if (item.shape_type === "box") {
			          	pages[id-1].drawRectangle({ 
                    x: item.x, 
                    y: height - (item.y + item.height),
                    width: item.width,
                    height: item.height,
                    color: PDFLib.rgb(color.r, color.g, color.b),
                    borderColor: PDFLib.rgb(brcolor.r, brcolor.g, brcolor.b),
                    borderWidth: parseFloat(item.borderWidth), 
                  })
			          } else if (item.shape_type === "circle") {
                  pages[id-1].drawCircle({ 
                    x: item.x, 
                    y: height - (item.y + item.height),
                    size: item.width/2,
                    color: PDFLib.rgb(color.r, color.g, color.b),
                    borderColor: PDFLib.rgb(brcolor.r, brcolor.g, brcolor.b),
                    borderWidth: parseFloat(item.borderWidth), 
                  })
			          }
                break;
              case "sign-container":
                color = hexToRgb(item.backgroundColor);
                brcolor = hexToRgb(item.borderColor);
                if (item.signed) {
                  const type = detectImageType(item.src)
                  if (type == "JPG") {
                    var image = await pdfDoc.embedJpg(item.src)
                  } else if (type == "PNG") {
                    var image = await pdfDoc.embedPng(item.src)
                  } else {
                    break;
                  }

                  pages[id-1].drawImage(image, { 
                    x: item.x, 
                    y: height - (item.y + item.height),
                    width: item.width,
                    height: item.height,
                  })
                } else {
                  pages[id-1].drawRectangle({ 
                    x: item.x, 
                    y: height - (item.y + item.height),
                    width: item.width,
                    height: item.height,
                    color: PDFLib.rgb(color.r, color.g, color.b),
                    borderColor: PDFLib.rgb(brcolor.r, brcolor.g, brcolor.b),
                    borderWidth: parseFloat(item.borderWidth), 
                  })
                }
                break;
              case "anotate":
                var color = hexToRgb(item.color);
                var beforeX, beforeY;
                item.data.forEach(function(coord, index) {
			          	if (index === 0) {
                    beforeX = coord.x;
                    beforeY = coord.y;
                    return;
			          	} else {
			          		pages[id-1].drawLine({
                       start: {
                         x: beforeX, 
                         y: height - beforeY
                       },
                       end: {
                         x: item.x + coord.x, 
                         y: height - coord.y
                       },
                       thickness: parseInt(item.width),
                      color: PDFLib.rgb(color.r, color.g, color.b),
                    });
                    beforeX = coord.x;
                    beforeY = coord.y;
			          	}
			          });
                break;
            }
          }

          const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
          const pdfBytes = await pdfDoc.save()
          finishLoading();
          download(pdfBytes, "example.pdf", "application/pdf");
        } catch(e) {
          console.log("ENCRYPTED")
          console.log(e)
          finishLoading();
          alert("File Ter-enkripsi, silahkan dekripsi file terlebih dahulu di https://smallpdf.com/unlock-pdf");
          return;
        }
      }

      function detectImageType(base64String) {
        const base64Header = base64String.substring(0, 40);
        if (base64Header.includes("data:image/jpeg;base64")) {
          return "JPG";
        } else if (base64Header.includes("data:image/png;base64")) {
          return "PNG";
        } else {
          return "";
        }
      }

      function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16)/255,
          g: parseInt(result[2], 16)/255,
          b: parseInt(result[3], 16)/255
        } : null;
      }

      function startLoading() {
        const loadingModal = document.getElementById('loadingModal');
        const overlay = document.getElementById('overlay');
        overlay.style.display = 'block'
        loadingModal.style.display = 'flex';
      }

      function finishLoading() {
        const loadingModal = document.getElementById('loadingModal');
        const overlay = document.getElementById('overlay');
        overlay.style.display = 'none';
        loadingModal.style.display = 'none';
      }

      const createPageLinkAnnotation = (page, uri, rect) =>
        page.doc.context.register(
          page.doc.context.obj({
            Type: 'Annot',
            Subtype: 'Link',
            Rect: rect, //[0, 30, 40, 230],
            Border: [0, 0, 2],
            C: [0, 0, 1],
            A: {
              Type: 'Action',
              S: 'URI',
              URI: PDFLib.PDFString.of(uri),
            },
          }),
        );
  </script>
</body>
</html>
