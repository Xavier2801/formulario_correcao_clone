/**
 * VoiceGabaritoManager
 * Versão recalibrada com alta sensibilidade fonética (Português + Matemática)
 * Preserva o motor de abas e restaura captura de letras soltas e formatos rápidos.
 */
class VoiceGabaritoManager {
    constructor() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.isSupported = !!SpeechRecognition;
        this.recognition = this.isSupported ? new SpeechRecognition() : null;
        this.isListening = false;

        this.numeroMap = {
            'um': 1, 'uma': 1, 'primeiro': 1, 'primeira': 1, '1': 1, '1º': 1, '1ª': 1,
            'dois': 2, 'duas': 2, 'segundo': 2, 'segunda': 2, '2': 2, '2º': 2, '2ª': 2,
            'tres': 3, 'três': 3, 'terceiro': 3, 'terceira': 3, '3': 3, '3º': 3, '3ª': 3,
            'quatro': 4, 'quarto': 4, 'quarta': 4, '4': 4, '4º': 4, '4ª': 4,
            'cinco': 5, 'quinto': 5, 'quinta': 5, '5': 5, '5º': 5, '5ª': 5,
            'seis': 6, 'meia': 6, 'sexto': 6, 'sexta': 6, '6': 6, '6º': 6, '6ª': 6,
            'sete': 7, 'setimo': 7, 'sétimo': 7, 'setima': 7, 'sétima': 7, '7': 7, '7º': 7, '7ª': 7,
            'oito': 8, 'oitavo': 8, 'oitava': 8, '8': 8, '8º': 8, '8ª': 8,
            'nove': 9, 'nono': 9, 'nona': 9, '9': 9, '9º': 9, '9ª': 9,
            'dez': 10, 'decimo': 10, 'décimo': 10, 'decima': 10, 'décima': 10, '10': 10, '10º': 10, '10ª': 10,
            'onze': 11, '11': 11, '11º': 11, '11ª': 11,
            'doze': 12, '12': 12, '12º': 12, '12ª': 12,
            'treze': 13, '13': 13, '13º': 13, '13ª': 13,
            'quatorze': 14, 'catorze': 14, '14': 14, '14º': 14, '14ª': 14,
            'quinze': 15, '15': 15, '15º': 15, '15ª': 15,
            'dezesseis': 16, 'dezasseis': 16, '16': 16, '16º': 16, '16ª': 16,
            'dezessete': 17, '17': 17, 'dezoito': 18, '18': 18,
            'dezenove': 19, '19': 19, 'vinte': 20, '20': 20,
            '21': 21, '22': 22, '23': 23, '24': 24, '25': 25,
            '26': 26, '27': 27, '28': 28, '29': 29, '30': 30, '31': 31, '32': 32
        };

