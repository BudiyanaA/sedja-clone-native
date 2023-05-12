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
        pdf.getPage(pageNum).then(function(page) {
          const viewport = page.getViewport({scale: 1});
          var canvas = document.createElement('canvas');
          var context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          // Menambahkan canvas ke dalam elemen container
          // Misalnya, jika Anda memiliki elemen dengan id "pdfContainer"
          document.getElementById('pdfContainer').appendChild(canvas);

          page.render({
            canvasContext: context,
            viewport: viewport
          });
        });
      }
    });
  };

  fileReader.readAsArrayBuffer(file);
});
