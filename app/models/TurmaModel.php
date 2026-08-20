<?php
class TurmaModel {
    private $conn;
    public function __construct($conn) { $this->conn = $conn; }

    public function listarPorEscola($escolaId) {
        $stmt = $this->conn->prepare("SELECT * FROM turmas WHERE escola_id=?");
        $stmt->bind_param("i", $escolaId);
        $stmt->execute();
        return $stmt->get_result();
    }
}