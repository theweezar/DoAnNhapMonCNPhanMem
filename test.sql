-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 18, 2020 at 06:16 AM
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
  `recent` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `friends`
--

INSERT INTO `friends` (`id`, `userId_1`, `userId_2`, `recent`) VALUES
(1, 1, 3, '2020-04-18 04:09:55'),
(2, 4, 1, '2020-04-18 02:56:51'),
(3, 1, 5, '2020-04-18 03:48:26'),
(4, 3, 5, '2020-04-18 04:09:04');

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
(1, 'admin', 'Adminpro3010', 'minhduc@gmail.com', 'Minh Duc', 1),
(3, 'dai_ga_vl', 'Daigavl3008', 'Dai@gmail.com', 'Phan Dai', 1),
(4, 'ngoctrinhsexy', 'Ngoctrinhsexy90', 'ngoctrinh@gmail.com', 'Ngoc Trinh', 0),
(5, 'truc_dong', 'Trucdong99', 'trucdong@gmail.com', 'Truc Dong', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_messages_detail`
--

CREATE TABLE `user_messages_detail` (
  `id` int(11) NOT NULL,
  `sender_username` varchar(20) NOT NULL,
  `content` text NOT NULL,
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
(15, 'admin', 'hello', 'ngoctrinhsexy', 'text', 0, '2020-04-18 02:48:25'),
(16, 'admin', 'w', 'truc_dong', 'text', 1, '2020-04-18 02:51:09'),
(17, 'admin', 'we', 'dai_ga_vl', 'text', 1, '2020-04-18 02:52:55'),
(18, 'admin', 'hi', 'ngoctrinhsexy', 'text', 0, '2020-04-18 02:55:35'),
(19, 'admin', 'shi', 'ngoctrinhsexy', 'text', 0, '2020-04-18 02:56:51'),
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
(38, 'admin', 'hú', 'truc_dong', 'text', 1, '2020-04-18 03:38:15'),
(39, 'truc_dong', 'shit', 'admin', 'text', 1, '2020-04-18 03:38:28'),
(40, 'admin', 'fuck', 'dai_ga_vl', 'text', 1, '2020-04-18 03:38:39'),
(41, 'truc_dong', 'lets go', 'admin', 'text', 1, '2020-04-18 03:38:54'),
(42, 'dai_ga_vl', 'lo', 'admin', 'text', 1, '2020-04-18 03:41:13'),
(43, 'dai_ga_vl', 'c', 'admin', 'text', 1, '2020-04-18 03:41:24'),
(44, 'truc_dong', 'r', 'admin', 'text', 1, '2020-04-18 03:48:26'),
(45, 'dai_ga_vl', 'Buoc qu doi nhau', 'admin', 'text', 1, '2020-04-18 04:07:35'),
(46, 'admin', 'dafug', 'dai_ga_vl', 'text', 1, '2020-04-18 04:07:48'),
(47, 'dai_ga_vl', 'Dm', 'truc_dong', 'text', 0, '2020-04-18 04:09:04'),
(48, 'dai_ga_vl', 'Cc', 'admin', 'text', 1, '2020-04-18 04:09:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`id`);

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
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `friends`
--
ALTER TABLE `friends`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_messages_detail`
--
ALTER TABLE `user_messages_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
