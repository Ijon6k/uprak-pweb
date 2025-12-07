<?php
require_once __DIR__ . "/config.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER["REQUEST_METHOD"];

// GET
if ($method === "GET") {
    $id = isset($_GET["manga_id"]) ? (int)$_GET["manga_id"] : 0;
    
    if ($id <= 0) { 
        http_response_code(400); 
        echo json_encode(["error"=>"manga_id required"]); 
        exit; 
    }

    try {
        $stm = $pdo->prepare("SELECT * FROM notes WHERE manga_id = ? ORDER BY created_at DESC");
        $stm->execute([$id]);
        echo json_encode($stm->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Db Error"]);
    }
    exit;
}

// POST 
if ($method === "POST") {
    $inputJSON = file_get_contents('php://input');
    $body = json_decode($inputJSON, true);

    if (!$body) {
        $body = $_POST;
    }
    $manga_id = isset($body["manga_id"]) ? (int)$body["manga_id"] : 0;
    $text = trim($body["content"] ?? $body["note_text"] ?? "");
    if ($manga_id <= 0 || $text === "") {
        http_response_code(400);
        echo json_encode(["error" => "Data tidak lengkap"]);
        exit;
    }

    try {
        $stm = $pdo->prepare("INSERT INTO notes (manga_id, note_text, created_at) VALUES (?, ?, NOW())");
        $stm->execute([$manga_id, $text]);
        echo json_encode(["id" => (int)$pdo->lastInsertId(), "message" => "Berhasil disimpan"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);