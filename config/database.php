<?php
class Database
{
    private static $host = "localhost";
    private static $user = "root";
    private static $pass = "";
    private static $dbname = "prova_app";

    public static function connect()
    {
        $conn = new mysqli(self::$host, self::$user, self::$pass, self::$dbname);
        if ($conn->connect_error) {
            die("Erro na conexão: " . $conn->connect_error);
        }
        return $conn;
    }
}