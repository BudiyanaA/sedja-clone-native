<?php
$host = "127.0.0.1";
$user = "root";
$password = "";
$database = "sedja_clone";

$conn = mysqli_connect($host, $user, $password, $database);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $data = json_decode(file_get_contents("php://input"));

  $id = $data->id;
  $file = $data->file;
  $items = $data->items;
  $url = $data->url;

  $query = "INSERT INTO docs (id,file, items, url) VALUES ('$id','$file', '$items', '$url')";
  $result = mysqli_query($conn, $query);

  if ($result) {
    $id = mysqli_insert_id($conn);
    $response = array("success" => true, "id" => $id);
    echo json_encode($response);
  } else {
    echo var_dump($conn);
    $response = array("success" => false, "test" => "lol");
    echo json_encode($response);
  }
} else if ($_SERVER["REQUEST_METHOD"] == "PUT") {
    $data = json_decode(file_get_contents("php://input"));
  
    $id = $data->id;
    $items = $data->items;
  
    $query = "UPDATE docs SET  items = '$items' WHERE id = '$id'";
    $result = mysqli_query($conn, $query);

    if ($result) {
      $id = mysqli_insert_id($conn);
      $response = array("success" => true, "id" => $id);
      echo json_encode($response);
    } else {
      echo var_dump($conn);
      $response = array("success" => false, "test" => "lol");
      echo json_encode($response);
    }
  }

mysqli_close($conn);
?>

