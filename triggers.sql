DROP TRIGGER IF EXISTS increment_followers;
DROP TRIGGER IF EXISTS decrement_followers;
DROP TRIGGER IF EXISTS increment_following;
DROP TRIGGER IF EXISTS decrement_following;
DROP TRIGGER IF EXISTS increment_num_comment;
DROP TRIGGER IF EXISTS decrement_num_comment;
DROP TRIGGER IF EXISTS increment_num_likes;
DROP TRIGGER IF EXISTS decrement_num_likes;
DROP TRIGGER IF EXISTS increment_num_fav;
DROP TRIGGER IF EXISTS decrement_num_fav;
DROP TRIGGER IF EXISTS increment_num_share;
DROP TRIGGER IF EXISTS decrement_num_share;
DROP TRIGGER IF EXISTS lowercase_nickname_before_insert;



DELIMITER //

-- Trigger para incrementar num_followers
CREATE TRIGGER increment_followers
AFTER INSERT ON follower
FOR EACH ROW
BEGIN
    UPDATE user
    SET num_followers = num_followers + 1
    WHERE id = NEW.user_id;
END;
//

-- Trigger para decrementar num_followers (evitando valores negativos)
CREATE TRIGGER decrement_followers
AFTER DELETE ON follower
FOR EACH ROW
BEGIN
    UPDATE user
    SET num_followers = IF(num_followers > 0, num_followers - 1, 0)
    WHERE id = OLD.user_id;
END;
//

-- Trigger para incrementar num_following
CREATE TRIGGER increment_following
AFTER INSERT ON follower
FOR EACH ROW
BEGIN
    UPDATE user
    SET num_following = num_following + 1
    WHERE id = NEW.user_id;
END;
//

-- Trigger para decrementar num_following (evitando valores negativos)
CREATE TRIGGER decrement_following
AFTER DELETE ON follower
FOR EACH ROW
BEGIN
    UPDATE user
    SET num_following = IF(num_following > 0, num_following - 1, 0)
    WHERE id = OLD.user_id;
END;
//

-- Trigger para incrementar num_comment
CREATE TRIGGER increment_num_comment
AFTER INSERT ON comment
FOR EACH ROW
BEGIN
    UPDATE video
    SET num_comment = num_comment + 1
    WHERE id = NEW.video_id;
END;
//

-- Trigger para decrementar num_comment (evitando valores negativos)
CREATE TRIGGER decrement_num_comment
AFTER DELETE ON comment
FOR EACH ROW
BEGIN
    UPDATE video
    SET num_comment = IF(num_comment > 0, num_comment - 1, 0)
    WHERE id = OLD.video_id;
END;
//

-- Trigger para incrementar num_likes
CREATE TRIGGER increment_num_likes
AFTER INSERT ON likes
FOR EACH ROW
BEGIN
    UPDATE video
    SET num_likes = num_likes + 1
    WHERE id = NEW.video_id;
END;
//

-- Trigger para decrementar num_likes (evitando valores negativos)
CREATE TRIGGER decrement_num_likes
AFTER DELETE ON likes
FOR EACH ROW
BEGIN
    UPDATE video
    SET num_likes = IF(num_likes > 0, num_likes - 1, 0)
    WHERE id = OLD.video_id;
END;
//

-- Trigger para incrementar num_fav
CREATE TRIGGER increment_num_fav
AFTER INSERT ON fav
FOR EACH ROW
BEGIN
    UPDATE video
    SET num_fav = num_fav + 1
    WHERE id = NEW.video_id;
END;
//

-- Trigger para decrementar num_fav (evitando valores negativos)
CREATE TRIGGER decrement_num_fav
AFTER DELETE ON fav
FOR EACH ROW
BEGIN
    UPDATE video
    SET num_fav = IF(num_fav > 0, num_fav - 1, 0)
    WHERE id = OLD.video_id;
END;
//

-- Trigger para incrementar num_share
CREATE TRIGGER increment_num_share
AFTER INSERT ON share
FOR EACH ROW
BEGIN
    UPDATE video
    SET num_share = num_share + 1
    WHERE id = NEW.video_id;
END;
//

-- Trigger para decrementar num_share (evitando valores negativos)
CREATE TRIGGER decrement_num_share
AFTER DELETE ON share
FOR EACH ROW
BEGIN
    UPDATE video
    SET num_share = IF(num_share > 0, num_share - 1, 0)
    WHERE id = OLD.video_id;
END;
//

-- Trigger para convertir nickname a minúsculas antes de insertar
CREATE TRIGGER lowercase_nickname_before_insert
BEFORE INSERT ON user
FOR EACH ROW
BEGIN
    SET NEW.nickname = LOWER(NEW.nickname);
END;
//

DELIMITER ;