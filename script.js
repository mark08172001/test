document.addEventListener('DOMContentLoaded', () => {
    let authenticated = false;
    
    const authForm = document.getElementById('login-form');
    const content = document.getElementById('content');
    const authSection = document.getElementById('auth');

    const form = document.getElementById('form');
    const patientList = document.getElementById('patients');
    const patientId = document.getElementById('patientId');
    const lastName = document.getElementById('last_name');
    const firstName = document.getElementById('first_name');
    const middleName = document.getElementById('middle_name');
    const suffixName = document.getElementById('suffix_name');
    const dateOfBirth = document.getElementById('date_of_birth');
    const address = document.getElementById('address');

    const admitForm = document.getElementById('admit-form');
    const patientSelect = document.getElementById('patient-select');
    const admitDate = document.getElementById('admit-date');
    const ward = document.getElementById('ward');
    const admissionList = document.getElementById('admissions');
    const dischargeForm = document.getElementById('discharge-form');
    const admissionSelect = document.getElementById('admission-select');
    const dischargeDate = document.getElementById('discharge-date');

    // Authentication
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (username === 'admin' && password === 'password') {
            authenticated = true;
            authSection.style.display = 'none';
            content.style.display = 'block';
            fetchPatients();
            fetchAdmissions();
        } else {
            alert('Invalid credentials');
        }
    });

    // Fetch patients
    function fetchPatients() {
        fetch('crud.php?patients=true')
            .then(response => response.json())
            .then(data => {
                patients = data;
                renderPatients();
                updatePatientSelect();
            });
    }

    // Fetch admissions
    function fetchAdmissions() {
        fetch('crud.php?admissions=true')
            .then(response => response.json())
            .then(data => {
                admissions = data;
                renderAdmissions();
                updateAdmissionSelect();
            });
    }

    // Patient Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const patient = {
            id: patientId.value ? parseInt(patientId.value) : null,
            last_name: lastName.value,
            first_name: firstName.value,
            middle_name: middleName.value,
            suffix_name: suffixName.value,
            date_of_birth: dateOfBirth.value,
            address: address.value,
        };
        fetch('crud.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `patient=${JSON.stringify(patient)}`,
        }).then(() => {
            resetForm();
            fetchPatients();
        });
    });

    // Admission Form Submission
    admitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const admission = {
            patient_id: parseInt(patientSelect.value),
            admit_date: admitDate.value,
            ward: ward.value,
        };
        fetch('crud.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `admission=${JSON.stringify(admission)}`,
        }).then(() => {
            resetAdmissionForm();
            fetchAdmissions();
        });
    });

    // Discharge Form Submission
    dischargeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const discharge = {
            id: parseInt(admissionSelect.value),
            discharge_date: dischargeDate.value,
        };
        fetch('crud.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `discharge=${JSON.stringify(discharge)}`,
        }).then(() => {
            resetDischargeForm();
            fetchAdmissions();
        });
    });

    function renderPatients() {
        patientList.innerHTML = '';
        patients.forEach(patient => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${patient.last_name}</td>
                <td>${patient.first_name}</td>
                <td>${patient.middle_name}</td>
                <td>${patient.suffix_name}</td>
                <td>${patient.date_of_birth}</td>
                <td>${patient.address}</td>
                <td class="actions">
                    <button onclick="editPatient(${patient.id})">Edit</button>
                    <button onclick="deletePatient(${patient.id})">Delete</button>
                </td>
            `;
            patientList.appendChild(row);
        });
    }

    function renderAdmissions() {
        const today = new Date().toISOString().split('T')[0];
        admissionList.innerHTML = '';
        admissions
            .filter(admission => admission.admit_date.startsWith(today))
            .forEach(admission => {
                const patient = patients.find(p => p.id === admission.patient_id);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${patient.first_name} ${patient.last_name}</td>
                    <td>${admission.admit_date}</td>
                    <td>${admission.ward}</td>
                    <td class="actions">
                        <button onclick="dischargeAdmission(${admission.id})">Discharge</button>
                    </td>
                `;
                admissionList.appendChild(row);
            });
    }

    function updatePatientSelect() {
        patientSelect.innerHTML = '';
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id;
            option.textContent = `${patient.first_name} ${patient.last_name}`;
            patientSelect.appendChild(option);
        });
    }

    function updateAdmissionSelect() {
        admissionSelect.innerHTML = '';
        admissions
            .filter(admission => !admission.discharge_date)
            .forEach(admission => {
                const patient = patients.find(p => p.id === admission.patient_id);
                const option = document.createElement('option');
                option.value = admission.id;
                option.textContent = `${patient.first_name} ${patient.last_name} (Admitted: ${admission.admit_date})`;
                admissionSelect.appendChild(option);
            });
    }

    window.editPatient = (id) => {
        const patient = patients.find(p => p.id === id);
        patientId.value = patient.id;
        lastName.value = patient.last_name;
        firstName.value = patient.first_name;
        middleName.value = patient.middle_name;
        suffixName.value = patient.suffix_name;
        dateOfBirth.value = patient.date_of_birth;
        address.value = patient.address;
    };

    window.deletePatient = (id) => {
        fetch(`crud.php?id=${id}`, { method: 'DELETE' }).then(() => {
            fetchPatients();
        });
    };

    window.dischargeAdmission = (id) => {
        const admission = admissions.find(a => a.id === id);
        admissionSelect.value = admission.id;
        dischargeDate.value = new Date().toISOString().slice(0, 16);
    };

    function resetForm() {
        patientId.value = '';
        lastName.value = '';
        firstName.value = '';
        middleName.value = '';
        suffixName.value = '';
        dateOfBirth.value = '';
        address.value = '';
    }

    function resetAdmissionForm() {
        patientSelect.value = '';
        admitDate.value = '';
        ward.value = '';
    }

    function resetDischargeForm() {
        admissionSelect.value = '';
        dischargeDate.value = '';
    }
});
