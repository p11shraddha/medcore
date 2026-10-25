// Field definitions drive the generic list/form page for every module.
// type: text | number | date | time | textarea | select (options) | ref (resource, label)
const ref = (name, label, resource) => ({ name, label, type: 'ref', resource, required: true });

export const modules = {
  departments: {
    title: 'Departments',
    fields: [{ name: 'name', label: 'Name', required: true }, { name: 'description', label: 'Description', type: 'textarea' }],
    columns: ['name', 'description'],
  },
  doctors: {
    title: 'Doctors',
    fields: [
      { name: 'name', label: 'Name', required: true }, { name: 'specialization', label: 'Specialization' },
      { name: 'phone', label: 'Phone' }, { name: 'email', label: 'Email' },
      { ...ref('department_id', 'Department', 'departments'), required: false }, { name: 'fee', label: 'Fee (₹)', type: 'number' },
    ],
    columns: ['name', 'specialization', 'department_name', 'phone', 'fee'],
  },
  patients: {
    title: 'Patients',
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
      { name: 'dob', label: 'Date of birth', type: 'date' }, { name: 'phone', label: 'Phone' },
      { name: 'email', label: 'Email' }, { name: 'blood_group', label: 'Blood group', type: 'select', options: ['A+','A-','B+','B-','O+','O-','AB+','AB-'] },
      { name: 'allergies', label: 'Allergies' }, { name: 'address', label: 'Address', type: 'textarea' },
    ],
    columns: ['name', 'gender', 'dob', 'phone', 'blood_group', 'allergies'],
  },
  appointments: {
    title: 'Appointments',
    fields: [
      ref('patient_id', 'Patient', 'patients'), ref('doctor_id', 'Doctor', 'doctors'),
      { name: 'appointment_date', label: 'Date', type: 'date', required: true },
      { name: 'appointment_time', label: 'Time', type: 'time', required: true },
      { name: 'reason', label: 'Reason' },
    ],
    columns: ['patient_name', 'doctor_name', 'appointment_date', 'appointment_time', 'reason', 'status'],
    statusFlow: { PENDING: ['CONFIRMED', 'CANCELLED'], CONFIRMED: ['IN_PROGRESS', 'CANCELLED'], IN_PROGRESS: ['COMPLETED'] },
  },
  records: {
    title: 'Medical Records',
    fields: [
      ref('patient_id', 'Patient', 'patients'), ref('doctor_id', 'Doctor', 'doctors'),
      { name: 'vitals', label: 'Vitals (BP, pulse, temp)' }, { name: 'diagnosis', label: 'Diagnosis' },
      { name: 'treatment_plan', label: 'Treatment plan', type: 'textarea' }, { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
    columns: ['patient_name', 'doctor_name', 'vitals', 'diagnosis', 'created_at'],
  },
  prescriptions: {
    title: 'Prescriptions',
    fields: [
      ref('patient_id', 'Patient', 'patients'), ref('doctor_id', 'Doctor', 'doctors'), ref('medicine_id', 'Medicine', 'medicines'),
      { name: 'dosage', label: 'Dosage' }, { name: 'frequency', label: 'Frequency' }, { name: 'duration', label: 'Duration' },
      { name: 'status', label: 'Status', type: 'select', options: ['PENDING', 'DISPENSED'] },
    ],
    columns: ['patient_name', 'doctor_name', 'medicine_name', 'dosage', 'frequency', 'duration', 'status'],
  },
  'lab-orders': {
    title: 'Lab Orders',
    fields: [
      ref('patient_id', 'Patient', 'patients'), ref('doctor_id', 'Doctor', 'doctors'),
      { name: 'test_name', label: 'Test name', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['ORDERED', 'SAMPLE_COLLECTED', 'RESULT_UPLOADED', 'APPROVED'] },
      { name: 'result', label: 'Result', type: 'textarea' },
    ],
    columns: ['patient_name', 'doctor_name', 'test_name', 'status', 'result'],
  },
  medicines: {
    title: 'Pharmacy',
    fields: [
      { name: 'name', label: 'Name', required: true }, { name: 'category', label: 'Category' },
      { name: 'stock', label: 'Stock', type: 'number' }, { name: 'unit_price', label: 'Unit price (₹)', type: 'number' },
      { name: 'expiry_date', label: 'Expiry date', type: 'date' }, { name: 'reorder_level', label: 'Reorder level', type: 'number' },
    ],
    columns: ['name', 'category', 'stock', 'unit_price', 'expiry_date', 'reorder_level'],
  },
  invoices: {
    title: 'Billing',
    fields: [
      ref('patient_id', 'Patient', 'patients'), { name: 'description', label: 'Description' },
      { name: 'amount', label: 'Amount (₹)', type: 'number', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['UNPAID', 'PAID', 'CANCELLED'] },
      { name: 'payment_method', label: 'Payment method', type: 'select', options: ['Cash', 'Card', 'UPI'] },
    ],
    columns: ['patient_name', 'description', 'amount', 'status', 'payment_method', 'created_at'],
  },
};
