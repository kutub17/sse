CREATE TABLE `users` (
  `u_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `given_name` varchar(255),
  `family_name` varchar(255),
  `date_of_birth` varchar(255),
  `email` varchar(255),
  `contact_number` varchar(255),
  `gender` varchar(255),
  `COVID_contact` boolean,
  `receive_email_1` boolean,
  `receive_email_2` boolean,
  `receive_email_3` boolean,
  `username` varchar(255),
  `password` varchar(255),
  `street_number` int,
  `street_name` varchar(255),
  `suburb` varchar(255),
  `zip_code` varchar(255),
  `state` varchar(255)
);

CREATE TABLE `venues` (
  `v_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `given_name` varchar(255),
  `family_name` varchar(255),
  `date_of_birth` varchar(255),
  `email` varchar(255),
  `contact_number` varchar(255),
  `gender` varchar(255),
  `COVID_contact` boolean,
  `receive_email_1` boolean,
  `receive_email_2` boolean,
  `receive_email_3` boolean,
  `username` varchar(255),
  `password` varchar(255),
  `street_number` int,
  `street_name` varchar(255),
  `suburb` varchar(255),
  `zip_code` varchar(255),
  `state` varchar(255),
  `venue_code` varchar(255) UNIQUE
);

CREATE TABLE `check_in` (
  `c_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `u_id` int,
  `v_id` int,
  `date` DATE
);


CREATE TABLE `admins` (
  `a_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `email` varchar(255),
  `username` varchar(255),
  `password` varchar(255),
  `organization` varchar(255)
);

CREATE TABLE `admin_codes` (
  `ac_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `codes` varchar(255)
);

-- ALTER TABLE `CheckInHistoryList` ADD FOREIGN KEY (`id`) REFERENCES `Users` (`check_in_history`);

-- ALTER TABLE `CheckInHistoryList` ADD FOREIGN KEY (`id`) REFERENCES `Admin` (`check_in_history`);

-- ALTER TABLE `CheckInHistoryList` ADD FOREIGN KEY (`id`) REFERENCES `Venue` (`check_in_history`);

-- ALTER TABLE `Users` ADD FOREIGN KEY (`address_info`) REFERENCES `UserAddress` (`id`);

-- ALTER TABLE `Admin` ADD FOREIGN KEY (`address_info`) REFERENCES `UserAddress` (`id`);

-- ALTER TABLE `Venue` ADD FOREIGN KEY (`venue_location`) REFERENCES `VenueAddress` (`id`);

-- ALTER TABLE `VenueList` ADD FOREIGN KEY (`id`) REFERENCES `Users` (`owned_venues`);

-- ALTER TABLE `VenueList` ADD FOREIGN KEY (`id`) REFERENCES `Admin` (`owned_venues`);

-- ALTER TABLE `VenueList` ADD FOREIGN KEY (`venue_id`) REFERENCES `Venue` (`id`);

-- SELECT FROM Users WHERE username = ? AND password = ?;

-- INSERT INTO venues (given_name, family_name, date_of_birth, email, username) VALUES ('cai', 'w', '0304', '3@gmail.com', '3@gmail.com');

-- UPDATE venues SET username = ?, email = ?, given_name = ?, family_name = ?, date_of_birth = ?, contact_number = ?, gender = ? WHERE v_id = ?

