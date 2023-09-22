<?php require 'helper.php'; ?>

<!DOCTYPE html>
<html>
<head>
	<title>Upload dan Tampil PDF di Canvas</title>
  <link rel="stylesheet" href="<?php echo getBaseUrl() . '/public/assets/css/style.css' ?>" />
  <link rel="stylesheet" href="<?php echo getBaseUrl() . '/public/assets/css/font-awesome.min.css' ?>" />
</head>
<body>
  <div style="margin: auto;">
    <input type="file" id="pdf-file" accept="application/pdf">
    <button class="save" onclick="saveFile()">Save</button>
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

  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <script src="https://unpkg.com/pdf-lib"></script>

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
        // var element = document.getElementById('canvas-wrapper');
        // var opt = {
        //     margin: 10,
        //     filename: 'canvas_export.pdf',
        //     image: { type: 'jpeg', quality: 1 },
        //     html2canvas: { scale: 2 },
        //     jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        // };
        // html2pdf().set(opt).from(element).save();

        // v2
        // editingItem = null;
        // drawItems();

        // window.jsPDF = window.jspdf.jsPDF;
        // var doc = new jsPDF();

        // var canvases = document.querySelectorAll('.item-canvas');
	      // canvases.forEach(function(canvas, i) {          
        //   var canvas1 = document.getElementById(`pdf-canvas-${i+1}`);
        //   var canvas2 = document.getElementById(`item-canvas-${i+1}`);
        //   var imageData1 = canvas1.toDataURL('image/png');
        //   var imageData2 = canvas2.toDataURL('image/png');
        //   doc.addImage(imageData1, 'PNG', 10, 10, 208, canvas1.height * 208 / canvas1.width, '', 'FAST');
        //   doc.addImage(imageData2, 'PNG', 10, 10, 208, canvas2.height * 208 / canvas2.width, '', 'FAST');
        //   doc.addPage();
	      // });
        // setTimeout(function() {
        //   doc.save('canvas.pdf');
        // }, 1000); 

        // v3
        const pdf = await pdfFile.files[0].arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(pdf);
        const pages = pdfDoc.getPages();
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const id = item.canvas_id.split("-")[2];
          const { width, height } = pages[id-1].getSize()
          
          switch (item.type) {
            case "text":
              const fontSize = parseInt(item.fontSize);
              const color = hexToRgb(item.color);
              // pages[id-1].moveTo(item.x, height - item.y);
              pages[id-1].drawText(item.text, {
                x: item.x,
                y: height - item.y,
                size: fontSize,
                // font: item.fontStyle,
                color: PDFLib.rgb(color.r, color.g, color.b),
              });
              break;
          }
        }

        // const page = pdfDoc.addPage([350, 400]);
        // page.moveTo(110, 200);
        // page.drawText('Hello World!');
        const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });

        window.location.href = pdfDataUri
        const downloadLink = document.createElement('a');
        downloadLink.href = pdfDataUri;
        downloadLink.download = 'example.pdf'; // Nama file saat diunduh
        downloadLink.textContent = 'Unduh PDF'; // Teks tautan
        document.body.appendChild(downloadLink);
        downloadLink.click();
      }

      function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16)/255,
          g: parseInt(result[2], 16)/255,
          b: parseInt(result[3], 16)/255
        } : null;
      }
  </script>
</body>
</html>
