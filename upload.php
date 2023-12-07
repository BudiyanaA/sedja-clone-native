<?php
if (isset($_FILES['pdfFile'])) {
    $file = $_FILES['pdfFile']['name'];
    $file_tmp = $_FILES['pdfFile']['tmp_name'];
    $target_dir = "upload/";
  
    if (!file_exists($target_dir)) {
      mkdir($target_dir, 0777, true);
    } 

    if (move_uploaded_file($file_tmp, $target_dir . $file)) {
      $response = array("success" => true, "url" => $target_dir . $file);
      echo json_encode($response);
    } else {
      $response = array("success" => false);
      echo json_encode($response);
    }
  } 
?>