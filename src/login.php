<?php
require 'db.php';

class LoginJSON
{
    public bool $email_is_empty = false;
    public bool $password_is_empty = false;
    public bool $login_success = false;
    public string $error_message = '';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $email = $_POST['email'];
    $password = $_POST['password'];

    $login_JSON_data = new LoginJSON();

    if (empty($email)) {
        $login_JSON_data->email_is_empty = true;
    }

    if (empty($password)) {
        $login_JSON_data->password_is_empty = true;
    }

    // 如果有空字段直接返回
    if ($login_JSON_data->email_is_empty || $login_JSON_data->password_is_empty) {
        header('Content-Type: application/json');
        echo(json_encode($login_JSON_data));
        exit();
    }

    $stmt = $pdo->prepare("
            SELECT id, username, email, password_hash 
            FROM users 
            WHERE username = :email OR email = :email
        ");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password_hash'])) {
        // 启动会话（建议使用更安全的session配置）
        session_start();
        $_SESSION['username'] = $user['username'];
        $_SESSION['logged_in'] = true;

        $login_JSON_data->login_success = true;
    } else {
        $login_JSON_data->error_message = '用户名/邮箱或密码错误';
    }

    // 返回JSON响应
    header('Content-Type: application/json');
    echo(json_encode($login_JSON_data));
    exit();

} else {
    require 'pages/login.html';
}

