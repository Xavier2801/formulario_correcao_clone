<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../models/RespostaModel.php';

if (php_sapi_name() !== 'cli' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit("Método não permitido.");
}

$aluno_id = filter_var($_POST['aluno_id'] ?? null, FILTER_VALIDATE_INT);
if (!$aluno_id) {
    if (!headers_sent()) {
        http_response_code(400);
    }
    exit("Erro: Nenhum aluno selecionado. Volte e escolha um aluno.");
}

$conn = Database::connect();
$respostaModel = new RespostaModel($conn);

$disciplinas = ['portugues', 'matematica'];
$conn->begin_transaction();

try {
    foreach ($disciplinas as $disciplina) {
        if (!empty($_POST[$disciplina]) && is_array($_POST[$disciplina])) {
            foreach ($_POST[$disciplina] as $questao => $resposta) {
                $questaoNum = (int)$questao;
                $respostaVal = strtoupper(trim((string)$resposta));

                if ($questaoNum >= 1 && $questaoNum <= 16 && in_array($respostaVal, ['A', 'B', 'C', 'D'])) {
                    $respostaModel->salvar($aluno_id, $disciplina, $questaoNum, $respostaVal);
                }
            }
        }
    }
    $conn->commit();
    echo "<p style='color:green;font-family:sans-serif;font-weight:bold;text-align:center;margin-top:50px;'>Prova salva com sucesso!</p>";
    echo "<p style='text-align:center;'><a href='../../index.php'>Voltar</a></p>";
} catch (Throwable $e) {
    $conn->rollback();
    if (!headers_sent()) {
        http_response_code(500);
    }
    echo "Erro ao salvar prova: " . htmlspecialchars($e->getMessage());
}
