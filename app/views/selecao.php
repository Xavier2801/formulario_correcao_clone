<?php
require_once __DIR__ . "/../../config/database.php";
require_once __DIR__ . "/../models/EscolaModel.php";

$conn = Database::connect();
$escolaModel = new EscolaModel($conn);
$escolas = $escolaModel->listar();
?>
<form method="POST" action="app/views/prova.php">
    <label>Escola:</label>
    <select name="escola_id" id="escola">
        <option value="">Selecione</option>
        <?php while($e = $escolas->fetch_assoc()): ?>
            <option value="<?= $e['id'] ?>"><?= $e['nome'] ?></option>
        <?php endwhile; ?>
    </select>

    <label>Turma:</label>
    <select name="turma_id" id="turma"></select>

    <label>Aluno:</label>
    <select name="aluno_id" id="aluno"></select>

</form>
<script src="../../js/selecao.js"></script>