-- 用户表
create table message_board.users
(
    id            int(11) unsigned auto_increment primary key,
    username      varchar(50)                           not null,
    email         varchar(100)                          not null,
    password_hash varchar(255)                          not null,
    created_at    timestamp default current_timestamp() not null,
    constraint email unique (email),
    constraint username unique (username)
);

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