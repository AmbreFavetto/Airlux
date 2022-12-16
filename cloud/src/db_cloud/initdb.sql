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
  name            VARCHAR(255) DEFAULT NULL,
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


CREATE TABLE timeseries (
  device_id       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  unit            VARCHAR(255) DEFAULT NULL,
  timestamp       BIGINT NOT NULL,
  value           BIGINT NOT NULL,
  PRIMARY KEY (device_id)
);

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
CREATE PROCEDURE create_floor_and_return(IN name VARCHAR(255),IN building_id VARCHAR(255))
BEGIN
  INSERT INTO floor(name, building_id) VALUES (name, building_id);
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