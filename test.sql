-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 14, 2020 at 05:19 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

CREATE TABLE `friends` (
  `id` int(11) NOT NULL,
  `userId_1` int(11) NOT NULL,
  `userId_2` int(11) NOT NULL,
  `accept` tinyint(1) NOT NULL,
  `recent` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `friends`
--

INSERT INTO `friends` (`id`, `userId_1`, `userId_2`, `accept`, `recent`) VALUES
(1, 1, 3, 1, '2020-06-12 12:33:44'),
(2, 4, 1, 1, '2020-06-05 04:17:00'),
(3, 1, 5, 1, '2020-06-06 02:40:59'),
(4, 3, 5, 1, '2020-06-12 09:49:32'),
(5, 1, 8, 0, '2020-04-23 12:28:27'),
(6, 5, 8, 0, '2020-04-23 13:46:00'),
(7, 3, 8, 0, '2020-04-23 13:46:23');

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `id` int(11) NOT NULL,
  `creatorid` int(11) NOT NULL,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `recent` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `creatorid`, `name`, `recent`) VALUES
(6, 1, 'truc_dong,dai_ga_vl', '2020-06-13 04:22:37'),
(7, 3, 'truc_dong,admin', '2020-06-13 03:24:17');

-- --------------------------------------------------------

--
-- Table structure for table `groups_members_detail`
--

CREATE TABLE `groups_members_detail` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  `seen` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `groups_members_detail`
--

