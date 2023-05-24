<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file'])) {
        $file = $_FILES['file'];

        // Mendapatkan informasi file
        $fileName = $file['name'];
        $fileTmpName = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileError = $file['error'];
        $fileType = $file['type'];

        // Memeriksa apakah file yang diunggah berhasil
        if ($fileError === UPLOAD_ERR_OK) {
            // Memeriksa jenis file
            $allowedTypes = array('upload', 'upload');
            if (in_array($fileType, $allowedTypes)) {
                // Tentukan lokasi penyimpanan file
                $uploadDirectory = 'upload/';
                $destination = $uploadDirectory . $fileName;

                // Pindahkan file ke lokasi penyimpanan
                if (move_uploaded_file($fileTmpName, $destination)) {
                    // Berhasil mengunggah file, Anda dapat melakukan operasi tambahan di sini

                    // Mengirimkan respons ke JavaScript
                    $response = array('status' => 'success', 'message' => 'File uploaded successfully');
                    echo json_encode($response);
                    exit;
                } else {
                    $response = array('status' => 'error', 'message' => 'Failed to move uploaded file');
                    echo json_encode($response);
                    exit;
                }
            } else {
                $response = array('status' => 'error', 'message' => 'Invalid file type');
                echo json_encode($response);
                exit;
            }
        } else {
            $response = array('status' => 'error', 'message' => 'File upload error');
            echo json_encode($response);
            exit;
        }
    } else {
        $response = array('status' => 'error', 'message' => 'No file was uploaded');
        echo json_encode($response);
        exit;
    }
}
?>