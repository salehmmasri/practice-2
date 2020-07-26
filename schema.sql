DROP TABLE IF EXISTS info;
CREATE TABLE info(
    id serial PRIMARY KEY,
    teamname VARCHAR(255),
    img_url VARCHAR(255),
    found VARCHAR(255)
);