INSERT INTO `groups_members_detail` (`id`, `userid`, `isAdmin`, `seen`) VALUES
(6, 1, 1, 1),
(6, 5, 0, 0),
(6, 3, 0, 1),
(7, 3, 1, 1),
(7, 5, 0, 0),
(7, 1, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `groups_messages_detail`
--

CREATE TABLE `groups_messages_detail` (
  `id` int(11) NOT NULL,
  `groupId` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `content` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `groups_messages_detail`
--

INSERT INTO `groups_messages_detail` (`id`, `groupId`, `sender_id`, `content`, `type`, `sent_at`) VALUES
(1, 6, 1, 'h', 'text', '2020-06-12 15:25:09'),
(2, 6, 1, 'l', 'text', '2020-06-13 02:43:27'),
(3, 7, 1, 'p', 'text', '2020-06-13 02:43:38'),
(4, 7, 1, 'alo', 'text', '2020-06-13 03:20:19'),
(5, 7, 1, 'zo', 'text', '2020-06-13 03:24:17'),
(6, 6, 1, 'testing', 'text', '2020-06-13 03:25:44'),
(7, 6, 1, 'asjd iaj diqj dioajsiod jqiojdoiqjdoisaj doiqj iodq idjqoiwdj qijdoiqdioqjdoijqidjwqoid jdj iqjdioqw', 'text', '2020-06-13 03:28:05'),
(8, 6, 1, 'k', 'text', '2020-06-13 03:28:16'),
(9, 6, 1, 'pl', 'text', '2020-06-13 03:49:11'),
(10, 6, 3, 'shit', 'text', '2020-06-13 03:59:54'),
(11, 6, 3, 'try', 'text', '2020-06-13 04:08:10'),
(12, 6, 1, 'ag', 'text', '2020-06-13 04:19:28'),
(13, 6, 1, 't', 'text', '2020-06-13 04:19:44'),
(14, 6, 1, 'test', 'text', '2020-06-13 04:21:00'),
(15, 6, 3, 'ngon', 'text', '2020-06-13 04:21:11'),
(16, 6, 1, 's', 'text', '2020-06-13 04:22:30'),
(17, 6, 3, 's', 'text', '2020-06-13 04:22:37');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` text NOT NULL,
  `email` varchar(100) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `gender` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `fullname`, `gender`) VALUES
(1, 'admin', 'admin', 'minhduc@gmail.com', 'Minh Duc', 1),
(3, 'dai_ga_vl', 'Daigavl3008', 'Dai@gmail.com', 'Phan Dai', 1),
(4, 'ngoctrinhsexy', 'Ngoctrinhsexy90', 'ngoctrinh@gmail.com', 'Ngoc Trinh', 0),
(5, 'truc_dong', 'Trucdong99', 'trucdong@gmail.com', 'Truc Dong', 1),
(6, 'toanhkhoa', 'Khoato2712', 'khoato@gmail.com', 'To Anh Khoa', 1),
(7, 'tranminhduc', 'Minhduc12345', 'ductran@yahoo.com', 'Tran Minh Duc', 1),
(8, 'nguyenminhduc', 'Minhduc12345', 'ducnguyen@gmail.com', 'Nguyen Minh Duc', 1),
(9, 'trannhatduc', 'Nhatduc12345', 'nhatduc@yahoo.com', 'Tran Nhat Duc', 1),
(10, 'trungtinh', 'Trungtinh123', 'trungtinh@gmail.com', 'nguyen trung tinh', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_messages_detail`
--

CREATE TABLE `user_messages_detail` (
  `id` int(11) NOT NULL,
  `sender_username` varchar(20) NOT NULL,
  `content` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `rcv_username` varchar(20) NOT NULL,
  `type` varchar(10) NOT NULL,
  `seen` tinyint(1) NOT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_messages_detail`
--

INSERT INTO `user_messages_detail` (`id`, `sender_username`, `content`, `rcv_username`, `type`, `seen`, `sent_at`) VALUES
(2, 'admin', 'hello', 'dai_ga_vl', 'text', 1, '2020-04-17 15:06:48'),
(3, 'admin', 'shit man', 'dai_ga_vl', 'text', 1, '2020-04-17 15:06:51'),
(4, 'admin', 'fuck this shit', 'truc_dong', 'text', 1, '2020-04-17 15:06:57'),
(5, 'admin', 'o', 'dai_ga_vl', 'text', 1, '2020-04-17 15:11:42'),
(6, 'dai_ga_vl', '?', 'admin', 'text', 1, '2020-04-17 16:13:33'),
(7, 'admin', 'sd', 'dai_ga_vl', 'text', 1, '2020-04-18 02:14:54'),
(8, 'admin', 'p', 'dai_ga_vl', 'text', 1, '2020-04-18 02:16:15'),
(9, 'admin', 'p', 'dai_ga_vl', 'text', 1, '2020-04-18 02:16:41'),
(10, 'admin', 'question', 'dai_ga_vl', 'text', 1, '2020-04-18 02:28:42'),
(11, 'admin', 'asd', 'dai_ga_vl', 'text', 1, '2020-04-18 02:31:20'),
(12, 'admin', 'u', 'dai_ga_vl', 'text', 1, '2020-04-18 02:32:33'),
(13, 'admin', 'asd', 'dai_ga_vl', 'text', 1, '2020-04-18 02:33:30'),
(14, 'admin', 'a', 'truc_dong', 'text', 1, '2020-04-18 02:36:10'),
(15, 'admin', 'hello', 'ngoctrinhsexy', 'text', 1, '2020-04-18 02:48:25'),
(16, 'admin', 'w', 'truc_dong', 'text', 1, '2020-04-18 02:51:09'),
(17, 'admin', 'we', 'dai_ga_vl', 'text', 1, '2020-04-18 02:52:55'),
(18, 'admin', 'hi', 'ngoctrinhsexy', 'text', 1, '2020-04-18 02:55:35'),
(19, 'admin', 'shi', 'ngoctrinhsexy', 'text', 1, '2020-04-18 02:56:51'),
(20, 'admin', 'we', 'truc_dong', 'text', 1, '2020-04-18 02:56:54'),
(21, 'admin', 'wtff', 'dai_ga_vl', 'text', 1, '2020-04-18 02:56:59'),
(22, 'dai_ga_vl', 'fuck you', 'admin', 'text', 1, '2020-04-18 03:08:41'),
(23, 'dai_ga_vl', 'hey', 'admin', 'text', 1, '2020-04-18 03:09:00'),
(24, 'dai_ga_vl', 'ok', 'admin', 'text', 1, '2020-04-18 03:09:20'),
(25, 'dai_ga_vl', 'haha', 'admin', 'text', 1, '2020-04-18 03:09:23'),
(26, 'admin', 'ko', 'truc_dong', 'text', 1, '2020-04-18 03:11:40'),
(27, 'dai_ga_vl', 'ok', 'admin', 'text', 1, '2020-04-18 03:11:51'),
(28, 'dai_ga_vl', 'connect', 'admin', 'text', 1, '2020-04-18 03:15:59'),
(29, 'dai_ga_vl', 'sh', 'admin', 'text', 1, '2020-04-18 03:16:58'),
(30, 'dai_ga_vl', 'aqwew', 'admin', 'text', 1, '2020-04-18 03:20:17'),
(31, 'admin', 'asd', 'truc_dong', 'text', 1, '2020-04-18 03:30:31'),
(32, 'truc_dong', 'ok', 'admin', 'text', 1, '2020-04-18 03:30:54'),
(33, 'truc_dong', 'huy', 'admin', 'text', 1, '2020-04-18 03:31:19'),
(34, 'truc_dong', 'yuh', 'admin', 'text', 1, '2020-04-18 03:32:02'),
(35, 'truc_dong', 'sd', 'admin', 'text', 1, '2020-04-18 03:34:21'),
(36, 'truc_dong', 'ewr', 'admin', 'text', 1, '2020-04-18 03:34:29'),
(37, 'truc_dong', 'alo', 'admin', 'text', 1, '2020-04-18 03:34:37'),
(38, 'admin', 'h?', 'truc_dong', 'text', 1, '2020-04-18 03:38:15'),
(39, 'truc_dong', 'shit', 'admin', 'text', 1, '2020-04-18 03:38:28'),
(40, 'admin', 'fuck', 'dai_ga_vl', 'text', 1, '2020-04-18 03:38:39'),
(41, 'truc_dong', 'lets go', 'admin', 'text', 1, '2020-04-18 03:38:54'),
(42, 'dai_ga_vl', 'lo', 'admin', 'text', 1, '2020-04-18 03:41:13'),
(43, 'dai_ga_vl', 'c', 'admin', 'text', 1, '2020-04-18 03:41:24'),
(44, 'truc_dong', 'r', 'admin', 'text', 1, '2020-04-18 03:48:26'),
(45, 'dai_ga_vl', 'Buoc qu doi nhau', 'admin', 'text', 1, '2020-04-18 04:07:35'),
(46, 'admin', 'dafug', 'dai_ga_vl', 'text', 1, '2020-04-18 04:07:48'),
(47, 'dai_ga_vl', 'Dm', 'truc_dong', 'text', 1, '2020-04-18 04:09:04'),
(48, 'dai_ga_vl', 'Cc', 'admin', 'text', 1, '2020-04-18 04:09:55'),
(49, 'admin', 'dm', 'dai_ga_vl', 'text', 1, '2020-04-19 12:30:54'),
(50, 'admin', 'alo', 'ngoctrinhsexy', 'text', 1, '2020-04-20 05:53:55'),
(51, 'admin', 'oc', 'ngoctrinhsexy', 'text', 1, '2020-04-20 05:56:31'),
(52, 'admin', 'we', 'truc_dong', 'text', 1, '2020-04-20 05:56:38'),
(53, 'truc_dong', 'hello holle', 'admin', 'text', 1, '2020-04-20 06:42:18'),
(54, 'truc_dong', 'bonjour', 'admin', 'text', 1, '2020-04-20 06:43:14'),
(55, 'admin', 'hello back', 'truc_dong', 'text', 1, '2020-04-20 06:45:09'),
(56, 'admin', 'back again', 'truc_dong', 'text', 1, '2020-04-20 06:45:43'),
(57, 'admin', 'img/vghcsdpzii.jpg', 'dai_ga_vl', 'img', 1, '2020-04-20 06:55:20'),
(58, 'admin', 'hya', 'dai_ga_vl', 'text', 1, '2020-04-20 07:16:32'),
(59, 'truc_dong', 'img/lvzhpiqdbs.jpg', 'admin', 'img', 1, '2020-04-20 07:19:12'),
(60, 'admin', 'Ghe', 'truc_dong', 'text', 1, '2020-04-22 10:00:04'),
(61, 'admin', 'ttttt', 'dai_ga_vl', 'text', 1, '2020-04-22 10:00:51'),
(62, 'admin', 'dep', 'truc_dong', 'text', 1, '2020-04-22 10:01:35'),
(63, 'admin', 'uhgt', 'ngoctrinhsexy', 'text', 1, '2020-04-22 10:03:02'),
(64, 'admin', 's', 'truc_dong', 'text', 1, '2020-04-22 10:05:29'),
(65, 'admin', 'r', 'ngoctrinhsexy', 'text', 1, '2020-04-22 10:08:28'),
(66, 'admin', 'w', 'ngoctrinhsexy', 'text', 1, '2020-04-22 10:11:35'),
(67, 'admin', 't', 'dai_ga_vl', 'text', 1, '2020-04-22 10:14:50'),
(68, 'admin', '5', 'truc_dong', 'text', 1, '2020-04-22 10:16:37'),
(69, 'admin', 's', 'truc_dong', 'text', 1, '2020-04-22 10:17:20'),
(70, 'admin', 'j', 'truc_dong', 'text', 1, '2020-04-22 10:20:30'),
(71, 'admin', 'hi', 'ngoctrinhsexy', 'text', 1, '2020-04-22 10:23:35'),
(72, 'admin', 't', 'truc_dong', 'text', 1, '2020-04-22 10:23:44'),
(73, 'admin', 'y', 'truc_dong', 'text', 1, '2020-04-22 10:23:50'),
(74, 'admin', 't', 'dai_ga_vl', 'text', 1, '2020-04-29 02:53:43'),
(75, 'admin', 'apok', 'dai_ga_vl', 'text', 1, '2020-05-27 07:21:19'),
(76, 'dai_ga_vl', 'kjdfhaslfkdjhasf', 'admin', 'text', 1, '2020-05-27 08:53:13'),
(77, 'admin', 'sdfsdf', 'dai_ga_vl', 'text', 1, '2020-05-27 08:53:46'),
(78, 'dai_ga_vl', 'sdalfkjas', 'admin', 'text', 1, '2020-05-27 08:53:52'),
(79, 'dai_ga_vl', 'img/xpulvfloei.jpg', 'admin', 'img', 1, '2020-05-27 08:54:00'),
(80, 'admin', 'uhuhu', 'truc_dong', 'text', 1, '2020-05-27 08:54:19'),
(81, 'admin', 'img/nkvohzobzs.png', 'dai_ga_vl', 'img', 1, '2020-05-27 08:55:09'),
(82, 'dai_ga_vl', 'fghfd', 'admin', 'text', 1, '2020-05-27 08:55:31'),
(83, 'dai_ga_vl', 'fjlksahflkja', 'admin', 'text', 1, '2020-05-27 08:55:35'),
(84, 'dai_ga_vl', 'lkdf', 'admin', 'text', 1, '2020-05-27 08:55:37'),
(85, 'dai_ga_vl', 'dfl;kj', 'admin', 'text', 1, '2020-05-27 08:55:38'),
(86, 'admin', 'lo', 'dai_ga_vl', 'text', 1, '2020-06-05 03:52:29'),
(87, 'admin', 'ok', 'dai_ga_vl', 'text', 1, '2020-06-05 03:53:12'),
(88, 'admin', 'alo', 'dai_ga_vl', 'text', 1, '2020-06-05 04:05:15'),
(89, 'admin', 'wdw', 'truc_dong', 'text', 1, '2020-06-05 04:06:17'),
(90, 'admin', 'w', 'truc_dong', 'text', 1, '2020-06-05 04:06:23'),
(91, 'admin', 'test1', 'ngoctrinhsexy', 'text', 1, '2020-06-05 04:10:29'),
(92, 'admin', 'test2', 'ngoctrinhsexy', 'text', 1, '2020-06-05 04:17:00'),
(93, 'admin', 'test4', 'dai_ga_vl', 'text', 1, '2020-06-05 04:17:11'),
(94, 'admin', 'pkiuhj', 'truc_dong', 'text', 1, '2020-06-06 01:50:31'),
(95, 'admin', 'img/qczeeohkqn.png', 'ngoctrinhsexy', 'img', 1, '2020-06-06 01:59:08'),
(96, 'admin', 'img/aodhxkmjbv.jpg', 'ngoctrinhsexy', 'img', 1, '2020-06-06 02:28:03'),
(97, 'admin', 's', 'truc_dong', 'text', 1, '2020-06-06 02:40:59'),
(98, 'dai_ga_vl', 'what', 'truc_dong', 'text', 0, '2020-06-12 09:49:32'),
(99, 'admin', 'lo', 'dai_ga_vl', 'text', 1, '2020-06-12 12:33:44');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId_1` (`userId_1`),
  ADD KEY `userId_2` (`userId_2`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creatorid` (`creatorid`);

--
-- Indexes for table `groups_members_detail`
--
ALTER TABLE `groups_members_detail`
  ADD KEY `id` (`id`),
  ADD KEY `userid` (`userid`);

--
-- Indexes for table `groups_messages_detail`
--
ALTER TABLE `groups_messages_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `groupId` (`groupId`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_messages_detail`
--
ALTER TABLE `user_messages_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_username` (`sender_username`),
  ADD KEY `rcv_username` (`rcv_username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `friends`
--
ALTER TABLE `friends`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `groups_messages_detail`
--
ALTER TABLE `groups_messages_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user_messages_detail`
--
ALTER TABLE `user_messages_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `friends`
--
ALTER TABLE `friends`
  ADD CONSTRAINT `friends_ibfk_1` FOREIGN KEY (`userId_1`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`userId_2`) REFERENCES `users` (`id`);

--
-- Constraints for table `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`creatorid`) REFERENCES `users` (`id`);

--
-- Constraints for table `groups_members_detail`
--
ALTER TABLE `groups_members_detail`
  ADD CONSTRAINT `groups_members_detail_ibfk_1` FOREIGN KEY (`id`) REFERENCES `groups` (`id`),
  ADD CONSTRAINT `groups_members_detail_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`id`);

--
-- Constraints for table `groups_messages_detail`
--
ALTER TABLE `groups_messages_detail`
  ADD CONSTRAINT `groups_messages_detail_ibfk_1` FOREIGN KEY (`groupId`) REFERENCES `groups` (`id`),
  ADD CONSTRAINT `groups_messages_detail_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `user_messages_detail`
--
ALTER TABLE `user_messages_detail`
  ADD CONSTRAINT `user_messages_detail_ibfk_1` FOREIGN KEY (`sender_username`) REFERENCES `users` (`username`),
  ADD CONSTRAINT `user_messages_detail_ibfk_2` FOREIGN KEY (`rcv_username`) REFERENCES `users` (`username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