        this.init();
    }

    init() {
        this.bindEvents();

        if (!this.isSupported) {
            this.updateStatus('Reconhecimento de voz não suportado neste navegador.', 'error');
            return;
        }

        this.setupRecognition();
    }

    setupRecognition() {
        if (!this.recognition) return;

        this.recognition.lang = 'pt-BR';
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 3;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateVoiceButtonState(true);
            this.updateStatus('🎙️ Microfone ativo. Pode ditar o gabarito.', 'listening');
        };

        this.recognition.onresult = (event) => {
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (!result || !result[0]) continue;

                let processado = false;
                for (let alt = 0; alt < result.length; alt++) {
                    const transcript = result[alt].transcript.trim();
                    if (!transcript) continue;

                    console.log(`[Áudio Chunk ${i} Alt ${alt}]: "${transcript}"`);
                    if (this.processAndApply(transcript)) {
                        processado = true;
                        break;
                    }
                }

                if (!processado) {
                    console.warn('[Não mapeado]:', result[0].transcript);
                }
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                this.updateStatus('Permissão do microfone negada.', 'error');
                this.stopListening();
            } else if (event.error !== 'no-speech') {
                this.updateStatus(`Alerta no microfone: ${event.error}`, 'warning');
            }
        };

        this.recognition.onend = () => {
            if (this.isListening) {
                setTimeout(() => {
                    if (this.isListening) {
                        try { this.recognition.start(); } catch (e) { console.warn(e); }
                    }
                }, 150);
            } else {
                this.updateVoiceButtonState(false);
            }
        };
    }

    bindEvents() {
        const toggleBtn = document.getElementById('btn-voice-toggle');
        if (toggleBtn) {
            toggleBtn.onclick = () => this.isListening ? this.stopListening() : this.startListening();
        }
    }

    startListening() {
        try {
            this.recognition.start();
        } catch (err) {
            this.isListening = true;
            this.updateVoiceButtonState(true);
        }
    }

    stopListening() {
        this.isListening = false;
        try { this.recognition.stop(); } catch (e) {}
        this.updateVoiceButtonState(false);
        this.updateStatus('Comando de voz desativado.', 'info');
    }

    updateVoiceButtonState(active) {
        const btn = document.getElementById('btn-voice-toggle');
        if (!btn) return;
        btn.classList.toggle('listening', active);
        const textSpan = btn.querySelector('.voice-btn-text');
        if (textSpan) {
            textSpan.textContent = active ? 'Parar Comando por Voz' : 'Ativar Comando por Voz';
        }
    }

    updateStatus(message, type = 'info') {
        const statusBox = document.getElementById('voice-status');
        if (!statusBox) return;
        statusBox.className = `voice-status-box status-${type}`;
        const statusText = statusBox.querySelector('.status-text');
        if (statusText) statusText.textContent = message;
    }

    getActiveDiscipline() {
        const activeTab = document.querySelector('.tab.active');
        if (activeTab && activeTab.dataset.target) {
            return activeTab.dataset.target;
        }
        const activeContent = document.querySelector('.tab-content.active');
        if (activeContent && activeContent.id) {
            return activeContent.id;
        }
        return 'portugues';
    }

    switchDisciplineTab(discipline) {
        const targetDiscipline = discipline.toLowerCase().includes('mat') ? 'matematica' : 'portugues';

        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.target === targetDiscipline);
        });

        const contents = document.querySelectorAll('.tab-content');
        contents.forEach(content => {
            const isActive = content.id === targetDiscipline;
            content.classList.toggle('active', isActive);
            content.style.display = isActive ? 'block' : 'none';
        });

        const targetTab = document.querySelector(`.tab[data-target="${targetDiscipline}"]`);
        if (targetTab) {
            targetTab.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        }

        console.log(`[Aba Alternada]: ${targetDiscipline}`);
        return true;
    }

    /**
     * Sanitização calibrada: preserva preposições contextuais e normaliza fonemas
     */
    normalizeTranscript(rawText) {
        let text = rawText.toLowerCase();

        // 1. Elimina entidades horárias sem corromper números
        text = text.replace(/(\d{1,2}):00\b/g, ' $1 ');
        text = text.replace(/(\d{1,2})h\b/g, ' $1 ');

        // 2. Transições de matéria capturando conectivos agregados (remove "de", "em", "para")
        text = text.replace(/(?:mudar\s+para\s+|ir\s+para\s+|trocar\s+para\s+|aba\s+|disciplina\s+|de\s+|em\s+|pra\s+)?matem[áa]tica\b/gi, ' __matematica__ ');
        text = text.replace(/(?:mudar\s+para\s+|ir\s+para\s+|trocar\s+para\s+|aba\s+|disciplina\s+|de\s+|em\s+|pra\s+)?portugu[êe]s\b/gi, ' __portugues__ ');

        // 3. Comandos de anulação e pulo
        text = text.replace(/(?:deixar\s+)?em\s+branco\b/gi, ' __blank__ ');
        text = text.replace(/\b(?:pular|pula|limpar|sem\s+resposta|branco)\b/gi, ' __blank__ ');

        // 4. Ordinais compostos
        const ordinais = [
            [/d[ée]cim[ao]\s+primeir[ao]/gi, ' 11 '],
            [/d[ée]cim[ao]\s+segund[ao]/gi, ' 12 '],
            [/d[ée]cim[ao]\s+terceir[ao]/gi, ' 13 '],
            [/d[ée]cim[ao]\s+quart[ao]/gi, ' 14 '],
            [/d[ée]cim[ao]\s+quint[ao]/gi, ' 15 '],
            [/d[ée]cim[ao]\s+sext[ao]/gi, ' 16 ']
        ];
        ordinais.forEach(([pattern, rep]) => { text = text.replace(pattern, rep); });

        // 5. Normalização fonética das letras (sensibilidade alta do motor original)
        text = text.replace(/(?:letra|op[çc][ãa]o)\s+([a-e])\b/gi, ' $1 ');
        text = text.replace(/\b(b[êe]|bola)\b/gi, ' b ');
        text = text.replace(/\b(c[êe]|s[êe]|casa)\b/gi, ' c ');
        text = text.replace(/\b(d[êe]|dado)\b/gi, ' d ');
        text = text.replace(/\b([áa]h|amor)\b/gi, ' a ');

        // 6. Formatos aglutinados (ex: "1b" -> "1 b")
        text = text.replace(/(\d{1,2})([a-e])\b/gi, ' $1 $2 ');

        // 7. Pontuações
        text = text.replace(/[,;.\/#!$%\^&\*:{}=\-_`~()]/g, ' ');
        return text.replace(/\s+/g, ' ').trim();
    }

    parseMultipleCommands(rawText) {
        const text = this.normalizeTranscript(rawText);
        const tokens = text.split(' ');
        const results = [];

        let currentDiscipline = this.getActiveDiscipline();
        let explicitDisciplineChange = null;

        let i = 0;
        while (i < tokens.length) {
            const t = tokens[i];

            // Troca de matéria
            if (t === '__portugues__' || t === 'portugues') {
                currentDiscipline = 'portugues';
                explicitDisciplineChange = 'portugues';
                i++;
                continue;
            }
            if (t === '__matematica__' || t === 'matematica') {
                currentDiscipline = 'matematica';
                explicitDisciplineChange = 'matematica';
                i++;
                continue;
            }

            // Padrão Pular Anteposto (Ex: "__blank__ 5")
            if (t === '__blank__') {
                let nextIdx = i + 1;
                while (nextIdx < tokens.length && ['a', 'o', 'na', 'no', 'questao', 'questão', 'numero', 'número'].includes(tokens[nextIdx])) {
                    nextIdx++;
                }
                if (nextIdx < tokens.length) {
                    const tokenNum = tokens[nextIdx];
                    let qNum = /^\d{1,2}$/.test(tokenNum) ? parseInt(tokenNum, 10) : this.numeroMap[tokenNum];
                    if (qNum && qNum >= 1 && qNum <= 32) {
                        results.push({ discipline: currentDiscipline, questao: qNum, letra: 'BLANK' });
                        i = nextIdx + 1;
                        continue;
                    }
                }
            }

            // Padrão Compacto (Ex: "1a", "2b", "12c")
            const compactMatch = t.match(/^(\d{1,2})([a-e])$/i);
            if (compactMatch) {
                results.push({
                    discipline: currentDiscipline,
                    questao: parseInt(compactMatch[1], 10),
                    letra: compactMatch[2].toUpperCase()
                });
                i++;
                continue;
            }

            // Padrão Direto: Número seguido de letra (Ex: "1 B", "questão 1 letra D", "1 de", "5 em branco")
            let qNum = null;
            if (/^\d{1,2}$/.test(t)) {
                qNum = parseInt(t, 10);
            } else if (this.numeroMap[t] !== undefined) {
                qNum = this.numeroMap[t];
            }

            if (qNum !== null && qNum >= 1 && qNum <= 32) {
                let nextIdx = i + 1;

                // Pula conectivos superficiais
                while (nextIdx < tokens.length &&
                ['letra', 'opcao', 'opção', 'na', 'no', 'em', 'e', 'é', 'questao', 'questão', 'item', 'fica', 'resposta'].includes(tokens[nextIdx])) {
                    nextIdx++;
                }

                if (nextIdx < tokens.length) {
                    const cand = tokens[nextIdx];
                    let letra = null;

                    if (cand === '__blank__') {
                        letra = 'BLANK';
                    } else if (/^[a-e]$/i.test(cand)) {
                        letra = cand.toUpperCase();
                    } else if (cand === 'de' || cand === 'dê' || cand === 'dado') {
                        // "de" após número é a alternativa D caso o próximo token não seja matéria nem outro número
                        const lookahead = tokens[nextIdx + 1];
                        const proximoEhEstrutural = lookahead && (lookahead.includes('matematica') || lookahead.includes('portugues') || /^\d{1,2}$/.test(lookahead) || this.numeroMap[lookahead] !== undefined);

                        if (!proximoEhEstrutural) {
                            letra = 'D';
                        }
                    } else if (cand === 'ce' || cand === 'cê' || cand === 'se') {
                        letra = 'C';
                    } else if (cand === 'be' || cand === 'bê') {
                        letra = 'B';
                    }

                    if (letra) {
                        results.push({ discipline: currentDiscipline, questao: qNum, letra: letra });
                        i = nextIdx + 1;
                        continue;
                    }
                }
            }

            // Padrão Invertido: Letra seguida de número (Ex: "Letra B na 2", "C questão 5")
            if (/^[a-e]$/i.test(t)) {
                let nextIdx = i + 1;
                while (nextIdx < tokens.length && ['na', 'no', 'em', 'questao', 'questão', 'numero', 'número', 'pra', 'para'].includes(tokens[nextIdx])) {
                    nextIdx++;
                }
                if (nextIdx < tokens.length) {
                    const tokenNum = tokens[nextIdx];
                    let num = /^\d{1,2}$/.test(tokenNum) ? parseInt(tokenNum, 10) : this.numeroMap[tokenNum];
                    if (num && num >= 1 && num <= 32) {
                        results.push({ discipline: currentDiscipline, questao: num, letra: t.toUpperCase() });
                        i = nextIdx + 1;
                        continue;
                    }
                }
            }

            i++;
        }

        return { results, explicitDisciplineChange };
    }

    processAndApply(rawText) {
        const { results, explicitDisciplineChange } = this.parseMultipleCommands(rawText);

        if (results.length === 0 && explicitDisciplineChange) {
            this.switchDisciplineTab(explicitDisciplineChange);
            const discNome = explicitDisciplineChange === 'portugues' ? 'Português' : 'Matemática';
            this.updateStatus(`Aba alternada para ${discNome}.`, 'success');
            return true;
        }

        if (results.length === 0) return false;

        const logList = [];
        let currentActive = this.getActiveDiscipline();

        for (const item of results) {
            try {
                const targetDiscipline = item.discipline || currentActive;

                if (targetDiscipline !== currentActive) {
                    this.switchDisciplineTab(targetDiscipline);
                    currentActive = targetDiscipline;
                }

                const discShort = targetDiscipline === 'portugues' ? 'Port' : 'Mat';

                if (item.letra === 'BLANK') {
                    const cleared = this.clearAnswer(targetDiscipline, item.questao);
                    if (cleared) {
                        logList.push(`[${discShort}] Q${item.questao}→(Branco)`);
                    }
                } else {
                    const applied = this.applyAnswer(targetDiscipline, item.questao, item.letra);
                    if (applied) {
                        logList.push(`[${discShort}] Q${item.questao}→${item.letra}`);
                    }
                }
            } catch (err) {
                console.error(`Erro ao aplicar questão ${item.questao}:`, err);
            }
        }

        if (logList.length > 0) {
            this.updateStatus(`✅ Preenchido: ${logList.join(', ')}`, 'success');
            return true;
        }

        return false;
    }

    clearAnswer(disciplina, questao) {
        const container = document.getElementById(disciplina);
        if (!container) return false;

        const selector = `input[name="${disciplina}[${questao}]"]`;
        const radios = container.querySelectorAll(selector);

        if (radios.length === 0) return false;

        radios.forEach(radio => {
            if (radio.checked) {
                radio.checked = false;
                radio.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        const containerQuestao = radios[0].closest('.questao');
        if (containerQuestao) {
            containerQuestao.classList.remove('voice-highlight');
        }

        return true;
    }

    applyAnswer(disciplina, questao, letra) {
        const container = document.getElementById(disciplina);
        if (!container) return false;

        const targetInput = container.querySelector(`input[name="${disciplina}[${questao}]"][value="${letra}"]`);
        if (!targetInput) return false;

        targetInput.checked = true;
        targetInput.dispatchEvent(new Event('change', { bubbles: true }));

        const containerQuestao = targetInput.closest('.questao');
        if (containerQuestao) {
            containerQuestao.classList.remove('voice-highlight');
            void containerQuestao.offsetWidth;
            containerQuestao.classList.add('voice-highlight');
        }

        return true;
    }
}

function initVoiceManager() {
    if (!window.voiceManager) {
        window.voiceManager = new VoiceGabaritoManager();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVoiceManager);
} else {
    initVoiceManager();
}