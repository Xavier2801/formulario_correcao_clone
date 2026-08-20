<?php
// Verifica se o aluno foi enviado via POST
$aluno_id = $_POST['aluno_id'] ?? null;

if (!$aluno_id) {
    die("Erro: Nenhum aluno selecionado. Volte e escolha um aluno.");
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Prova do Aluno</title>
    <link rel="stylesheet" href="../../css/style.css">
</head>
<body>
<h2>Prova do Aluno <?= htmlspecialchars($aluno_id) ?></h2>

<form method="POST" action="../../app/controllers/RespostaController.php">
    <input type="hidden" name="aluno_id" value="<?= htmlspecialchars($aluno_id) ?>">

    <div class="tabs">
        <button type="button" class="tab active" data-target="portugues">Português</button>
        <button type="button" class="tab" data-target="matematica">Matemática</button>
    </div>

    <div id="portugues" class="tab-content active">
        <?php for ($i = 1; $i <= 16; $i++): ?>
            <div class="questao">
                <label>Questão <?= $i ?></label>
                <input type="radio" name="q<?= $i ?>" value="A"> A
                <input type="radio" name="q<?= $i ?>" value="B"> B
                <input type="radio" name="q<?= $i ?>" value="C"> C
                <input type="radio" name="q<?= $i ?>" value="D"> D
            </div>
        <?php endfor; ?>
    </div>

    <div id="matematica" class="tab-content">
        <?php for ($i = 17; $i <= 32; $i++): ?>
            <div class="questao">
                <label>Questão <?= $i ?></label>
                <input type="radio" name="q<?= $i ?>" value="A"> A
                <input type="radio" name="q<?= $i ?>" value="B"> B
                <input type="radio" name="q<?= $i ?>" value="C"> C
                <input type="radio" name="q<?= $i ?>" value="D"> D
            </div>
        <?php endfor; ?>
    </div>

    <button type="submit" class="btn-salvar">Salvar Prova</button>
</form>

<script src="../../js/script.js"></script>
</body>
</html>