<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Prova</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<!-- Abas -->
<div class="tabs">
    <button class="tab active" data-target="portugues">Português</button>
    <button class="tab" data-target="matematica">Matemática</button>
</div>

<!-- Formulário -->
<form action="corrigir.php" method="POST">
    <!-- Aba Português -->
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

    <!-- Aba Matemática -->
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

    <button type="submit" id="submit-btn">Corrigir</button>
</form>

<script src="js/script.js"></script>
</body>
</html>