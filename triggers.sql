CREATE TRIGGER increment_followers
AFTER INSERT ON follower
FOR EACH ROW
BEGIN
    UPDATE user
    SET num_followers = num_followers + 1
    WHERE id = NEW.user_id;
END;

-- Trigger para decrementar num_followers
CREATE TRIGGER decrement_followers
AFTER DELETE ON follower
FOR EACH ROW
BEGIN
    UPDATE user
    SET num_followers = num_followers - 1
    WHERE id = OLD.user_id;
END;

CREATE TRIGGER increment_following
AFTER INSERT ON follower
FOR EACH ROW
BEGIN
    UPDATE user
    SET num_following = num_following + 1
    WHERE id = NEW.user_id;
END;

-- Trigger para decrementar num_following
CREATE TRIGGER decrement_following
AFTER DELETE ON follower
FOR EACH ROW
BEGIN
    UPDATE user
    SET num_following = num_following - 1
    WHERE id = OLD.user_id;
END;

--------------------------------------------------------

-- Trigger para incrementar num_comment
CREATE TRIGGER increment_num_comment
AFTER INSERT ON comment
FOR EACH ROW
BEGIN
    UPDATE video
    SET num_comment = num_comment + 1
    WHERE id = NEW.video_id;
END;

-- Trigger para decrementar num_comment
CREATE TRIGGER decrement_num_comment
AFTER DELETE ON comment
FOR EACH ROW
BEGIN
    UPDATE video
    SET num_comment = num_comment - 1
    WHERE id = OLD.video_id;
END;

-- Trigger para incrementar num_likes
CREATE TRIGGER increment_num_likes
AFTER INSERT ON like
FOR EACH ROW
BEGIN
    UPDATE video
    SET num_likes = num_likes + 1
    WHERE id = NEW.video_id;
END;

-- Trigger para decrementar num_likes
CREATE TRIGGER decrement_num_likes
AFTER DELETE ON like
FOR EACH ROW
BEGIN
    UPDATE video
    SET num_likes = num_likes - 1
    WHERE id = OLD.video_id;
END;

-- Trigger para incrementar num_fav
CREATE TRIGGER increment_num_fav
AFTER INSERT ON fav
FOR EACH ROW
BEGIN
    UPDATE video
    SET num_fav = num_fav + 1
    WHERE id = NEW.video_id;
END;

-- Trigger para decrementar num_fav
CREATE TRIGGER decrement_num_fav
AFTER DELETE ON fav
FOR EACH ROW
BEGIN
    UPDATE video
    SET num_fav = num_fav - 1
    WHERE id = OLD.video_id;
END;

-- Trigger para incrementar num_share
CREATE TRIGGER increment_num_share
AFTER INSERT ON share
FOR EACH ROW
BEGIN
    UPDATE video
    SET num_share = num_share + 1
    WHERE id = NEW.video_id;
END;

-- Trigger para decrementar num_share
CREATE TRIGGER decrement_num_share
AFTER DELETE ON share
FOR EACH ROW
BEGIN
    UPDATE video
    SET num_share = num_share - 1
    WHERE id = OLD.video_id;
END;