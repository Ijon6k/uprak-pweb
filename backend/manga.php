<?php
require_once __DIR__ . "/config.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER["REQUEST_METHOD"];
$id = isset($_GET["id"]) ? (int)$_GET["id"] : 0;

try {

    // GET — LIST (Home) or DETAIL
    if ($method === "GET") {
        if ($id > 0) {
            // Ambil Detail 1 Manga
            $stm = $pdo->prepare("SELECT * FROM manga WHERE id = ?");
            $stm->execute([$id]);
            $data = $stm->fetch(PDO::FETCH_ASSOC);
            
            if ($data) {
                echo json_encode($data);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Manga not found"]);
            }
            exit;
        }

        $status = $_GET["status"] ?? "";
        $sql = "SELECT * FROM manga WHERE 1=1";
        $params = [];

        if ($q !== "") {
            $sql .= " AND (title LIKE ? OR synopsis LIKE ?)";
            $params[] = "%$q%";
            $params[] = "%$q%";
        }

        if (in_array($status, ["planned", "reading", "completed", "dropped", "plan_to_read"])) {
            $sql .= " AND status = ?";
            $params[] = $status;
        }

        $sql .= " ORDER BY created_at DESC";

        $stm = $pdo->prepare($sql);
        $stm->execute($params);
        echo json_encode($stm->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    // POST
    if ($method === "POST") {
        $inputJSON = file_get_contents('php://input');
        $body = json_decode($inputJSON, true);
        if (!$body) {
            $body = $_POST;
        }

        $mal_id = $body["mal_id"] ?? null;
        $title = trim($body["title"] ?? "");
        $synopsis = trim($body["synopsis"] ?? "");
        $poster = trim($body["poster_path"] ?? "");

        // Validasi Title
        if ($title === "") {
            http_response_code(400);
            echo json_encode(["error" => "Title is required"]);
            exit;
        }

        if ($mal_id) {
            $chk = $pdo->prepare("SELECT id FROM manga WHERE mal_id = ?");
            $chk->execute([$mal_id]);
            if ($chk->fetch()) {
                http_response_code(409);
                echo json_encode(["error" => "Manga already exists in library"]);
                exit;
            }
        }


        $ins = $pdo->prepare(
            "INSERT INTO manga (mal_id, title, synopsis, poster_path, status, rating, created_at)
             VALUES (?, ?, ?, ?, 'plan_to_read', 0, NOW())"
        );
        $ins->execute([$mal_id ?: null, $title, $synopsis, $poster]);

        http_response_code(201);
        echo json_encode(["id" => (int)$pdo->lastInsertId(), "message" => "Added successfully"]);
        exit;
    }

    // UPDATE STATUS OR RATING
    if ($method === "PUT") {
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid ID"]);
            exit;
        }

        $inputJSON = file_get_contents('php://input');
        $body = json_decode($inputJSON, true);

        $updates = [];
        $params = [];
        $validStatuses = ["plan_to_read", "reading", "completed", "dropped", "planned"];
        if (isset($body["status"]) && in_array($body["status"], $validStatuses)) {
            $updates[] = "status = ?";
            $params[] = $body["status"];
        }
        if (isset($body["rating"])) {
            $rating = (float)$body["rating"];
            if ($rating < 0) $rating = 0;
            if ($rating > 10) $rating = 10;
            $updates[] = "rating = ?";
            $params[] = $rating;
        }

        if (empty($updates)) {
            http_response_code(400);
            echo json_encode(["error" => "Nothing to update"]);
            exit;
        }

        $params[] = $id;
        $sql = "UPDATE manga SET " . implode(", ", $updates) . ", updated_at = NOW() WHERE id = ?";
        $pdo->prepare($sql)->execute($params);

        echo json_encode(["message" => "Updated successfully"]);
        exit;
    }

    // DELETE — REMOVE MANGA
    if ($method === "DELETE") {
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid ID"]);
            exit;
        }
        $pdo->prepare("DELETE FROM notes WHERE manga_id = ?")->execute([$id]);
        $pdo->prepare("DELETE FROM manga WHERE id = ?")->execute([$id]);
        echo json_encode(["message" => "Deleted successfully"]);
        exit;
    }

    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error: " . $e->getMessage()]);
}