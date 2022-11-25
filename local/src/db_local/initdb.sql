CREATE DATABASE IF NOT EXISTS airluxDB;

USE airluxDB;

CREATE TABLE building (
  building_id     PRIMARY BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name       VARCHAR(255) DEFAULT NULL
);

CREATE TABLE user (
  user_id    PRIMARY BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name       VARCHAR(255) DEFAULT NULL,
  forename   VARCHAR(255) DEFAULT NULL,
  email      VARCHAR(255) DEFAULT NULL,
  password   VARCHAR(255) DEFAULT NULL,
  is_admin   BOOLEAN,
  building_id     BIGINT NOT NULL
);

CREATE TABLE floor (
  floor_id   PRIMARY BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name       VARCHAR(255) DEFAULT NULL,
  building_id     BIGINT NOT NULL
);


CREATE TABLE room (
  room_id    PRIMARY BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name       VARCHAR(255) DEFAULT NULL,
  floor_id   BIGINT NOT NULL,
  building_id     BIGINT NOT NULL
);


CREATE TABLE device (
  device_id  PRIMARY BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name       VARCHAR(255) DEFAULT NULL,
  floor_id   BIGINT NOT NULL,
  building_id     BIGINT NOT NULL,
  room_id    BIGINT NOT NULL
);


CREATE TABLE timeseries (
  device_id  PRIMARY BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  unit       VARCHAR(255) DEFAULT NULL,
  timestamp  BIGINT NOT NULL,
  value      BIGINT NOT NULL
);
