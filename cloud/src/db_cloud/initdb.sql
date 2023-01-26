CREATE DATABASE IF NOT EXISTS airlux_cloud_db;

USE airlux_cloud_db;

CREATE TABLE building (
  building_id BIGINT NOT NULL AUTO_INCREMENT,
  name  VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (building_id)
);

CREATE TABLE user (
  user_id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name            VARCHAR(255) DEFAULT NULL,
  forename        VARCHAR(255) DEFAULT NULL,
  email           VARCHAR(255) DEFAULT NULL,
  password        VARCHAR(255) DEFAULT NULL,
  is_admin        BOOLEAN,
  building_id     BIGINT NOT NULL,
  PRIMARY KEY (user_id)
);

CREATE TABLE floor (
  floor_id        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  number          BIGINT UNSIGNED NOT NULL,
  building_id     BIGINT NOT NULL,
  PRIMARY KEY (floor_id)
);


CREATE TABLE room (
  room_id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name            VARCHAR(255) DEFAULT NULL,
  floor_id        BIGINT NOT NULL,
  building_id     BIGINT NOT NULL,
  PRIMARY KEY (room_id)
);


CREATE TABLE device (
  device_id       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name            VARCHAR(255) DEFAULT NULL,
  floor_id        BIGINT NOT NULL,
  building_id     BIGINT NOT NULL,
  room_id         BIGINT NOT NULL,
  PRIMARY KEY (device_id)
);

CREATE TABLE scenario (
  scenario_id     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name            VARCHAR(255) DEFAULT NULL,
  scenario_state  BOOLEAN NOT NULL DEFAULT 0,
  PRIMARY KEY (scenario_id)
);

CREATE TABLE scenario_device (
  id              BIGINT UNSIGNED NOT NULL,
  scenario_id     BIGINT UNSIGNED NOT NULL,
  device_id       BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (id)
);


CREATE TABLE timeseries (
  device_id       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  unit            VARCHAR(255) DEFAULT NULL,
  timestamp       BIGINT NOT NULL,
  value           BIGINT NOT NULL,
  PRIMARY KEY (device_id)
);

INSERT INTO building(name) VALUES ("batiment num1");
INSERT INTO building(name) VALUES ("batiment num2");
INSERT INTO building(name) VALUES ("batiment num3");
INSERT INTO building(name) VALUES ("batiment num4");
INSERT INTO building(name) VALUES ("batiment num5");
INSERT INTO building(name) VALUES ("batiment num6");
INSERT INTO building(name) VALUES ("batiment num7");
INSERT INTO building(name) VALUES ("batiment num8");
INSERT INTO building(name) VALUES ("batiment num9");
INSERT INTO building(name) VALUES ("batiment num10");
INSERT INTO building(name) VALUES ("batiment num11");
INSERT INTO building(name) VALUES ("batiment num12");

INSERT INTO floor(number, building_id) VALUES (0, 1);
INSERT INTO floor(number, building_id) VALUES (1, 1);
INSERT INTO floor(number, building_id) VALUES (2, 1);
INSERT INTO floor(number, building_id) VALUES (3, 1);

INSERT INTO room(name, floor_id, building_id) VALUES ("Salon", 1, 1);
INSERT INTO room(name, floor_id, building_id) VALUES ("Salle a manger", 1, 1);
INSERT INTO room(name, floor_id, building_id) VALUES ("Salon de repos", 2, 1);
INSERT INTO room(name, floor_id, building_id) VALUES ("Salle de bain", 1, 2);

INSERT INTO device(name, floor_id, building_id, room_id) VALUES ("Capteur temperature", 1, 1, 1);
INSERT INTO device(name, floor_id, building_id, room_id) VALUES ("Interupteur", 1, 1, 1);
INSERT INTO device(name, floor_id, building_id, room_id) VALUES ("Interupteur lumiere", 2, 1, 1);
INSERT INTO device(name, floor_id, building_id, room_id) VALUES ("Capteur lumiere", 2, 1, 1);
INSERT INTO device(name, floor_id, building_id, room_id) VALUES ("Capteur temperature", 2, 1, 2);

DELIMITER //
CREATE PROCEDURE create_building_and_return(IN name VARCHAR(255))
BEGIN
  INSERT INTO building(name) VALUES (name);
END //
DELIMITER //
CREATE PROCEDURE create_user_and_return(IN name VARCHAR(255),IN forename VARCHAR(255),IN email VARCHAR(255),IN password VARCHAR(255),IN is_admin VARCHAR(255),IN building_id VARCHAR(255))
BEGIN
  INSERT INTO user(name, forename, email, password, is_admin, building_id) VALUES (name, forename, email, password, is_admin, building_id);
END //
DELIMITER //
CREATE PROCEDURE create_floor_and_return(IN number VARCHAR(255),IN building_id VARCHAR(255))
BEGIN
  INSERT INTO floor(number, building_id) VALUES (number, building_id);
END //
DELIMITER //
CREATE PROCEDURE create_room_and_return(IN name VARCHAR(255), IN floor_id VARCHAR(255), IN building_id VARCHAR(255))
BEGIN
  INSERT INTO room(name, floor_id, building_id) VALUES (name, floor_id, building_id);
END //
DELIMITER //
CREATE PROCEDURE create_device_and_return(IN name VARCHAR(255), IN floor_id VARCHAR(255), IN building_id VARCHAR(255), IN room_id VARCHAR(255))
BEGIN
  INSERT INTO device(name, floor_id, building_id, room_id) VALUES (name, floor_id, building_id, room_id);
END //
DELIMITER //
CREATE PROCEDURE create_timeseries_and_return(IN unit VARCHAR(255), IN timestamp VARCHAR(255), IN value VARCHAR(255))
BEGIN
  INSERT INTO timeseries(unit, timestamp, value) VALUES (unit, timestamp, value);
END //
DELIMITER ;