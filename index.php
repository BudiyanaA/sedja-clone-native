<!DOCTYPE html>
<html>
<head>
	<title>Upload dan Tampil PDF di Canvas</title>
  <link rel="stylesheet" href="../public/assets/css/style.css">
  <link rel="stylesheet" href="../public/assets/css/font-awesome.min.css"/>
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

  <script src="../public/assets/js/pdf.min.js"></script>
  <script src="../public/assets/js/jspdf.umd.min.js"></script>
  <script src="../public/assets/js/html2canvas.min.js"></script>
  <script src="../public/assets/js/menu.js"></script>
  <script src="../public/assets/js/text.js"></script>
  <script src="../public/assets/js/links.js"></script>
  <script src="../public/assets/js/form.js"></script>
  <script src="../public/assets/js/image.js"></script>
  <script src="../public/assets/js/witheout.js"></script>
  <script src="../public/assets/js/shape.js"></script>
  <script src="../public/assets/js/sign-click.js"></script>
  <script src="../public/assets/js/sign.js"></script>
  <script src="../public/assets/js/anotate.js"></script>
  <script src="../public/assets/js/main.js"></script>

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

                  items = JSON.parse(doc.items);
                  console.log(items);
                  drawItems();
              }
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
      
      function downloadPDF() {
        window.jsPDF = window.jspdf.jsPDF;
        var doc = new jsPDF();

        var canvases = document.querySelectorAll('.item-canvas');
	      canvases.forEach(function(canvas, i) {          
          var canvas1 = document.getElementById(`pdf-canvas-${i+1}`);
          var canvas2 = document.getElementById(`item-canvas-${i+1}`);
          var imageData1 = canvas1.toDataURL('image/png');
          var imageData2 = canvas2.toDataURL('image/png');
          doc.addImage(imageData1, 'PNG', 10, 10, 208, canvas1.height * 208 / canvas1.width);
          doc.addImage(imageData2, 'PNG', 10, 10, 208, canvas2.height * 208 / canvas2.width);
          doc.addPage();
	      });
        setTimeout(function() {
          doc.save('canvas.pdf');
        }, 1000); 
      }
  </script>
</body>
</html>
