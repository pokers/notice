DROP DATABASE IF EXISTS notice;

CREATE DATABASE notice;
USE notice;
CREATE TABLE IF NOT EXISTS article(
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title       VARCHAR(255) CHARACTER SET UTF8MB4 NOT NULL,
    content     TEXT CHARACTER SET UTF8MB4 NULL,
    username    VARCHAR(255) CHARACTER SET UTF8MB4 NOT NULL,
    passwd      VARCHAR(255) NOT NULL,
    createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    INDEX username(username),
    INDEX title(title),
    INDEX createdAt(createdAt)
);

CREATE TABLE IF NOT EXISTS comment(
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    articleId   INT UNSIGNED NOT NULL,
    parentId    INT UNSIGNED NULL,
    content     TEXT CHARACTER SET UTF8MB4 NULL,
    username    VARCHAR(255) CHARACTER SET UTF8MB4 NOT NULL,
    createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    CONSTRAINT fk_article_comment FOREIGN KEY(articleId) REFERENCES article(id),
    CONSTRAINT fk_article_article FOREIGN KEY(parentId) REFERENCES comment(id),
    INDEX createdAt(createdAt)
);

CREATE TABLE IF NOT EXISTS keyword(
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username    VARCHAR(255) CHARACTER SET UTF8MB4 NOT NULL,
    keyword     VARCHAR(255) CHARACTER SET UTF8MB4 NOT NULL,
    PRIMARY KEY(id),
    INDEX username(username),
    INDEX keyword(keyword)
);

INSERT INTO article VALUES
(NULL, 'test1', 'test1 content', 'pokers1', 'tjwndtn', '2022-06-04 18:00:00', '2022-06-04 18:00:00'),
(NULL, 'test2', 'test2 content', 'pokers1', 'tjwndtn', '2022-06-04 18:40:00', '2022-06-04 18:40:00'),
(NULL, 'test3', 'test3 content', 'pokers2', 'tjwndtn', '2022-06-04 19:25:00', '2022-06-04 19:25:00'),
(NULL, 'test4', 'test4 content', 'pokers2', 'tjwndtn', '2022-06-04 21:00:00', '2022-06-04 21:00:00'),
(NULL, 'test5', 'test5 content', 'pokers1', 'tjwndtn', '2022-06-04 22:11:00', '2022-06-04 22:11:00'),
(NULL, 'test6', 'test6 content', 'pokers2', 'tjwndtn', '2022-06-04 23:29:00', '2022-06-04 23:29:00');

INSERT INTO keyword VALUES
(NULL, 'pokers1', 'pokers'),
(NULL, 'pokers2', 'pokers2');


