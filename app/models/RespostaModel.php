<?php

class RespostaModel {
    private mysqli $conn;

    public function __construct(mysqli $conn) {
        $this->conn = $conn;
    }

    public function salvar(int $alunoId, string $disciplina, int $questao, string $resposta): bool {
        $stmt = $this->conn->prepare(
            "INSERT INTO respostas (aluno_id, disciplina, questao, resposta) 
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE resposta = VALUES(resposta)"
        );
        $stmt->bind_param("isis", $alunoId, $disciplina, $questao, $resposta);
        return $stmt->execute();
    }
}
