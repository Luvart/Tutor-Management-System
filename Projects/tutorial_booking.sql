/*
SQLyog Ultimate v9.62 
MySQL - 5.5.5-10.4.32-MariaDB : Database - tutorial_booking
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`tutorial_booking` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `tutorial_booking`;

/*Table structure for table `bookings` */

DROP TABLE IF EXISTS `bookings`;

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `schedule_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected','Cancelled','Completed') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `bookings` */

insert  into `bookings`(`id`,`schedule_id`,`student_id`,`description`,`status`,`created_at`,`updated_at`) values (6,9,5,NULL,'Approved','2025-03-27 20:18:56','2025-03-27 20:19:37'),(7,10,5,NULL,'Approved','2025-03-27 20:19:45','2025-03-27 20:19:53'),(8,11,5,NULL,'Pending','2025-03-27 20:19:49',NULL);

/*Table structure for table `feedback` */

DROP TABLE IF EXISTS `feedback`;

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) DEFAULT NULL,
  `rating` enum('1','2','3','4','5','0') DEFAULT NULL,
  `comments` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `feedback` */

/*Table structure for table `messages` */

DROP TABLE IF EXISTS `messages`;

CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `messages` */

insert  into `messages`(`id`,`sender_id`,`receiver_id`,`message`,`image_url`,`created_at`,`is_read`) values (7,5,2,'Proof of payment','/uploads/1739753459516.jpg','2025-02-17 08:50:59',1),(8,2,5,'Confirmed Booking','/uploads/1739753571185.jpg','2025-02-17 08:52:51',1),(9,5,2,'sdg',NULL,'2025-02-17 20:58:48',1),(10,5,2,'Hello',NULL,'2025-02-18 08:42:33',1),(11,5,2,'Wfsafsa',NULL,'2025-02-18 08:42:43',1),(12,5,2,'Yow',NULL,'2025-02-18 09:04:35',1),(13,7,2,'Hi',NULL,'2025-02-18 09:15:33',1),(14,7,2,'Wazaaaap',NULL,'2025-02-18 10:06:58',1),(15,7,2,'asg',NULL,'2025-02-18 10:59:56',1),(16,8,2,'Hey',NULL,'2025-02-19 07:56:19',1),(17,5,2,'gas',NULL,'2025-03-05 09:24:35',1),(18,5,2,'Watt',NULL,'2025-03-05 09:41:20',1),(19,2,5,'gasgsa',NULL,'2025-03-05 09:41:36',1),(20,5,2,'Okay',NULL,'2025-03-05 09:49:32',1),(21,5,2,'Yesd',NULL,'2025-03-05 09:49:51',1),(22,2,5,'Good',NULL,'2025-03-05 09:50:11',1),(23,5,2,'well',NULL,'2025-03-05 09:50:32',1),(24,5,2,'gasga',NULL,'2025-03-05 09:53:35',1),(25,2,5,'ASa lage',NULL,'2025-03-05 09:54:00',1),(26,5,2,'Wow',NULL,'2025-03-05 09:54:16',1),(27,5,2,'gasgas',NULL,'2025-03-05 09:54:36',1),(28,2,5,'1998',NULL,'2025-03-05 09:59:02',1),(29,5,2,'Congrats',NULL,'2025-03-05 10:01:05',1),(30,2,5,'Wow',NULL,'2025-03-05 10:01:52',1),(31,5,2,'well played',NULL,'2025-03-05 10:59:39',1),(32,5,2,'Whut',NULL,'2025-03-05 10:59:51',1),(33,5,2,'Why',NULL,'2025-03-05 11:00:49',1),(34,5,2,'BEcause',NULL,'2025-03-05 11:01:28',1),(35,5,2,'Of',NULL,'2025-03-05 11:01:59',1),(36,5,2,'What',NULL,'2025-03-05 11:02:15',1),(37,5,2,'Tf',NULL,'2025-03-05 11:02:33',1),(38,5,2,'asgasgsa',NULL,'2025-03-05 11:02:48',1),(39,5,2,'gasgasgasg',NULL,'2025-03-05 11:02:56',1),(40,5,2,'gsagasga',NULL,'2025-03-05 11:03:26',1),(41,5,2,'asgasgas',NULL,'2025-03-05 11:03:48',1),(42,5,2,'Hello',NULL,'2025-03-05 11:05:38',1),(43,5,2,'Wa',NULL,'2025-03-05 11:05:46',1),(44,5,2,'ffsa',NULL,'2025-03-05 11:12:04',1),(45,5,2,'gasgasg',NULL,'2025-03-05 11:12:19',1),(46,5,2,'fasfasf',NULL,'2025-03-05 11:13:50',1),(47,5,2,'ffffff',NULL,'2025-03-05 11:14:00',1),(48,5,2,'gasasgh123',NULL,'2025-03-05 11:16:01',1),(49,5,2,'gsa',NULL,'2025-03-05 11:16:05',1),(50,2,5,'weh',NULL,'2025-03-05 11:55:37',0),(51,5,2,'sure ba',NULL,'2025-03-05 11:55:47',1),(52,5,2,'vvvv',NULL,'2025-03-05 12:00:35',1),(53,2,8,'Okay',NULL,'2025-03-06 13:37:57',0),(54,2,7,'Okay',NULL,'2025-03-06 13:40:02',0),(55,2,5,'Che',NULL,'2025-03-06 13:48:18',0),(56,2,5,'fsa',NULL,'2025-03-06 13:48:35',0),(57,7,2,'','/uploads/1742212857270.jpg','2025-03-17 20:00:57',1),(58,1,2,'Hey',NULL,'2025-03-18 14:38:12',1),(59,2,1,'','/uploads/1742279908659.jpg','2025-03-18 14:38:28',0),(60,5,2,'Hey I had a missed schedule can I get a compensation for that?',NULL,'2025-03-27 20:39:12',1),(61,2,5,'Im sorry but it is already discussed upon enrollment that a booked schedule not canceled in advance is considered as consumed. As per the schedule the tutor had allotted their time on it expecting a session to be done. Thank You!  ',NULL,'2025-03-27 20:40:29',0);

/*Table structure for table `package_booking` */

DROP TABLE IF EXISTS `package_booking`;

CREATE TABLE `package_booking` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `package_id` int(11) NOT NULL,
  `status` enum('Pending','Fully Paid','Partially Paid','Rejected') DEFAULT 'Pending',
  `session_credits` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `package_booking` */

insert  into `package_booking`(`id`,`customer_id`,`package_id`,`status`,`session_credits`,`created_at`,`updated_at`) values (2,5,1,'Partially Paid',2,'2025-03-27 08:22:31','2025-03-27 10:46:31'),(3,8,15,'Partially Paid',1,'2025-03-27 16:55:31','2025-03-27 16:55:38');

/*Table structure for table `packages` */

DROP TABLE IF EXISTS `packages`;

CREATE TABLE `packages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `section` varchar(55) DEFAULT NULL,
  `session_count` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `tutorialType` enum('1-on-1 Subscription','2-on-1 Subscription') DEFAULT NULL,
  `description` varchar(155) DEFAULT NULL,
  `tutor_id` int(50) DEFAULT NULL,
  `status` enum('Active','Inactive','Completed','Booked') DEFAULT 'Inactive',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `packages` */

