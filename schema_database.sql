CREATE DATABASE tiktokdb;

USE tiktokdb;

/*
    Pensar longitud de liked, fav u shared_video en función de la dirección del video en al sistema de ficheros

*/

-- Following y Followers es el resultado de un Count() sobre la tabla follower WHERE follower.user_id = user.id
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    email VARCHAR(40) NOT NULL,
    passwrd  VARCHAR(50) NOT NULL,
    profile_image VARCHAR(30),
    date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    num_following INT,
    num_followers INT,
    num_liked_video VARCHAR(50),
    num_fav_video VARCHAR(50),
    num_shared_video VARCHAR(50)
);

CREATE TABLE follower (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    follower_id INT NOT NULL,
    date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
);

-- Add hastag as atribute
CREATE TABLE video (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    title VARCHAR(40) NOT NULL,
    num_comment INT,
    num_likes INT,
    num_fav INT,
    num_share INT
);

CREATE TABLE comment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    video_id INT NOT NULL,
    text VARCHAR(100) NOT NULL,
    date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE like (
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

ALTER TABLE user ADD CONSTRAINT fk_following FOREIGN KEY (following_id) REFERENCES user(id);
ALTER TABLE user ADD CONSTRAINT fk_liked_video FOREIGN KEY (liked_video) REFERENCES like(id);
ALTER TABLE user ADD CONSTRAINT fk_fav_video FOREIGN KEY (fav_video) REFERENCES fav(id);
ALTER TABLE user ADD CONSTRAINT fk_shared_video FOREIGN KEY (shared_video) REFERENCES share(id);

ALTER TABLE follower ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES user(id);
ALTER TABLE follower ADD CONSTRAINT fk_follower FOREIGN KEY (follower_id) REFERENCES user(id);

ALTER TABLE user ADD CONSTRAINT fk_shared_video FOREIGN KEY (shared_video) REFERENCES share(id);

ALTER TABLE orders
ADD CONSTRAINT fk_customer
FOREIGN KEY (customer_id)
REFERENCES customers(id);


following_id INT,
    followers INT,
    liked_video VARCHAR(50),
    fav_video VARCHAR(50),
    shared_video VARCHAR(50)