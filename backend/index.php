<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header(
    "Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With",
);
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}
require_once __DIR__ . "/config.php";
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$method = $_SERVER["REQUEST_METHOD"];
$uri = rtrim($uri, "/");

// ---------- ROUTES ----------

// /manga
if ($uri === "/manga" && $method === "GET") {
    require __DIR__ . "/manga.php";
    exit();
}
if ($uri === "/manga" && $method === "POST") {
    require __DIR__ . "/manga.php";
    exit();
}
// /manga/{id}
if (preg_match('#^/manga/([0-9]+)$#', $uri, $match)) {
    $_GET["id"] = (int) $match[1];
    require __DIR__ . "/manga.php";
    exit();
}
// /notes
if ($uri === "/notes" && $method === "POST") {
    require __DIR__ . "/notes.php";
    exit();
}
// /notes/{manga_id}
if (preg_match('#^/notes/([0-9]+)$#', $uri, $match)) {
    $_GET["manga_id"] = (int) $match[1];
    require __DIR__ . "/notes.php";
    exit();
}
http_response_code(404);
echo json_encode([
    "error" => "Route not found",
    "method" => $method,
    "uri" => $uri,
]);
exit();
