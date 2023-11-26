-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Nov 26, 2023 at 10:26 AM
-- Server version: 5.7.39
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bucket-tasks`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_balls`
--

CREATE TABLE `tbl_balls` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `capacity` float(10,2) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_balls`
--

INSERT INTO `tbl_balls` (`id`, `name`, `slug`, `capacity`, `status`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'Pink', 'BL1124202358748', 2.50, 1, 0, '2023-11-24 17:23:56', '2023-11-24 17:25:28'),
(2, 'Red', 'BL1124202380366', 2.00, 1, 0, '2023-11-24 17:24:06', '2023-11-24 17:24:06'),
(3, 'Blue', 'BL1124202322231', 1.00, 1, 0, '2023-11-24 17:24:12', '2023-11-24 17:24:12'),
(4, 'Orange', 'BL112420238779', 0.80, 1, 0, '2023-11-24 17:24:25', '2023-11-24 17:24:25'),
(5, 'Green', 'BL1124202375291', 0.50, 1, 0, '2023-11-24 17:24:31', '2023-11-24 17:24:31');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_buckets`
--

CREATE TABLE `tbl_buckets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `capacity` bigint(20) UNSIGNED NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_buckets`
--

INSERT INTO `tbl_buckets` (`id`, `name`, `slug`, `capacity`, `status`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'Bucket A', 'BT1124202383675', 20, 1, 0, '2023-11-24 17:22:49', '2023-11-24 17:22:55'),
(2, 'Bucket B', 'BT1124202365593', 18, 1, 0, '2023-11-24 17:23:07', '2023-11-24 17:23:07'),
(3, 'Bucket C', 'BT1124202360544', 12, 1, 0, '2023-11-24 17:23:21', '2023-11-24 17:23:21'),
(4, 'Bucket D', 'BT1124202348798', 10, 1, 0, '2023-11-24 17:23:27', '2023-11-24 17:23:27'),
(5, 'Bucket E', 'BT1124202396590', 8, 1, 0, '2023-11-24 17:23:38', '2023-11-24 17:23:38');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_bucket_suggestions`
--

CREATE TABLE `tbl_bucket_suggestions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `buckets` longtext,
  `balls` longtext,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_balls`
--
ALTER TABLE `tbl_balls`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tbl_balls_slug_unique` (`slug`);

--
-- Indexes for table `tbl_buckets`
--
ALTER TABLE `tbl_buckets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tbl_buckets_slug_unique` (`slug`);

--
-- Indexes for table `tbl_bucket_suggestions`
--
ALTER TABLE `tbl_bucket_suggestions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_balls`
--
ALTER TABLE `tbl_balls`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tbl_buckets`
--
ALTER TABLE `tbl_buckets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tbl_bucket_suggestions`
--
ALTER TABLE `tbl_bucket_suggestions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
