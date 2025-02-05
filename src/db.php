<?php
// 连接数据库
$config = include('config.php');
global $pdo;
try {
    $dsn = "mysql:host=" . $config['db_host'] . ";dbname=" . $config['db_name'];
    $pdo = new PDO($dsn, $config['db_user'], $config['db_passwd']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}