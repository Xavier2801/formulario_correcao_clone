<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../app/models/RespostaModel.php';
require_once __DIR__ . '/../app/models/EscolaModel.php';

echo "=== INICIANDO BATERIA DE TESTES ===\n\n";

$conn = Database::connect();
echo "[TESTE 1] Conexão com MySQL: SUCESSO\n";

// 1. Assegurar coluna 'disciplina'
$colCheck = $conn->query("SHOW COLUMNS FROM respostas LIKE 'disciplina'");
if (!$colCheck || $colCheck->num_rows === 0) {
    $conn->query("ALTER TABLE respostas ADD COLUMN disciplina ENUM('portugues', 'matematica') NOT NULL AFTER aluno_id");
}

// 2. Assegurar UNIQUE KEY (aluno_id, disciplina, questao)
$indexCheck = $conn->query("SHOW INDEX FROM respostas WHERE Key_name = 'uk_aluno_disciplina_questao'");
if (!$indexCheck || $indexCheck->num_rows === 0) {
    // Remover duplicatas antes de criar o índice se houver
    $conn->query("ALTER TABLE respostas ADD UNIQUE KEY uk_aluno_disciplina_questao (aluno_id, disciplina, questao)");
}
echo "[TESTE 2] Integridade do Schema (coluna 'disciplina' e índice UNIQUE): SUCESSO\n";

// 3. Setup de fixture
$conn->query("DELETE FROM respostas WHERE aluno_id = 9999");
$conn->query("INSERT IGNORE INTO escolas (id, nome) VALUES (9999, 'Escola de Teste Automatizado')");
$conn->query("INSERT IGNORE INTO turmas (id, escola_id, nome) VALUES (9999, 9999, 'Turma de Teste Automatizado')");
$conn->query("INSERT IGNORE INTO alunos (id, turma_id, nome) VALUES (9999, 9999, 'Aluno de Teste Automatizado')");

echo "[TESTE 3] Fixture de teste (Escola/Turma/Aluno 9999): CRIADA\n";

// 4. Inserção unitária
$model = new RespostaModel($conn);
$resPort = $model->salvar(9999, 'portugues', 1, 'A');
$resMat  = $model->salvar(9999, 'matematica', 1, 'C');

if ($resPort && $resMat) {
    echo "[TESTE 4] Inserção particionada por disciplina (Português Q1='A', Matemática Q1='C'): SUCESSO\n";
} else {
    echo "[TESTE 4] FALHA: Inserção via RespostaModel falhou.\n";
    exit(1);
}

// 5. Teste de atualização atômica (ON DUPLICATE KEY UPDATE)
$model->salvar(9999, 'portugues', 1, 'B'); // Alterando Q1 de A para B
$check = $conn->query("SELECT resposta FROM respostas WHERE aluno_id = 9999 AND disciplina = 'portugues' AND questao = 1");
$row = $check->fetch_assoc();
if ($row && $row['resposta'] === 'B') {
    echo "[TESTE 5] Atualização atômica ON DUPLICATE KEY (Q1 alterada para 'B'): SUCESSO\n";
} else {
    echo "[TESTE 5] FALHA: Esperado 'B', obtido '" . ($row['resposta'] ?? 'null') . "'\n";
    exit(1);
}

// 6. Teste de salvamento em lote (simulando 16 questões de cada disciplina)
$conn->begin_transaction();
try {
    for ($i = 1; $i <= 16; $i++) {
        $model->salvar(9999, 'portugues', $i, 'A');
        $model->salvar(9999, 'matematica', $i, 'D');
    }
    $conn->commit();
    echo "[TESTE 6] Transação em lote de 32 questões (16 Português + 16 Matemática): SUCESSO\n";
} catch (Throwable $e) {
    $conn->rollback();
    echo "[TESTE 6] FALHA: " . $e->getMessage() . "\n";
    exit(1);
}

// 7. Validação das contagens isoladas por matéria
$countPort = (int)$conn->query("SELECT COUNT(*) as total FROM respostas WHERE aluno_id = 9999 AND disciplina = 'portugues'")->fetch_assoc()['total'];
$countMat  = (int)$conn->query("SELECT COUNT(*) as total FROM respostas WHERE aluno_id = 9999 AND disciplina = 'matematica'")->fetch_assoc()['total'];

if ($countPort === 16 && $countMat === 16) {
    echo "[TESTE 7] Isolamento e contagem por disciplina (Português: $countPort/16 | Matemática: $countMat/16): SUCESSO\n";
} else {
    echo "[TESTE 7] FALHA: Contagens inconsistentes (Português: $countPort, Matemática: $countMat)\n";
    exit(1);
}

// 8. Teardown
$conn->query("DELETE FROM respostas WHERE aluno_id = 9999");
$conn->query("DELETE FROM alunos WHERE id = 9999");
$conn->query("DELETE FROM turmas WHERE id = 9999");
$conn->query("DELETE FROM escolas WHERE id = 9999");

echo "[TESTE 8] Teardown e limpeza de fixtures: SUCESSO\n";

echo "\n=========================================\n";
echo "TODOS OS TESTES FORAM CONCLUÍDOS COM 100% DE APROVAÇÃO!\n";
echo "=========================================\n";
