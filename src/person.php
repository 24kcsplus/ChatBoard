<?php
require "db.php";
session_start();

class PersonJSON {
    public string $username;
    public bool $isSelf;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    header('Content-Type: application/json');
    // 检查用户是否登录
    if (!isset($_SESSION["username"])) {
        http_response_code(401);
        echo json_encode(["error" => "未认证的用户"]);
        exit;
    }

    // 检查是否存在username参数
    if (!isset($_POST["username"])) {
        http_response_code(400);
        echo json_encode(["error" => "缺少用户名参数"]);
        exit;
    }

    $person = new PersonJSON();
    $person->username = $_POST["username"];
    $person->isSelf = $_SESSION["username"] === $person->username;

    echo json_encode($person);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    require "pages/person.html";
}
