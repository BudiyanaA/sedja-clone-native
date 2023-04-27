<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "sedja_clone";

$conn = mysqli_connect($host, $user, $password, $database);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $data = json_decode(file_get_contents("php://input"));

  $file = $data->file;
  $items = $data->items;
  $url = $data->url;

  $query = "INSERT INTO docs (file, items, url) VALUES ('$file', '$items', '$url')";
  $result = mysqli_query($conn, $query);

  if ($result) {
    $id = mysqli_insert_id($conn);
    $response = array("success" => true, "id" => $id);
    echo json_encode($response);
  } else {
    $response = array("success" => false);
    echo json_encode($response);
  }
}

mysqli_close($conn);
?>