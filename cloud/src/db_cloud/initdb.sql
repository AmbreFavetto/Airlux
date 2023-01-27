CREATE DATABASE IF NOT EXISTS airlux_cloud_db;

USE airlux_cloud_db;

CREATE TABLE building (
  building_id     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name            VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (building_id) 
);

CREATE TABLE user (
  user_id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name            VARCHAR(255) DEFAULT NULL,
  forename        VARCHAR(255) DEFAULT NULL,
  email           VARCHAR(255) DEFAULT NULL,
  password        VARCHAR(255) DEFAULT NULL,
  is_admin        BOOLEAN,
  PRIMARY KEY (user_id)
);

CREATE TABLE user_building (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id         BIGINT UNSIGNED,
  building_id     BIGINT UNSIGNED,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE CASCADE,
  FOREIGN KEY (building_id) REFERENCES building (building_id) ON DELETE CASCADE
);

CREATE TABLE floor (
  floor_id        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  number          BIGINT UNSIGNED NOT NULL,
  building_id     BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (floor_id),
  FOREIGN KEY (building_id) REFERENCES building (building_id) ON DELETE CASCADE
);


CREATE TABLE room (
  room_id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name            VARCHAR(255) DEFAULT NULL,
  floor_id        BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (room_id),
  FOREIGN KEY (floor_id) REFERENCES floor (floor_id) ON DELETE CASCADE
);


CREATE TABLE device (
  device_id       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name            VARCHAR(255) DEFAULT NULL,
  room_id         BIGINT UNSIGNED NOT NULL,
  type            ENUM("actuator", "sensor") DEFAULT NULL,
  PRIMARY KEY (device_id),
  FOREIGN KEY (room_id) REFERENCES room (room_id) ON DELETE CASCADE
);

CREATE TABLE scenario (
  scenario_id     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name            VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (scenario_id)
);

CREATE TABLE scenario_device (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  scenario_id     BIGINT UNSIGNED NOT NULL,
  device_id       BIGINT UNSIGNED NOT NULL,
  enable_device   BOOLEAN NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (scenario_id) REFERENCES scenario (scenario_id) ON DELETE CASCADE,
  FOREIGN KEY (device_id) REFERENCES device (device_id) ON DELETE CASCADE
);


CREATE TABLE timeseries (
  timeseries_id   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  unit            VARCHAR(255) DEFAULT NULL,
  timestamp       BIGINT NOT NULL,
  value           FLOAT,
  device_id       BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (timeseries_id),
  FOREIGN KEY (device_id) REFERENCES device (device_id) ON DELETE CASCADE
);

INSERT INTO building(name) VALUES ("batiment num  1");
INSERT INTO building(name) VALUES ("batiment num  2");
INSERT INTO building(name) VALUES ("batiment num  3");
INSERT INTO building(name) VALUES ("batiment num  4");
INSERT INTO building(name) VALUES ("batiment num  5");
INSERT INTO building(name) VALUES ("batiment num  6");
INSERT INTO building(name) VALUES ("batiment num  7");
INSERT INTO building(name) VALUES ("batiment num  8");
INSERT INTO building(name) VALUES ("batiment num  9");
INSERT INTO building(name) VALUES ("batiment num  10");
INSERT INTO building(name) VALUES ("batiment num  11");
INSERT INTO building(name) VALUES ("batiment num  12");

INSERT INTO floor(number, building_id) VALUES (0, 1);
INSERT INTO floor(number, building_id) VALUES (1, 1);
INSERT INTO floor(number, building_id) VALUES (2, 1);
INSERT INTO floor(number, building_id) VALUES (3, 1);
INSERT INTO floor(number, building_id) VALUES (0, 2);
INSERT INTO floor(number, building_id) VALUES (1, 2);
INSERT INTO floor(number, building_id) VALUES (2, 2);
INSERT INTO floor(number, building_id) VALUES (0, 3);

