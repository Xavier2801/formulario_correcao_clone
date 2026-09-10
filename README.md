<div align="center">

# 🎙️ Smart Gabarito Voice Engine
### Preenchimento Automatizado de Cartão-Resposta via Web Speech API

[![Live Demo](https://img.shields.io/badge/Demo-Acessar%20Online-00C7B7?style=for-the-badge&logo=render&logoColor=white)](https://formulario-correcao-clone.onrender.com)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repositório-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Xavier2801/formulario_correcao_clone)

![PHP](https://img.shields.io/badge/PHP-8.2-777BB4?style=flat-square&logo=php&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat-square&logo=docker&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla%20ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Web Speech API](https://img.shields.io/badge/API-Web%20Speech-EA4335?style=flat-square&logo=googlechrome&logoColor=white)
![Status](https://img.shields.io/badge/Status-90%25%2B%20Accuracy-success?style=flat-square)

<p align="center">
  <b>Uma solução client-side resiliente para ditado contínuo e marcação automática de gabaritos em dispositivos heterogêneos.</b>
</p>

[Acessar Demonstração](#-demonstração-online) •
[Engenharia de Calibração](#-engenharia-de-calibração-acústica-90-de-sucesso) •
[Guia de Comandos](#-guia-de-comandos-de-voz) •
[Como Rodar Localmente](#-execução-local)

---

</div>

## 🌐 Demonstração Online

A aplicação está hospedada e totalmente funcional na nuvem:

👉 **Link de Acesso Direto:** [https://formulario-correcao-clone.onrender.com](https://formulario-correcao-clone.onrender.com)

> [!WARNING]
> **Aviso de Cold Start (Hospedagem Gratuita no Render):**  
> A infraestrutura entra em repouso após 15 minutos sem tráfego. Ao acessar pela primeira vez, o contêiner pode demorar entre **45 e 60 segundos** para inicializar (*cold start*). Após o primeiro carregamento, a aplicação responderá de forma instantânea.

---

## 🎯 Destaques do Projeto

* **Hands-Free Total:** Dite blocos completos sem tocar na tela do celular.
* **Chaveamento Dinâmico de Disciplinas:** Alterne entre Português e Matemática na mesma frase falada.
* **Suporte a Saltos e Brancos:** Comandos explícitos para desmarcar ou pular questões (`"em branco"` / `"pular"`).
* **Foco em Mobile First:** Alvos de toque otimizados para smartphones Android e iOS com HTTPS nativo garantido.

---

## 🧠 Engenharia de Calibração Acústica (~90%+ de Sucesso)

O maior desafio técnico residiu no comportamento da **Web Speech API** em ambientes móveis reais (ruídos ambientes, cortes de microfone de entrada e particularidades do português brasileiro). O motor `VoiceGabaritoManager` foi calibrado progressivamente para superar gargalos crônicos: 
### Principais Desafios Superados

| Gargalo Técnico | Comportamento do Browser | Solução de Engenharia Implementada |
| :--- | :--- | :--- |
| **Quebra em Números $\ge 10$** | O Chrome Mobile aglutina horários (`10:00`, `10h`, `10b`). | Pipeline de sanitização que isola os numerais antes da tokenização. |
| **Falso Positivo de Letra "D"** | A consoante "D" quase sempre vira a preposição `"de"`. | Algoritmo com *lookahead* que só converte `"de"` em **D** fora de contextos conectivos (ex: não converte em `"1 de matemática"`). |
| **Troca de Abas no DOM** | Cliques simulados (`.click()`) falhavam no mobile. | Desacoplamento de eventos: chaveamento forçado de classes `.active` diretamente nos contêineres CSS. |
| **Padrões de Fala Diversificados** | Usuários usam formas compactas (`1a`), formais (`questão 1 letra A`) ou invertidas (`letra A na 1`). | Parser flexível multi-padrão com janelas deslizantes para identificação contínua. |

---

## 🎙️ Guia de Comandos de Voz

Use os seguintes padrões para ditar suas respostas:

<div align="center">

| Ação Pretendida | Padrão Ideal Recomendado | Formas Alternativas Aceitas |
| :--- | :--- | :--- |
| **Preencher Questão** | `Questão 1 letra B` | `1 B` • `1 bola` • `Letra B na 1` • `1a` |
| **Deixar em Branco / Pular** | `Questão 5 em branco` | `Pular questão 5` • `5 em branco` • `5 pular` |
| **Alternar Disciplina** | `Matemática` ou `Português` | `Ir para matemática` • `Aba matemática` |

</div>

> [!TIP]
> **Ditado Contínuo no mesmo áudio:**  
> Você pode falar tudo em uma única respiração:  
> *"Português questão 1 letra B, 2 C, 3 em branco, matemática questão 1 letra A, 2 D"*

---

## 💻 Execução Local

### 🐳 Via Docker (Recomendado)

Não requer instalação do PHP na máquina física, apenas o Docker:

```bash
# 1. Clone o repositório
git clone [https://github.com/Xavier2801/formulario_correcao_clone.git](https://github.com/Xavier2801/formulario_correcao_clone.git)
cd formulario_correcao_clone

# 2. Construa a imagem
docker build -t gabarito-voice .

# 3. Inicie o contêiner
docker run -d -p 8000:80 --name gabarito-app gabarito-voice

Acesse em seu navegador: http://localhost:8000

🐘 Via PHP Built-in Server
Caso prefira rodar diretamente via terminal com PHP 8.1+ instalado (ou via XAMPP):

Bash
# Inicie o servidor apontando para o host global (0.0.0.0)
php -S 0.0.0.0:8000
[!IMPORTANT]
Teste em Celulares na Mesma Rede:

A Web Speech API bloqueia o uso do microfone fora de localhost caso não haja conexão HTTPS segura. Para testar no celular conectado ao Wi-Fi local, exponha a porta com um túnel seguro:

Bash
cloudflared tunnel --url http://localhost:8000
📁 Arquitetura de Arquivos
Plaintext
formulario_correcao_clone/
├── app/
│   └── controllers/
│       └── SalvarProvaController.php   # Persistência e regras de salvamento
├── css/
│   └── style.css                      # Layout responsivo e feedback visual de áudio
├── js/
│   ├── script.js                      # Handlers de interface e abas
│   ├── selecao.js                     # Filtros dinâmicos em cascata (Escola/Turma/Aluno)
│   └── voice.js                       # VoiceGabaritoManager (Engine de voz e parser)
├── Dockerfile                         # Build do ambiente de produção (PHP 8.2 + Apache)
├── .dockerignore                      # Sanitização do build de produção
└── index.php                          # Ponto de entrada e interface do gabarito
Desenvolvido por Ruan Xavier

Gostou do projeto? Deixe uma ⭐️ no repositório!
