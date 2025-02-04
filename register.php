<?php
require 'db.php';

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $username = $_POST['username'];
    $nickname = $_POST['nickname'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    $email = $_POST['email'];

    // 后端检查是否为空
    if(empty($username) || empty($password) || empty($email)){
        die("有未填写的表单！");
    }

    // 后端检查两次密码是否一致
    if($password !== $confirm_password){
        die("两次密码不一致！");
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username OR email = :email");
    $stmt->execute(['username' => $username, 'email' => $email]);

    if($stmt->rowCount() > 0){
        die("用户或邮箱已存在！");
    }


}

if($_SERVER['REQUEST_METHOD'] === 'GET'){

}