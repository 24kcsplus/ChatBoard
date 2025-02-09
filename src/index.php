<?php
    require 'db.php';

    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        header('Content-Type: application/json');

        try {
            // 获取所有主留言
            $stmt = $pdo->query("
            SELECT m.*, u.username 
            FROM messages m
            JOIN users u ON m.user_id = u.id
            WHERE parent_id = 0
            ORDER BY created_at DESC
    ");
            $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // 递归获取回复
            function getReplies($parent_id, $pdo) {
                $stmt = $pdo->prepare("
                 SELECT m.*, u.username, ru.username AS reply_to_username
                 FROM messages m
                 JOIN users u ON m.user_id = u.id
                 LEFT JOIN users ru ON m.reply_to_user = ru.id
                 WHERE parent_id = ?
                 ORDER BY created_at ASC
             ");
                $stmt->execute([$parent_id]);
                $replies = $stmt->fetchAll(PDO::FETCH_ASSOC);

                foreach ($replies as &$reply) {
                    $reply['replies'] = getReplies($reply['id'], $pdo);
                }
                return $replies;
            }

            foreach ($messages as &$message) {
                $message['replies'] = getReplies($message['id'], $pdo);
            }

            echo json_encode(['success' => true, 'data' => $messages]);
        } catch(Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    } else{
        require 'pages/index.html';
    }