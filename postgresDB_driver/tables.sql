CREATE TABLE sensor_types (
    
    ID SERIAL NOT NULL PRIMARY KEY, 
    sensor_type_name TEXT NOT NULL 
);

CREATE TABLE sensor_locations (

    ID SERIAL NOT NULL PRIMARY KEY, 
    sensor_location_name TEXT NOT NULL 
);

CREATE TABLE data_points (
  
    ID SERIAL PRIMARY KEY,
    sensor_type  INT NOT NULL REFERENCES sensor_types(ID), 
    sensor_loc  INT NOT NULL REFERENCES sensor_locations(ID),
    time_stamp TIMESTAMPTZ NOT NULL,
    val DECIMAL NOT NULL
);

insert into sensor_types (ID, sensor_type_name) values (1, 'temperature');
insert into sensor_types (ID, sensor_type_name) values (2, 'humidity');
insert into sensor_locations (ID, sensor_location_name) values (4, 'Grow Room');
insert into sensor_locations (ID, sensor_location_name) values (5, 'Grow Room');
insert into sensor_locations (ID, sensor_location_name) values (6, 'Harvest Room');
insert into sensor_locations (ID, sensor_location_name) values (7, 'Harvest Room');
