module.exports = {
  departments: { table: 'departments', columns: ['name', 'description'], searchable: ['name'] },
  doctors: {
    table: 'doctors',
    columns: ['name', 'specialization', 'phone', 'email', 'department_id', 'fee'],
    select: 'SELECT t.*, d.name AS department_name FROM doctors t LEFT JOIN departments d ON d.id = t.department_id',
    searchable: ['t.name', 't.specialization'],
  },
  patients: {
    table: 'patients',
    columns: ['name', 'gender', 'dob', 'phone', 'email', 'address', 'blood_group', 'allergies'],
    searchable: ['name', 'phone', 'email'],
  },
  records: {
    table: 'medical_records',
    columns: ['patient_id', 'doctor_id', 'appointment_id', 'vitals', 'diagnosis', 'treatment_plan', 'notes'],
    select: `SELECT t.*, p.name AS patient_name, d.name AS doctor_name FROM medical_records t
             JOIN patients p ON p.id = t.patient_id JOIN doctors d ON d.id = t.doctor_id`,
    searchable: ['p.name', 't.diagnosis'],
  },
  prescriptions: {
    table: 'prescriptions',
    columns: ['patient_id', 'doctor_id', 'medicine_id', 'dosage', 'frequency', 'duration', 'status'],
    select: `SELECT t.*, p.name AS patient_name, d.name AS doctor_name, m.name AS medicine_name FROM prescriptions t
             JOIN patients p ON p.id = t.patient_id JOIN doctors d ON d.id = t.doctor_id JOIN medicines m ON m.id = t.medicine_id`,
    searchable: ['p.name', 'm.name'],
  },
  'lab-orders': {
    table: 'lab_orders',
    columns: ['patient_id', 'doctor_id', 'test_name', 'status', 'result'],
    select: `SELECT t.*, p.name AS patient_name, d.name AS doctor_name FROM lab_orders t
             JOIN patients p ON p.id = t.patient_id JOIN doctors d ON d.id = t.doctor_id`,
    searchable: ['p.name', 't.test_name'],
  },
  medicines: {
    table: 'medicines',
    columns: ['name', 'category', 'stock', 'unit_price', 'expiry_date', 'reorder_level'],
    searchable: ['name', 'category'],
  },
  invoices: {
    table: 'invoices',
    columns: ['patient_id', 'description', 'amount', 'status', 'payment_method'],
    select: 'SELECT t.*, p.name AS patient_name FROM invoices t JOIN patients p ON p.id = t.patient_id',
    searchable: ['p.name', 't.description'],
  },
};