INSERT INTO room(name, floor_id) VALUES ("Salon", 1);
INSERT INTO room(name, floor_id) VALUES ("Salle a manger", 1);
INSERT INTO room(name, floor_id) VALUES ("Salon de repos", 1);
INSERT INTO room(name, floor_id) VALUES ("Salle de bain", 1);
INSERT INTO room(name, floor_id) VALUES ("Salle de jeu",2);
INSERT INTO room(name, floor_id) VALUES ("Toilettes", 2);
INSERT INTO room(name, floor_id) VALUES ("Salle de bain", 3);

INSERT INTO device(name, room_id, type) VALUES ("Capteur temperature", 1, "actuator");
INSERT INTO device(name, room_id, type) VALUES ("Interupteur", 1, "actuator");
INSERT INTO device(name, room_id, type) VALUES ("Interupteur lumiere", 2, "actuator");
INSERT INTO device(name, room_id, type) VALUES ("Capteur lumiere", 2, "actuator");
INSERT INTO device(name, room_id, type) VALUES ("Capteur temperature", 3, "actuator");
INSERT INTO device(name, room_id, type) VALUES ("Lumière plafond", 3, "actuator");
INSERT INTO device(name, room_id, type) VALUES ("Lumière table", 3, "actuator");
INSERT INTO device(name, room_id, type) VALUES ("Capteur murale", 3, "actuator");

INSERT INTO scenario(name) VALUES ("Eteindre toutes les lumières");
INSERT INTO scenario(name) VALUES ("Allumer toutes les lumières");
INSERT INTO scenario(name) VALUES ("Baisser les volets");

INSERT INTO scenario_device(scenario_id, device_id, enable_device) VALUES (1, 6, false);
INSERT INTO scenario_device(scenario_id, device_id, enable_device) VALUES (1, 7, false);
INSERT INTO scenario_device(scenario_id, device_id, enable_device) VALUES (1, 8, false);
INSERT INTO scenario_device(scenario_id, device_id, enable_device) VALUES (2, 6, true);
INSERT INTO scenario_device(scenario_id, device_id, enable_device) VALUES (2, 7, true);
INSERT INTO scenario_device(scenario_id, device_id, enable_device) VALUES (2, 8, true);
INSERT INTO scenario_device(scenario_id, device_id, enable_device) VALUES (3, 6, true);
INSERT INTO scenario_device(scenario_id, device_id, enable_device) VALUES (3, 7, true);
INSERT INTO scenario_device(scenario_id, device_id, enable_device) VALUES (3, 8, true);

INSERT INTO user(name, forename, email, password, is_admin) VALUES ("HOUDU", "Valentin", "valentin.hpro1@gmail.com", "azertyuiop", true);
INSERT INTO user(name, forename, email, password, is_admin) VALUES ("KARACHIRA", "Clara", "clazzzaa1@gmail.com", "azertyuiop", false);
INSERT INTO user(name, forename, email, password, is_admin) VALUES ("CASTE", "Romain", "carabistouille@gmail.com", "azertyuiop", false);
INSERT INTO user(name, forename, email, password, is_admin) VALUES ("LESPAGNOL", "Sylvain", "lespognol@gmail.com", "azertyuiop", false);
INSERT INTO user(name, forename, email, password, is_admin) VALUES ("FAVETTO", "Ambre", "amber@gmail.com", "azertyuiop", true);

INSERT INTO user_building(user_id, building_id) VALUES (1, 1);
INSERT INTO user_building(user_id, building_id) VALUES (2, 1);
INSERT INTO user_building(user_id, building_id) VALUES (3, 1);
INSERT INTO user_building(user_id, building_id) VALUES (4, 2);
INSERT INTO user_building(user_id, building_id) VALUES (5, 2);

INSERT INTO timeseries(unit, timestamp, value, device_id) VALUES ("km/h", 20, 0, 1);
INSERT INTO timeseries(unit, timestamp, value, device_id) VALUES ("km/h", 20, 2, 2);
INSERT INTO timeseries(unit, timestamp, value, device_id) VALUES ("km/h", 20, 4, 3);

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