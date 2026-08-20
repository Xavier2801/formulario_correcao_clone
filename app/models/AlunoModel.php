<?php
class AlunoModel {
    private $conn;
    public function __construct($conn) { $this->conn = $conn; }

    public function listarPorTurma($turmaId) {
        $stmt = $this->conn->prepare("SELECT * FROM alunos WHERE turma_id=?");
        $stmt->bind_param("i", $turmaId);
        $stmt->execute();
        return $stmt->get_result();
    }
}