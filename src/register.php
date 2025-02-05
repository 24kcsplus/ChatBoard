<?php
require 'db.php';

// 储存注册条件
class registerJSON
{
    public bool $username_is_empty = false;
    public bool $username_exists = false;
    public bool $email_is_empty = false;
    public bool $email_exists = false;
    public bool $password_is_empty = false;
    public bool $password_is_not_complex = false;
    public bool $password_is_not_confirmed = false;

}

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    header('Content-Type:application/json; charset=utf-8');
    $username = $_POST['username'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    $email = $_POST['email'];

    $register_JSON_data = new registerJSON();

    // 后端检查是否为空
    if(empty($username)){
        $register_JSON_data->username_is_empty = true;
    }

    if (empty($password)){
        $register_JSON_data->password_is_empty = true;
    }

    if (empty($email)){
        $register_JSON_data->email_is_empty = true;
    }

    // 后端检查两次密码是否一致
    if($password !== $confirm_password){
        $register_JSON_data->password_is_not_confirmed = true;
    }

    // 后端检查密码复杂度
    function isPasswordValid($password): bool
    {
        $regex = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,22}$/';
        return preg_match($regex, $password) === 1;
    }

    if(!isPasswordValid($password)){
        $register_JSON_data->password_is_not_complex = true;
    }

    // 检查用户名和邮箱是否存在
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username");
    $stmt->execute(['username' => $username]);

    if($stmt->rowCount() > 0){
        $register_JSON_data->username_exists = true;
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);

    if($stmt->rowCount() > 0){
        $register_JSON_data->email_exists = true;
    }

    echo(json_encode($register_JSON_data));

    $allow_registration = true;
    foreach($register_JSON_data as $key => $value){
        if($value === true){
            $allow_registration = false;
        }
    }

    if($allow_registration){
        $stmt = $pdo->prepare('INSERT INTO `users` (`username`, `email`, `password_hash`, `created_at`) VALUES (:username,:email,:password_hash,current_timestamp())');
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt->execute([
            'username'      => $username,
            'email'         => $email,
            'password_hash' => $password_hash
        ]);
    }
}else{
    require 'pages/register.html';
}