CREATE DATABASE IF NOT EXISTS airlux_cloud_db;

USE airlux_cloud_db;

CREATE TABLE building (
  building_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
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
