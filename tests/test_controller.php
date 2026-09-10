<?php
// Simula requisição POST para o SalvarProvaController
$_SERVER['REQUEST_METHOD'] = 'POST';

require_once __DIR__ . '/../config/database.php';
$conn = Database::connect();

// Criar dados temporários para teste
$conn->query("INSERT IGNORE INTO escolas (id, nome) VALUES (8888, 'Escola Controller Test')");
$conn->query("INSERT IGNORE INTO turmas (id, escola_id, nome) VALUES (8888, 8888, 'Turma Controller Test')");
$conn->query("INSERT IGNORE INTO alunos (id, turma_id, nome) VALUES (8888, 8888, 'Aluno Controller Test')");

// Montar payload simulado
$_POST['aluno_id'] = '8888';
$_POST['portugues'] = [];
$_POST['matematica'] = [];

for ($i = 1; $i <= 16; $i++) {
    $_POST['portugues'][$i] = ($i % 2 === 0) ? 'A' : 'B';
    $_POST['matematica'][$i] = ($i % 2 === 0) ? 'C' : 'D';
}

echo "=== TESTE DE INTEGRAÇÃO DO CONTROLLER (SalvarProvaController) ===\n\n";

ob_start();
require __DIR__ . '/../app/controllers/SalvarProvaController.php';
$output = ob_get_clean();

echo "Resposta do controller: " . strip_tags($output) . "\n";

// Validações
$totalPort = (int)$conn->query("SELECT COUNT(*) as t FROM respostas WHERE aluno_id = 8888 AND disciplina = 'portugues'")->fetch_assoc()['t'];
$totalMat  = (int)$conn->query("SELECT COUNT(*) as t FROM respostas WHERE aluno_id = 8888 AND disciplina = 'matematica'")->fetch_assoc()['t'];

echo "Validação no banco:\n";
echo "- Português salvas: $totalPort/16\n";
echo "- Matemática salvas: $totalMat/16\n";

if ($totalPort === 16 && $totalMat === 16) {
    echo "\n>>> SUCESSO: Controller processou e persistiu as respostas separadamente!\n";
} else {
    echo "\n>>> FALHA: Inconsistência na persistência do controller!\n";
    exit(1);
}

// Teardown
$conn->query("DELETE FROM respostas WHERE aluno_id = 8888");
$conn->query("DELETE FROM alunos WHERE id = 8888");
$conn->query("DELETE FROM turmas WHERE id = 8888");
$conn->query("DELETE FROM escolas WHERE id = 8888");
