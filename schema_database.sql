CREATE DATABASE tiktokdb;

USE tiktokdb;


-- Following y Followers es el resultado de un Count() sobre la tabla follower WHERE follower.user_id = user.id
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    nickname varchar(20) NOT NULL,
    email VARCHAR(40) NOT NULL,
    passwrd  VARCHAR(60) NOT NULL,
    profile_image VARCHAR(30),
    date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    num_following INT DEFAULT 0,
    num_followers INT DEFAULT 0,
    num_liked_video INT DEFAULT 0,
    num_fav_video INT DEFAULT 0,
    num_shared_video INT DEFAULT 0
);

--
CREATE TABLE follower (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    follower_id INT NOT NULL,
    date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Add hastag as atribute
CREATE TABLE video (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    title VARCHAR(40) NOT NULL,
    num_comment INT DEFAULT 0,
    num_likes INT DEFAULT 0,
    num_fav INT DEFAULT 0,
    num_share INT DEFAULT 0
);

CREATE TABLE comment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    video_id INT NOT NULL,
    text VARCHAR(100) NOT NULL,
    date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    video_id INT NOT NULL,
    date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE share (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    video_id INT NOT NULL
);

CREATE TABLE fav (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    video_id INT NOT NULL,
    date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Foreing Keys

ALTER TABLE follower ADD CONSTRAINT fk_follower_user FOREIGN KEY (user_id) REFERENCES user(id);
ALTER TABLE follower ADD CONSTRAINT fk_follower_follower FOREIGN KEY (follower_id) REFERENCES user(id);

ALTER TABLE video ADD CONSTRAINT fk_video_userid FOREIGN KEY (user_id) REFERENCES user(id);

ALTER TABLE comment ADD CONSTRAINT fk_comment_userid FOREIGN KEY (user_id) REFERENCES user(id);
ALTER TABLE comment ADD CONSTRAINT fk_comment_videoid FOREIGN KEY (video_id) REFERENCES video(id);

ALTER TABLE likes ADD CONSTRAINT fk_likes_userid FOREIGN KEY (user_id) REFERENCES user(id);
ALTER TABLE likes ADD CONSTRAINT fk_likes_videoid FOREIGN KEY (video_id) REFERENCES video(id);

ALTER TABLE share ADD CONSTRAINT fk_share_userid FOREIGN KEY (user_id) REFERENCES user(id);
ALTER TABLE share ADD CONSTRAINT fk_share_videoid FOREIGN KEY (video_id) REFERENCES video(id);

ALTER TABLE fav ADD CONSTRAINT fk_fav_userid FOREIGN KEY (user_id) REFERENCES user(id);
ALTER TABLE fav ADD CONSTRAINT fk_fav_videoid FOREIGN KEY (video_id) REFERENCES video(id);
