-- MySQL dump 10.13  Distrib 8.0.35, for Win64 (x86_64)
--
-- Host: localhost    Database: user_authentication
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) DEFAULT NULL,
  `image_url` varchar(2083) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Omega 3','High-quality Omega 3 supplement',29.99,'omega3.jpg'),(2,'Protein Powder','High-quality whey protein for muscle growth',29.99,'protein1.jpg'),(3,'Creatine Monohydrate','Micronized creatine for strength and power',19.99,'creatine.avif'),(4,'BCAA Capsules','Branched-chain amino acids for muscle recovery',24.99,'bcca.jpg'),(5,'Pre-Workout Booster','Energy and focus for intense workouts',34.99,'caffeinerush.jpg'),(6,'Multivitamin','Essential vitamins and minerals for overall health',14.99,'dailyvitamins.jpg'),(7,'Fish Oil Softgels','Omega-3 fatty acids for heart and joint health',12.99,'fishoil.png'),(8,'Glutamine Powder','Supports muscle recovery and immune function',21.99,'glutamine.jpg'),(9,'Mass Gainer','High-calorie supplement for weight gain',39.99,'massgainer.avif'),(10,'L-Carnitine Liquid','Fat metabolism support supplement',17.99,'l-carnitine.jpg'),(11,'Electrolyte Powder','Hydration and replenishment for endurance',15.99,'electrolytes.png'),(12,'Omega 3','High-quality Omega 3 supplement',29.99,'omega3.jpg'),(13,'Protein Powder','High-quality whey protein for muscle growth',29.99,'protein1.jpg'),(14,'Creatine Monohydrate','Micronized creatine for strength and power',19.99,'creatine.avif'),(15,'BCAA Capsules','Branched-chain amino acids for muscle recovery',24.99,'bcca.jpg'),(16,'Pre-Workout Booster','Energy and focus for intense workouts',34.99,'caffeinerush.jpg'),(17,'Multivitamin','Essential vitamins and minerals for overall health',14.99,'dailyvitamins.jpg'),(18,'Fish Oil Softgels','Omega-3 fatty acids for heart and joint health',12.99,'fishoil.png'),(19,'Glutamine Powder','Supports muscle recovery and immune function',21.99,'glutamine.jpg'),(20,'Mass Gainer','High-calorie supplement for weight gain',39.99,'massgainer.avif'),(21,'L-Carnitine Liquid','Fat metabolism support supplement',17.99,'l-carnitine.jpg'),(22,'Electrolyte Powder','Hydration and replenishment for endurance',15.99,'electrolytes.png');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('-_Lbc5sZDtPRFGJXJPA_NrrEDF1wVzy2',1731162342,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":false},\"userId\":\"34\",\"cart\":[{\"id\":1,\"name\":\"Omega 3\",\"price\":29.99,\"quantity\":1}]}'),('0ihAojGZVNFT3jJkoEpkbP-ZXGd_B3LL',1731152017,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"37\",\"cart\":[{\"id\":20,\"name\":\"Mass Gainer\",\"price\":39.99,\"quantity\":1},{\"id\":21,\"name\":\"L-Carnitine Liquid\",\"price\":17.99,\"quantity\":1}]}'),('0zwxODdRyCXD1S5UvUCqTqawXXzeWSkn',1731166262,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":false},\"userId\":\"34\",\"cart\":[{\"id\":3,\"name\":\"Creatine Monohydrate\",\"price\":19.99,\"quantity\":1}]}'),('1hiQsrNzCOSsD8YaV7LuVFw4u2lb3mM7',1731156736,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"userId\":\"45\",\"cart\":[{\"id\":7,\"name\":\"Fish Oil Softgels\",\"price\":12.99,\"quantity\":1}]}'),('2K80fPPjLkP3t4xra3G6LTOypt9YUDr6',1731153157,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"55\",\"cart\":[{\"id\":1,\"name\":\"Omega 3\",\"price\":29.99,\"quantity\":1}]}'),('422NHQpKaTI9J2NiPxqtPHYJx4amoqI9',1731154029,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"55\",\"cart\":[{\"id\":2,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1}]}'),('4_LBHPqVEDeB4TOLlvl1BbYE6ou0ooOz',1731152224,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"37\",\"cart\":[{\"id\":2,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1}]}'),('4iNJUk0TEKo3KNsullO0WVcfthwdqym_',1731152602,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"55\",\"cart\":[{\"id\":20,\"name\":\"Mass Gainer\",\"price\":39.99,\"quantity\":1},{\"id\":21,\"name\":\"L-Carnitine Liquid\",\"price\":17.99,\"quantity\":1},{\"id\":2,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1}]}'),('9cQkcZDrwIThG8h1fGiFCwBpxCqlkQHT',1731152231,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"37\",\"cart\":[{\"id\":2,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1}]}'),('9ndJd8ryxlxEPfxhRZpCq2286COKbd3o',1731157984,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"userId\":\"45\",\"cart\":[{\"id\":2,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1}]}'),('GC5ch-2zkCL-5pyyYqZ6AN3USiXZ0yNq',1731155159,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"userId\":\"55\",\"cart\":[{\"id\":2,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":2}]}'),('GJN1FeMGcwr4PF7E-MS624pMnSONcStK',1731152027,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"37\",\"cart\":[{\"id\":20,\"name\":\"Mass Gainer\",\"price\":39.99,\"quantity\":1},{\"id\":21,\"name\":\"L-Carnitine Liquid\",\"price\":17.99,\"quantity\":1}]}'),('HNQy6K96CjPsRmXn6TTnAAqQM1sPc8xE',1731153286,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"55\",\"cart\":[{\"id\":1,\"name\":\"Omega 3\",\"price\":29.99,\"quantity\":1}]}'),('HgmQEutrimxN9HdNlUIs9NmYQc5jKn_s',1731153166,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"55\",\"cart\":[{\"id\":1,\"name\":\"Omega 3\",\"price\":29.99,\"quantity\":1}]}'),('Iwah4VKh7NFsyUSaIlCQNziiNnm0LM_p',1731153233,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"55\",\"cart\":[{\"id\":1,\"name\":\"Omega 3\",\"price\":29.99,\"quantity\":1}]}'),('Jei3kGwkvvmG76GmbxqlDE10jc2otBks',1731152231,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"37\",\"cart\":[{\"id\":2,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1}]}'),('K6w7tNlvKSOu0eBnKP5JrugkXM1vXWM1',1731154026,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"55\",\"cart\":[{\"id\":2,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1}]}'),('LAfzYl5RXjCL70XciBi-28GXr0IL6ZrM',1731151508,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"55\",\"cart\":[{\"id\":2,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1}]}'),('MO-JuGr6rKfW5Ygxz-HnWdeBklvCCXT3',1731152021,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"37\",\"cart\":[{\"id\":20,\"name\":\"Mass Gainer\",\"price\":39.99,\"quantity\":1},{\"id\":21,\"name\":\"L-Carnitine Liquid\",\"price\":17.99,\"quantity\":1}]}'),('MroY3nD5Mx70S9D9y37via32HFnmRQKb',1731154037,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"55\",\"cart\":[{\"id\":2,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1}]}'),('PBY48I61KiO-Mrxb5HDNM_UmMomS6E91',1731157993,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"userId\":\"45\",\"cart\":[{\"id\":2,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1}]}'),('Tz3hXyEssvGN7vWkHwV22dRIhyPUasP3',1731151509,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"55\",\"cart\":[{\"id\":2,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1}]}'),('Ww9I6Dc00x0Lwi8giPCiMxiS7FzJX_GN',1731152225,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"37\",\"cart\":[{\"id\":2,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1}]}'),('XcWSA6oBwFD2b8ebdN3S3htN5gkdfFTq',1731152223,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"37\",\"cart\":[{\"id\":2,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1}]}'),('Y_vxiNJ7VcbJlvDkHQ3-x-KR0yNxYG_r',1731151509,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"55\",\"cart\":[{\"id\":2,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1}]}'),('YpeP6YXpHRe0fz8rDdqDZmkJORboepsi',1731151142,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"45\",\"cart\":[{\"id\":13,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1},{\"id\":14,\"name\":\"Creatine Monohydrate\",\"price\":19.99,\"quantity\":1},{\"id\":16,\"name\":\"Pre-Workout Booster\",\"price\":34.99,\"quantity\":1}]}'),('Z0noYCNmEdURNm4wXN9NjjT1QTpH6plB',1731153204,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"55\",\"cart\":[{\"id\":1,\"name\":\"Omega 3\",\"price\":29.99,\"quantity\":1}]}'),('ZWsWeOpB9z9ZkXheR2zP0aABpcz91ChQ',1731151153,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"45\",\"cart\":[{\"id\":13,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1},{\"id\":14,\"name\":\"Creatine Monohydrate\",\"price\":19.99,\"quantity\":1},{\"id\":16,\"name\":\"Pre-Workout Booster\",\"price\":34.99,\"quantity\":1}]}'),('_VV9Tnbg-6P5Exc71FISlhUawwCAbni0',1731152226,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"37\",\"cart\":[{\"id\":2,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1}]}'),('bNFdX9t49mCPKDXlAWFnQYxPIn_PNFyu',1731153153,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"55\",\"cart\":[{\"id\":1,\"name\":\"Omega 3\",\"price\":29.99,\"quantity\":1}]}'),('eyHmabDPHehPjnwnkFVLRh6xduD-nYzy',1731153039,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"55\",\"cart\":[{\"id\":22,\"name\":\"Electrolyte Powder\",\"price\":15.99,\"quantity\":1}]}'),('fXnFpSik3JVRFswitKSmj4iFwAA53MrG',1731151513,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"55\",\"cart\":[{\"id\":2,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1}]}'),('hvcKR7RWULCUJs72XgpQ3ogRW15LbQwT',1731153142,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"55\",\"cart\":[{\"id\":1,\"name\":\"Omega 3\",\"price\":29.99,\"quantity\":1}]}'),('hwKtDZTthNVy8RQtzDpYO7OIuz6QaKFo',1731154506,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"55\",\"cart\":[{\"id\":7,\"name\":\"Fish Oil Softgels\",\"price\":12.99,\"quantity\":1}]}'),('iRxFwczrOYLFN4UIl9Mdw6YemCOyoq4a',1731152021,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"37\",\"cart\":[{\"id\":20,\"name\":\"Mass Gainer\",\"price\":39.99,\"quantity\":1},{\"id\":21,\"name\":\"L-Carnitine Liquid\",\"price\":17.99,\"quantity\":1}]}'),('iUQIWfMuZGuP_o8NIJuWDATGGUQqWyi6',1731152221,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"37\",\"cart\":[{\"id\":2,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1}]}'),('lyWfdYKUN3NSMtS_FOL553mZUGofyyAh',1731152019,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"37\",\"cart\":[{\"id\":20,\"name\":\"Mass Gainer\",\"price\":39.99,\"quantity\":1},{\"id\":21,\"name\":\"L-Carnitine Liquid\",\"price\":17.99,\"quantity\":1}]}'),('mfA73TtmZFAKyEFJnKiSPfzjdvEFPOCB',1731152152,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"37\",\"cart\":[{\"id\":2,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1}]}'),('qLjc4Zo5CXgGXdy8Yq-3A5WfuZijdQ-0',1731151502,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"55\",\"cart\":[{\"id\":2,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1}]}'),('su8Dcuh6V9reAVFh7IGaABn8pDofnE8y',1731152226,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"37\",\"cart\":[{\"id\":2,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1}]}'),('uRxmzjHINnw0AXFZ2N-1F0GkYVH3A8pt',1731152027,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"37\",\"cart\":[{\"id\":20,\"name\":\"Mass Gainer\",\"price\":39.99,\"quantity\":1},{\"id\":21,\"name\":\"L-Carnitine Liquid\",\"price\":17.99,\"quantity\":1}]}'),('wZNA7lq6cQ2CAaVpfX5kh2UZ6LqiOTjD',1731152158,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"37\",\"cart\":[{\"id\":2,\"name\":\"Protein Powder\",\"price\":29.99,\"quantity\":1}]}'),('xTNjG_XAfz-bmmLD1JBTb2WF5lmqgGRH',1731163622,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":false},\"userId\":\"34\",\"cart\":[{\"id\":1,\"name\":\"Omega 3\",\"price\":29.99,\"quantity\":1}]}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'john.doe@example.com','password123'),(2,'jane.smith@example.com','mysecurepassword'),(3,'alice.jones@example.com','alicepassword'),(4,'bob.brown@example.com','password456'),(5,'charlie.green@example.com','pass789'),(32,'razvan.tiban@agilenetworks.tech','aaaaaa'),(33,'razvan.tib111an@agilenetworks.tech','123123'),(34,'tiban.razvan23@yahoo.com','123123123'),(35,'asdasd@yahoo.com','123123'),(36,'tiban.razvan1123@yahoo.com','123123123@'),(37,'cyber.trainee1@nttdata.ro','123123123!'),(38,'exemlu@test.com','123123123!'),(39,'razvan.tiban1@agilenetworks.tech','123123123!'),(40,'softwarevault27@gmail.com','123123123!'),(41,'razvan.tiban2@agilenetworks.tech','123123123!'),(42,'razvan.tiban3@agilenetworks.tech','123123123!'),(43,'razvan.tiban4@agilenetworks.tech','123123123!'),(44,'razvan.tiban5@agilenetworks.tech','123123123!'),(45,'zsoltika@gmail.com','123123123!'),(46,'razvan.tiban6@agilenetworks.tech','123123123!'),(47,'toadercristian2003@gmail.com','DavidDop12@'),(48,'razvan.tiban10@agilenetworks.tech','123123123!'),(49,'razvan.tiban11@agilenetworks.tech','123123123!'),(50,'razvan.tiban12@agilenetworks.tech','123123123!'),(51,'razvan.tiban13@agilenetworks.tech','123123123!'),(52,'razvan.tiban113@agilenetworks.tech','123123123!'),(53,'razvan.tiban111@agilenetworks.tech','123123123!'),(54,'razvan.tiban1111@agilenetworks.tech','123123123!'),(55,'razvan.tiban123@agilenetworks.tech','123123123!'),(56,'tiban.razvan232@yahoo.com','123123123!'),(57,'11razvan.tiban@agilenetworks.tech','123123123!'),(58,'exemlu1@test.com','123123123!'),(59,'exemlu22@test.com','123123123!');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-09 10:34:14
