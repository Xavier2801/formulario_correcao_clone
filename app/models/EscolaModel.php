<?php
class EscolaModel {
    private $conn;
    public function __construct($conn) { $this->conn = $conn; }

    public function listar() {
        return $this->conn->query("SELECT * FROM escolas");
    }
}
