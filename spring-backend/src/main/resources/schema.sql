-- CampusHub College ERP & Management Database Schema (PostgreSQL)

-- 1. Users table (Authentication & Roles)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(60) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('FACULTY', 'STUDENT', 'ADMIN')),
    avatar_url VARCHAR(255),
    phone_number VARCHAR(20),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Departments table
CREATE TABLE IF NOT EXISTS departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    head_of_department VARCHAR(255),
    description VARCHAR(500)
);

-- 3. Student Profiles table
CREATE TABLE IF NOT EXISTS student_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    roll_number VARCHAR(30) NOT NULL UNIQUE,
    department_id BIGINT NOT NULL REFERENCES departments(id),
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    section VARCHAR(5) NOT NULL,
    attendance_percentage NUMERIC(5, 2) NOT NULL CHECK (attendance_percentage BETWEEN 0 AND 100),
    average_marks NUMERIC(5, 2) CHECK (average_marks BETWEEN 0 AND 100),
    date_of_birth DATE,
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(20),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Subject Marks table
CREATE TABLE IF NOT EXISTS subject_marks (
    id BIGSERIAL PRIMARY KEY,
    student_profile_id BIGINT NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) NOT NULL,
    credits INTEGER NOT NULL CHECK (credits BETWEEN 1 AND 5),
    internal_marks NUMERIC(5, 2) NOT NULL CHECK (internal_marks BETWEEN 0 AND 100),
    external_marks NUMERIC(5, 2) NOT NULL CHECK (external_marks BETWEEN 0 AND 100),
    total_marks NUMERIC(5, 2) NOT NULL CHECK (total_marks BETWEEN 0 AND 100),
    grade VARCHAR(5),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_student_subject UNIQUE (student_profile_id, subject_code)
);

-- 5. Timetable Entries table
CREATE TABLE IF NOT EXISTS timetable_entries (
    id BIGSERIAL PRIMARY KEY,
    department_id BIGINT NOT NULL REFERENCES departments(id),
    semester INTEGER NOT NULL,
    section VARCHAR(5) NOT NULL,
    day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    course_code VARCHAR(20) NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    instructor_name VARCHAR(100) NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    is_lab BOOLEAN DEFAULT FALSE
);

-- 6. Fee Records table
CREATE TABLE IF NOT EXISTS fee_records (
    id BIGSERIAL PRIMARY KEY,
    student_profile_id BIGINT NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    academic_year VARCHAR(10) NOT NULL,
    semester INTEGER NOT NULL,
    tuition_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    lab_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    library_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    development_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    amount_paid NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PAID', 'PARTIAL', 'PENDING')),
    due_date DATE NOT NULL,
    transaction_id VARCHAR(64),
    payment_method VARCHAR(30),
    paid_at TIMESTAMP WITHOUT TIME ZONE
);

-- 7. Mock Test Uploads table
CREATE TABLE IF NOT EXISTS mock_test_uploads (
    id BIGSERIAL PRIMARY KEY,
    test_title VARCHAR(150) NOT NULL,
    subject_code VARCHAR(20) NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    semester INTEGER NOT NULL,
    department_id BIGINT NOT NULL REFERENCES departments(id),
    file_name VARCHAR(255) NOT NULL,
    file_size_kb BIGINT,
    file_type VARCHAR(50),
    download_url VARCHAR(500),
    status VARCHAR(20) NOT NULL CHECK (status IN ('ACTIVE', 'SCHEDULED', 'COMPLETED', 'DRAFT')),
    duration_minutes INTEGER,
    total_marks INTEGER,
    uploaded_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high-frequency queries
CREATE INDEX IF NOT EXISTS idx_student_department ON student_profiles(department_id);
CREATE INDEX IF NOT EXISTS idx_student_attendance ON student_profiles(attendance_percentage);
CREATE INDEX IF NOT EXISTS idx_timetable_lookup ON timetable_entries(department_id, semester, section, day_of_week);
CREATE INDEX IF NOT EXISTS idx_fee_student ON fee_records(student_profile_id, status);
