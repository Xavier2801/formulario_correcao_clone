<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../config/database.php';

$conn = Database::connect();

header('Content-Type: application/json');

// Quando seleciona a escola → retorna turmas
if (isset($_GET['escola_id'])) {
    $escola_id = intval($_GET['escola_id']);
    $sql = "SELECT id, nome FROM turmas WHERE escola_id = $escola_id";
    $result = $conn->query($sql);

    $turmas = [];
    while ($row = $result->fetch_assoc()) {
        $turmas[] = $row;
    }

    echo json_encode($turmas);
    exit;
}

// Quando seleciona a turma → retorna alunos
if (isset($_GET['turma_id'])) {
    $turma_id = intval($_GET['turma_id']);
    $sql = "SELECT id, nome FROM alunos WHERE turma_id = $turma_id";
    $result = $conn->query($sql);

    $alunos = [];
    while ($row = $result->fetch_assoc()) {
        $alunos[] = $row;
    }

    echo json_encode($alunos);
    exit;
}
echo json_encode([]);
?>
