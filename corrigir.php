<?php
$respostas = $_POST;
$gabarito = json_decode(file_get_contents('data/gabarito.json'), true);

$acertosPort = 0;
$acertosMat = 0;

for ($i = 1; $i <= 16; $i++) {
    if ($respostas["q$i"] === $gabarito["portugues"][$i-1]) $acertosPort++;
}
for ($i = 17; $i <= 32; $i++) {
    if ($respostas["q$i"] === $gabarito["matematica"][$i-17]) $acertosMat++;
}

$total = $acertosPort + $acertosMat;
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Resultado da Correção</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="resultado">
    <h1>Resultado da Correção</h1>
    <p><strong>Português:</strong> <?= $acertosPort ?>/16</p>
    <p><strong>Matemática:</strong> <?= $acertosMat ?>/16</p>
    <hr>
    <p><strong>Total:</strong> <?= $total ?>/32</p>
    <a href="index.php">Voltar ao formulário</a>
</div>
</body>
</html>
