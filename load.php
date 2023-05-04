<?php
// Koneksi ke database
$host = "127.0.0.1";
$user = "root";
$password = "";
$database = "sedja_clone";

$conn = mysqli_connect($host, $user, $password, $database);

// Mengambil nilai id dari parameter URL
$docId = $_GET['id'];

// Query SQL untuk mengambil dokumen berdasarkan id
$sql = "SELECT * FROM docs WHERE id = '$docId'";
$result = $conn->query($sql);

// Mengirim data dokumen sebagai response
if ($result->num_rows > 0) {
  $data = $result->fetch_assoc();
  echo json_encode($data);
} else {
  echo "Dokumen tidak ditemukan";
}
?>