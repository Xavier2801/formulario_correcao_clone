<?php
class Database
{
    private static ?mysqli $conn = null;

    public static function connect(): ?mysqli
    {
        if (self::$conn === null) {
            $host = getenv('DB_HOST') ?: "localhost";
            $user = getenv('DB_USER') ?: "root";
            $pass = getenv('DB_PASS') !== false ? getenv('DB_PASS') : "";
            $dbname = getenv('DB_NAME') ?: "prova_app";
            $port = (int)(getenv('DB_PORT') ?: 3306);

            try {
                $conn = @new mysqli($host, $user, $pass, $dbname, $port);
                if ($conn->connect_error) {
                    return null;
                }
                $conn->set_charset("utf8mb4");
                self::$conn = $conn;
            } catch (Throwable $e) {
                return null;
            }
        }
        return self::$conn;
    }
}