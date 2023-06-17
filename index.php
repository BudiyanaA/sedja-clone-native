<!DOCTYPE html>
<html>
<head>
	<title>Upload dan Tampil PDF di Canvas</title>
  <link rel="stylesheet" href="../public/assets/css/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>
  <div style="margin: auto;">
    <input type="file" id="pdf-file" accept="application/pdf">
    <button class="save" onclick="saveFile()">Save</button>
    <input type="text" id="id-docs">
    <button class="load" onclick="loadFile()">Load</button>
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

  <!-- <div class="parent-container">
    <div class="canvas-wrapper">
      <canvas class="pdf-canvas" id="pdf-canvas"></canvas>
      <canvas class="item-canvas" id="item-canvas"></canvas>
    </div>
  </div>  -->

  <!-- <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-firestore.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-storage.js"></script>
  <script>
    var firebaseConfig = {
      apiKey: "AIzaSyCoEFxvwxh28wkykfPcc9DGo2epn8WkP_Y",
      authDomain: "sedja-clone.firebaseapp.com",
      projectId: "sedja-clone",
      storageBucket: "sedja-clone.appspot.com",
    };
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
  </script> -->


  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"></script>
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
            }).promise.then(function(pdf) {
              const numPages = pdf.numPages;
              for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                pdf.getPage(pageNum).then(function(page) {
                  const pdfCanvas = document.createElement('canvas');
					        const itemCanvas = document.createElement('canvas');
					        const pdfCanvasId = 'pdf-canvas-' + pageNum;
					        const itemCanvasId = 'item-canvas-' + pageNum;
					        pdfCanvas.classList.add("pdf-canvas");
					        itemCanvas.classList.add("item-canvas");
					        pdfCanvas.id = pdfCanvasId;
					        itemCanvas.id = itemCanvasId;

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

                  items = JSON.parse(doc.items);
                  console.log(items);
                  drawItems();
                });
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
      // WMC3IHU9MQ6E6A3VDV1J
  </script>
</body>
</html>
