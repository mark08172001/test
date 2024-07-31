<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['patients'])) {
    $sql = "SELECT * FROM patients";
    $result = $conn->query($sql);
    $patients = [];
    while ($row = $result->fetch_assoc()) {
        $patients[] = $row;
    }
    echo json_encode($patients);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['patient'])) {
    $data = json_decode($_POST['patient'], true);
    if (isset($data['id']) && $data['id'] > 0) {
        $sql = "UPDATE patients SET last_name='{$data['last_name']}', first_name='{$data['first_name']}', middle_name='{$data['middle_name']}', suffix_name='{$data['suffix_name']}', date_of_birth='{$data['date_of_birth']}', address='{$data['address']}' WHERE id={$data['id']}";
    } else {
        $sql = "INSERT INTO patients (last_name, first_name, middle_name, suffix_name, date_of_birth, address) VALUES ('{$data['last_name']}', '{$data['first_name']}', '{$data['middle_name']}', '{$data['suffix_name']}', '{$data['date_of_birth']}', '{$data['address']}')";
    }
    $conn->query($sql);
    echo json_encode(['success' => true]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $sql = "DELETE FROM patients WHERE id=$id";
    $conn->query($sql);
    echo json_encode(['success' => true]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['admissions'])) {
    $today = date('Y-m-d');
    $sql = "SELECT a.*, p.first_name, p.last_name FROM admissions a JOIN patients p ON a.patient_id = p.id WHERE DATE(a.admit_date) = '$today'";
    $result = $conn->query($sql);
    $admissions = [];
    while ($row = $result->fetch_assoc()) {
        $admissions[] = $row;
    }
    echo json_encode($admissions);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['admission'])) {
    $data = json_decode($_POST['admission'], true);
    $sql = "INSERT INTO admissions (patient_id, admit_date, ward) VALUES ({$data['patient_id']}, '{$data['admit_date']}', '{$data['ward']}')";
    $conn->query($sql);
    echo json_encode(['success' => true]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['discharge'])) {
    $data = json_decode($_POST['discharge'], true);
    $sql = "UPDATE admissions SET discharge_date='{$data['discharge_date']}' WHERE id={$data['id']}";
    $conn->query($sql);
    echo json_encode(['success' => true]);
    exit;
}

$conn->close();
?>
