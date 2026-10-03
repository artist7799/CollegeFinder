-- CollegeFinder Database Schema
-- Database: MySQL

CREATE DATABASE IF NOT EXISTS collegefinder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE collegefinder;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Colleges Table
CREATE TABLE IF NOT EXISTS colleges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    address TEXT,
    college_type VARCHAR(50),
    university VARCHAR(255),
    established_year INT,
    website VARCHAR(255),
    email VARCHAR(120),
    phone VARCHAR(50),
    logo VARCHAR(500),
    rating FLOAT DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    college_id INT NOT NULL,
    course_name VARCHAR(150) NOT NULL,
    degree VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    fees FLOAT NOT NULL,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Placements Table
CREATE TABLE IF NOT EXISTS placements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    college_id INT NOT NULL,
    average_package FLOAT,
    highest_package FLOAT,
    placement_percentage FLOAT,
    recruiting_companies TEXT,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    college_id INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    college_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_college_favorite (user_id, college_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
