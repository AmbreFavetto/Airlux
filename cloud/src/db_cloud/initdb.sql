CREATE DATABASE IF NOT EXISTS airlux_cloud_db;

USE airlux_cloud_db;

CREATE TABLE building (
  building_id     VARCHAR(255) NOT NULL,
  name            VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (building_id) 
);

CREATE TABLE user (
  user_id         VARCHAR(255) NOT NULL,
  name            VARCHAR(255) DEFAULT NULL,
  forename        VARCHAR(255) DEFAULT NULL,
  email           VARCHAR(255) DEFAULT NULL,
  password        VARCHAR(255) DEFAULT NULL,
  is_admin        BOOLEAN,
  PRIMARY KEY (user_id)
);

CREATE TABLE userBuilding (
  id              VARCHAR(255) NOT NULL,
  user_id         VARCHAR(255) NOT NULL,
  building_id     VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE CASCADE,
  FOREIGN KEY (building_id) REFERENCES building (building_id) ON DELETE CASCADE
);

CREATE TABLE floor (
  floor_id        VARCHAR(255) NOT NULL,
  name            VARCHAR(255) NOT NULL,
  building_id     VARCHAR(255) NOT NULL,
  PRIMARY KEY (floor_id),
  FOREIGN KEY (building_id) REFERENCES building (building_id) ON DELETE CASCADE
);

CREATE TABLE room (
  room_id         VARCHAR(255) NOT NULL,
  name            VARCHAR(255) DEFAULT NULL,
  floor_id        VARCHAR(255) NOT NULL,
  PRIMARY KEY (room_id),
  FOREIGN KEY (floor_id) REFERENCES floor (floor_id) ON DELETE CASCADE
);

CREATE TABLE device (
  device_id       VARCHAR(255) NOT NULL,
  name            VARCHAR(255) DEFAULT NULL,
  room_id         VARCHAR(255) NOT NULL,
  type            ENUM("actuator", "sensor") DEFAULT NULL,
  category        ENUM("lamp", "lamp_rgb", "blind", "radiator", "air_conditioning", "humidity", "temperature", "pressure") DEFAULT NULL,
  value           FLOAT NOT NULL,
  PRIMARY KEY (device_id),
  FOREIGN KEY (room_id) REFERENCES room (room_id) ON DELETE CASCADE
);

CREATE TABLE sousScenario(
  sousScenario_id     VARCHAR(255) NOT NULL,
  device_id            VARCHAR(255) NOT NULL,
  action               ENUM("on", "off", "color", "intensity", "open", "close", "temperature"),
  PRIMARY KEY (sousScenario_id),
  FOREIGN KEY (device_id) REFERENCES device (device_id) ON DELETE CASCADE
);

CREATE TABLE scenario (
  scenario_id     VARCHAR(255) NOT NULL,
  name            VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (scenario_id)
);

CREATE TABLE scenarioSousScenario (
  id                     VARCHAR(255) NOT NULL,
  scenario_id            VARCHAR(255) NOT NULL,
  sousScenario_id       VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (scenario_id) REFERENCES scenario (scenario_id) ON DELETE CASCADE,
  FOREIGN KEY (sousScenario_id) REFERENCES sousScenario (sousScenario_id) ON DELETE CASCADE
);

CREATE TABLE timeseries (
  timeseries_id   VARCHAR(255) NOT NULL,
  unit            VARCHAR(255) DEFAULT NULL,
  time            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  value           FLOAT NOT NULL DEFAULT 0,
  device_id       VARCHAR(255) NOT NULL,
  PRIMARY KEY (timeseries_id),
  FOREIGN KEY (device_id) REFERENCES device (device_id) ON DELETE CASCADE
);

