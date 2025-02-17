CREATE TABLE `users` (
                         `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
                         `username` varchar(50) NOT NULL,
                         `email` varchar(100) NOT NULL,
                         `password_hash` varchar(255) NOT NULL,
                         `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `username` (`username`),
                         UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 留言表
CREATE TABLE messages (
                          id INT PRIMARY KEY AUTO_INCREMENT,
                          user_id INT UNSIGNED NOT NULL,
                          content TEXT NOT NULL,
                          parent_id INT DEFAULT 0 COMMENT '0表示主留言',
                          reply_to_user INT UNSIGNED DEFAULT NULL,
                          likes INT DEFAULT 0,
                          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (user_id) REFERENCES users(id),
                          FOREIGN KEY (reply_to_user) REFERENCES users(id)
);

-- 点赞记录表
CREATE TABLE message_likes (
                               user_id INT UNSIGNED NOT NULL,
                               message_id INT NOT NULL,
                               PRIMARY KEY (user_id, message_id),
                               FOREIGN KEY (user_id) REFERENCES users(id),
                               FOREIGN KEY (message_id) REFERENCES messages(id)
);