<?php
require_once __DIR__."/../models/RespostaModel.php";
require_once __DIR__."/../../config/database.php";

$conn = Database::connect();
$respostaModel = new RespostaModel($conn);

$aluno_id = $_POST['aluno_id'];

foreach ($_POST as $questao => $resposta) {
    if (strpos($questao, 'q') === 0) {
        $num = intval(substr($questao, 1));
        $respostaModel->salvar($aluno_id, $num, $resposta);
    }
}

include __DIR__."/../views/resultado.php";