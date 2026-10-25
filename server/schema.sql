DROP DATABASE IF EXISTS medcore;
CREATE DATABASE medcore;
USE medcore;

CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  specialization VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  department_id INT,
  fee DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  gender ENUM('Male','Female','Other'),
  dob DATE,
  phone VARCHAR(20),
  email VARCHAR(100),
  address VARCHAR(255),
  blood_group VARCHAR(5),
  allergies VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  reason VARCHAR(255),
  status ENUM('PENDING','CONFIRMED','IN_PROGRESS','COMPLETED','CANCELLED') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  INDEX idx_doctor_slot (doctor_id, appointment_date, appointment_time)
);

CREATE TABLE medical_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_id INT,
  vitals VARCHAR(255),
  diagnosis VARCHAR(255),
  treatment_plan TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
);

CREATE TABLE medicines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  stock INT DEFAULT 0,
  unit_price DECIMAL(10,2) DEFAULT 0,
  expiry_date DATE,
  reorder_level INT DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prescriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  medicine_id INT NOT NULL,
  dosage VARCHAR(50),
  frequency VARCHAR(50),
  duration VARCHAR(50),
  status ENUM('PENDING','DISPENSED') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
);

CREATE TABLE lab_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  test_name VARCHAR(100) NOT NULL,
  status ENUM('ORDERED','SAMPLE_COLLECTED','RESULT_UPLOADED','APPROVED') DEFAULT 'ORDERED',
  result TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

CREATE TABLE invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  description VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('UNPAID','PAID','CANCELLED') DEFAULT 'UNPAID',
  payment_method VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Sample data
INSERT INTO departments (name, description) VALUES
('Cardiology','Heart and vascular care'),('Orthopedics','Bones and joints'),
('Pediatrics','Child health'),('General Medicine','Primary care');

INSERT INTO doctors (name, specialization, phone, email, department_id, fee) VALUES
('Dr. Anil Mehta','Cardiologist','9800000001','anil@medcore.in',1,800),
('Dr. Priya Sharma','Orthopedic Surgeon','9800000002','priya@medcore.in',2,700),
('Dr. Rahul Nair','Pediatrician','9800000003','rahul@medcore.in',3,500),
('Dr. Sneha Iyer','Physician','9800000004','sneha@medcore.in',4,400);

INSERT INTO patients (name, gender, dob, phone, email, address, blood_group, allergies) VALUES
('Ravi Kumar','Male','1985-04-12','9900000001','ravi@mail.com','Bengaluru','B+','Penicillin'),
('Anita Desai','Female','1992-09-30','9900000002','anita@mail.com','Mumbai','O+',NULL),
('Mohammed Arif','Male','1978-01-05','9900000003','arif@mail.com','Hyderabad','A-',NULL),
('Kavya Reddy','Female','2015-06-21','9900000004','kavya@mail.com','Chennai','AB+','Peanuts');

INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES
(1,1,CURDATE(),'10:00','Chest pain','CONFIRMED'),
(2,4,CURDATE(),'11:30','Fever','PENDING'),
(3,2,CURDATE() - INTERVAL 1 DAY,'09:00','Knee pain','COMPLETED'),
(4,3,CURDATE() - INTERVAL 2 DAY,'16:00','Vaccination','COMPLETED');

INSERT INTO medical_records (patient_id, doctor_id, appointment_id, vitals, diagnosis, treatment_plan) VALUES
(3,2,3,'BP 130/85, Pulse 78','Osteoarthritis (knee)','Physiotherapy, pain relief'),
(4,3,4,'Temp 98.6F, Wt 22kg','Routine immunisation','MMR booster given');

INSERT INTO medicines (name, category, stock, unit_price, expiry_date, reorder_level) VALUES
('Paracetamol 500mg','Analgesic',500,2.00,'2027-12-31',100),
('Amoxicillin 250mg','Antibiotic',8,6.50,'2026-11-15',20),
('Atorvastatin 10mg','Statin',150,9.00,'2027-06-30',30),
('Ibuprofen 400mg','NSAID',60,3.50,'2026-10-20',25);

INSERT INTO prescriptions (patient_id, doctor_id, medicine_id, dosage, frequency, duration, status) VALUES
(3,2,4,'400mg','Twice daily','5 days','DISPENSED'),
(1,1,3,'10mg','Once at night','30 days','PENDING');

INSERT INTO lab_orders (patient_id, doctor_id, test_name, status, result) VALUES
(1,1,'Lipid Profile','ORDERED',NULL),
(3,2,'X-Ray Knee','APPROVED','Mild joint space narrowing');

INSERT INTO invoices (patient_id, description, amount, status, payment_method) VALUES
(3,'Consultation + X-Ray',1500,'PAID','UPI'),
(4,'Vaccination',900,'PAID','Cash'),
(1,'Consultation',800,'UNPAID',NULL);
