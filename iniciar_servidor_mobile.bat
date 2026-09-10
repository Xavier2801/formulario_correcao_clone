@echo off
title Servidor Mobile HTTPS (iPhone e Android)
cd /d "%~dp0"

echo ========================================================
echo   Iniciando Servidor PHP + Link HTTPS Seguro
echo ========================================================
echo.

REM Finaliza eventuais processos anteriores para liberar as portas
taskkill /F /IM php.exe >nul 2>&1
taskkill /F /IM cloudflared.exe >nul 2>&1

REM Inicia o servidor PHP embutido na porta 8080
powershell -Command "Start-Process 'C:\xampp\php\php.exe' -ArgumentList '-S 0.0.0.0:8080 -t \"%~dp0\"' -WindowStyle Hidden"

echo [OK] Servidor PHP iniciado na porta 8080!
echo [OK] Conectando ao Cloudflare para gerar seu link HTTPS seguro...
echo.
echo ========================================================
echo   ATENCAO - INSTRUCOES PARA O SAFARI (IPHONE) / CHROME:
echo.
echo   1. NAO FECHE ESTA JANELA DO TERMINAL (ela mantem o site online).
echo   2. A cada execucao, um NOVO LINK seguro e gerado abaixo.
echo   3. Copie o link completo com 'https://...trycloudflare.com'.
echo   4. No Safari, digite ou cole exatamente o link gerado abaixo:
echo ========================================================
echo.

REM Inicia o tunel e exibe os logs com o link HTTPS gerado
"%~dp0cloudflared.exe" tunnel --url http://127.0.0.1:8080

taskkill /F /IM php.exe >nul 2>&1
pause