insert  into `packages`(`id`,`name`,`section`,`session_count`,`price`,`tutorialType`,`description`,`tutor_id`,`status`,`created_at`) values (1,'Regular Package','A',15,'3300.00','1-on-1 Subscription','ssafas',1,'Booked','2025-02-01 09:01:22'),(3,'Daily Package','A',30,'5500.00','1-on-1 Subscription','d',3,'Active','2025-02-01 09:01:22'),(14,'Regular Package','B',15,'3300.00','1-on-1 Subscription','2nd Section',3,'Active','2025-02-10 18:11:27'),(15,'Regular Package','C',15,'3300.00','1-on-1 Subscription','dddasf',4,'Booked','2025-02-10 18:27:08');

/*Table structure for table `payments` */

DROP TABLE IF EXISTS `payments`;

CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `packagebooking_id` int(11) DEFAULT NULL,
  `student_id` int(11) DEFAULT NULL,
  `package_id` int(11) DEFAULT NULL,
  `amount_paid` decimal(10,2) DEFAULT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `payments` */

insert  into `payments`(`id`,`packagebooking_id`,`student_id`,`package_id`,`amount_paid`,`payment_date`) values (2,2,NULL,NULL,'220.00','2025-03-27 08:22:39'),(3,2,NULL,NULL,'220.00','2025-03-27 08:29:17'),(4,3,NULL,NULL,'220.00','2025-03-27 16:55:38');

/*Table structure for table `schedules` */

DROP TABLE IF EXISTS `schedules`;

CREATE TABLE `schedules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `package_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `session_number` int(11) DEFAULT 0,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `schedules` */

insert  into `schedules`(`id`,`package_id`,`date`,`session_number`,`start_time`,`end_time`,`created_at`,`updated_at`) values (9,1,'2025-03-27',1,'19:00:00','20:00:00','2025-03-27 08:23:55','2025-03-27 08:23:55'),(10,1,'2025-03-28',2,'19:00:00','20:00:00','2025-03-27 08:29:47','2025-03-27 08:29:47'),(11,1,'2025-03-29',3,'19:00:00','20:00:00','2025-03-27 08:29:54','2025-03-27 08:29:54');

