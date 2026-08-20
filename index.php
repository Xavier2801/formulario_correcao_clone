<?php
require_once __DIR__ . "/config/database.php";
require_once __DIR__ . "/app/models/EscolaModel.php";

$conn = Database::connect();
$escolaModel = new EscolaModel($conn);
$escolas = $escolaModel->listar();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Salvar Prova</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

<form action="app/controllers/SalvarProvaController.php" method="POST">
    <h2>Lançamento de Respostas</h2>

    <!-- Seleção de Aluno -->
    <div class="selecao-container">
        <label for="escola">Escola:</label>
        <select name="escola_id" id="escola" required>
            <option value="">Selecione</option>
            <?php while ($e = $escolas->fetch_assoc()): ?>
                <option value="<?= $e['id'] ?>"><?= htmlspecialchars($e['nome']) ?></option>
            <?php endwhile; ?>
        </select>

        <label for="turma">Turma:</label>
        <select name="turma_id" id="turma" required>
            <option value="">Selecione a Escola primeiro</option>
        </select>

        <label for="aluno">Aluno:</label>
        <select name="aluno_id" id="aluno" required>
            <option value="">Selecione a Turma primeiro</option>
        </select>
    </div>

    <!-- Abas de Disciplinas -->
    <div class="tabs">
        <button type="button" class="tab active" data-target="portugues">Português</button>
        <button type="button" class="tab" data-target="matematica">Matemática</button>
    </div>

    <!-- Aba Português (16 questões) -->
    <div id="portugues" class="tab-content active">
        <?php for ($i = 1; $i <= 16; $i++): ?>
            <div class="questao">
                <label>Questão <?= $i ?></label>
                <input type="radio" name="portugues[<?= $i ?>]" value="A"> A
                <input type="radio" name="portugues[<?= $i ?>]" value="B"> B
                <input type="radio" name="portugues[<?= $i ?>]" value="C"> C
                <input type="radio" name="portugues[<?= $i ?>]" value="D"> D
            </div>
        <?php endfor; ?>
    </div>

    <!-- Aba Matemática (16 questões) -->
    <div id="matematica" class="tab-content">
        <?php for ($i = 1; $i <= 16; $i++): ?>
            <div class="questao">
                <label>Questão <?= $i ?></label>
                <input type="radio" name="matematica[<?= $i ?>]" value="A"> A
                <input type="radio" name="matematica[<?= $i ?>]" value="B"> B
                <input type="radio" name="matematica[<?= $i ?>]" value="C"> C
                <input type="radio" name="matematica[<?= $i ?>]" value="D"> D
            </div>
        <?php endfor; ?>
    </div>

    <button type="submit" id="submit-btn">Salvar Prova</button>
</form>

<script src="js/selecao.js"></script>
<script src="js/script.js"></script>
</body>
</html>