/*Table structure for table `sessions` */

DROP TABLE IF EXISTS `sessions`;

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `package_bookingId` int(11) DEFAULT NULL,
  `booking_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `status` enum('Scheduled','Ongoing','Completed','Confirmed','Missed') DEFAULT 'Scheduled',
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `sessions` */

insert  into `sessions`(`id`,`package_bookingId`,`booking_id`,`customer_id`,`status`,`created_at`) values (13,2,6,5,'Missed','2025-03-27 20:19:37'),(14,2,7,5,'Scheduled','2025-03-27 20:19:53');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `middlename` varchar(100) DEFAULT NULL,
  `gender` enum('Male','Female') DEFAULT NULL,
  `role` enum('Administrator','Secretary','Customer','Tutor') NOT NULL DEFAULT 'Customer',
  `parentsInfo` varchar(255) DEFAULT NULL,
  `parentsNumber` int(25) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`email`,`password`,`firstname`,`lastname`,`middlename`,`gender`,`role`,`parentsInfo`,`parentsNumber`,`created_at`,`updated_at`) values (1,'dave','dave@gmail.com','$2b$10$L5dc8ouwj77NHmtZEiuI8u2/3NhMgTRNPyXFFBI1E74k13NzVpqJu','Dave','Apit','Gaco','Male','Tutor',NULL,NULL,'2025-02-03 08:44:19','2025-02-14 14:54:23'),(2,'lewis','lewis@gmail.com','$2b$10$/iPkGr/r9JV4gTq8PqM7IOM.JhtQmm7KJ3lWHcnYvWvhKQSvKM49i','Lewis','Hamilton','Carlson','Male','Administrator',NULL,NULL,'2025-02-05 15:48:22','2025-03-21 15:44:38'),(3,'max','max@gmail.com','$2b$10$zN0u23GKuCWzYQIuJe.Lq.F5FyZNGSlWglgDrATL8J4xU11pBgw52','Max Emillian','Verstappen','D','Male','Tutor',NULL,NULL,'2025-02-07 10:46:54','2025-03-08 19:50:08'),(4,'Nico','nico@gmail.com','$2b$10$RGkAmUnQG6yP4B35sybIO.xi3.fK4NmoRUgdRTsD1CB28yAczfFvq','Nico','Hülkenberg',NULL,'Male','Tutor',NULL,NULL,'2025-02-10 14:32:27','2025-02-14 14:54:32'),(5,'Kimi','kimi@gmail.com','$2b$10$oD.fgRf.H/6o19zsgTNANOO43n5i/4.9luGbjU5gDnwRWvJxl4tQa','Kimi','Räikkönen','Marc','Male','Customer',NULL,NULL,'2025-02-10 14:33:10','2025-03-21 16:57:38'),(7,'joanna','joanna@gmail.com','$2b$10$NFGePVJzgjVEgqoEzpXcEueKoQINW/q/Lrnv7gz0f3KcnuZlhQ/6i','Joanna Mae','Cloma','Lague','Female','Customer','Ana Liza Cloma',5512,'2025-02-10 20:36:41','2025-03-30 13:18:31'),(9,'Lando','lando@gmail.com','$2b$10$7eXr02OuZrLowAux2nzJgOtqdbI4YkX/YfsPgncSS5hXyOhwDUr/2','Lando','Norris','','Male','Secretary',NULL,NULL,'2025-02-19 14:07:39','2025-03-29 18:59:36'),(10,'Valteri','valteri@gmail.com','$2b$10$ljaotOcVtNshmx6fDuCeXuQN/ASRUlePnS5Y7gljeSWlI1926TZSC','Valteri','Bottas','','Male','Tutor','Botasiri',931,'2025-02-19 14:12:25','2025-03-30 13:15:06'),(11,'Yuki','yuki@gmail.com','$2b$10$uGHQcDnDOgKZvHQLn5Vc2.VDI4zOy93lFsogaslonOoDnJ7LnR92W',NULL,NULL,NULL,NULL,'Administrator',NULL,NULL,'2025-03-29 20:06:55','2025-03-29 20:06:55'),(13,'liam','liam@gmail.com','$2b$10$v8OKRTG1RPgQTb0JXPEh3eyDz8zUHIIieQUEef/yxSdj9QGIBvkeK',NULL,NULL,NULL,NULL,'Customer',NULL,NULL,'2025-03-30 10:59:39','2025-03-30 10:59:39');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
