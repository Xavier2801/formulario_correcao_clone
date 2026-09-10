const numeroMap = {
    'um': 1, 'uma': 1, 'primeira': 1, 'primeiro': 1, '1': 1,
    'dois': 2, 'duas': 2, 'segunda': 2, 'segundo': 2, '2': 2,
    'três': 3, 'tres': 3, 'terceira': 3, 'terceiro': 3, '3': 3,
    'quatro': 4, 'quarta': 4, 'quarto': 4, '4': 4,
    'cinco': 5, 'quinta': 5, 'quinto': 5, '5': 5,
    'seis': 6, 'meia': 6, 'sexta': 6, 'sexto': 6, '6': 6,
    'sete': 7, 'sétima': 7, 'setima': 7, 'sétimo': 7, 'setimo': 7, '7': 7,
    'oito': 8, 'oitava': 8, 'oitavo': 8, '8': 8,
    'nove': 9, 'nona': 9, 'nono': 9, '9': 9,
    'dez': 10, 'décima': 10, 'decima': 10, 'décimo': 10, 'decimo': 10, '10': 10,
    'onze': 11, '11': 11, 'doze': 12, '12': 12, 'treze': 13, '13': 13,
    'quatorze': 14, 'catorze': 14, '14': 14, 'quinze': 15, '15': 15,
    'dezesseis': 16, 'dezasseis': 16, '16': 16,
    'dezessete': 17, 'dezoito': 18, 'dezenove': 19,
    'vinte': 20, 'vinte e um': 21, 'vinte e dois': 22, 'vinte e três': 23,
    'vinte e quatro': 24, 'vinte e cinco': 25, 'vinte e seis': 26, 'vinte e sete': 27,
    'vinte e oito': 28, 'vinte e nove': 29, 'trinta': 30, 'trinta e um': 31, 'trinta e dois': 32
};

const compoundNumbers = [
    [/d[ée]cim[ao]\s+primeir[ao]/gi, ' 11 '],
    [/d[ée]cim[ao]\s+segund[ao]/gi, ' 12 '],
    [/d[ée]cim[ao]\s+terceir[ao]/gi, ' 13 '],
    [/d[ée]cim[ao]\s+quart[ao]/gi, ' 14 '],
    [/d[ée]cim[ao]\s+quint[ao]/gi, ' 15 '],
    [/d[ée]cim[ao]\s+sext[ao]/gi, ' 16 '],
    [/vinte\s+e\s+um/gi, ' 21 '],
    [/vinte\s+e\s+dois/gi, ' 22 '],
    [/vinte\s+e\s+tr[êe]s/gi, ' 23 '],
    [/vinte\s+e\s+quatro/gi, ' 24 '],
    [/vinte\s+e\s+cinco/gi, ' 25 '],
    [/vinte\s+e\s+seis/gi, ' 26 '],
    [/vinte\s+e\s+sete/gi, ' 27 '],
    [/vinte\s+e\s+oito/gi, ' 28 '],
    [/vinte\s+e\s+nove/gi, ' 29 '],
    [/trinta\s+e\s+um/gi, ' 31 '],
    [/trinta\s+e\s+dois/gi, ' 32 ']
];

function normalizeTranscript(rawText) {
    let text = rawText.toLowerCase();

    // Preservar palavras-chave antes de substituições de letras isoladas
    text = text.replace(/matem[áa]tica/gi, ' @@matematica@@ ');
    text = text.replace(/portugu[êe]s/gi, ' @@portugues@@ ');

    // Normalizar ordinais compostos
    for (const [pattern, rep] of compoundNumbers) {
        text = text.replace(pattern, rep);
    }

    // Normalizar "letra X", "opção X", etc.
    text = text.replace(/(?:letra|op[çc][ãa]o)\s+([abcdáéê])/gi, ' $1 ');

    // Normalizar fonética de letras
    text = text.replace(/\b(b[êe]|bola)\b/gi, ' b ');
    text = text.replace(/\b(c[êe]|s[êe]|ce|se|casa)\b/gi, ' c ');
    text = text.replace(/\b(d[êe]|dado)\b/gi, ' d ');
    text = text.replace(/\b([áa]h|[áa]|amor)\b/gi, ' a ');

    // Restaurar disciplinas
    text = text.replace(/@@matematica@@/g, ' matematica ');
    text = text.replace(/@@portugues@@/g, ' portugues ');

    // Remover pontuações
    text = text.replace(/[,;.\/#!$%\^&\*:{}=\-_`~()]/g, ' ');
    text = text.replace(/\s+/g, ' ').trim();
    return text;
}

function parseMultipleCommands(rawText) {
    const text = normalizeTranscript(rawText);
    const tokens = text.split(' ');
    const results = [];
    let currentDiscipline = null;
    let explicitDisciplineChange = null;

    let i = 0;
    while (i < tokens.length) {
        const t = tokens[i];

        if (t === 'português' || t === 'portugues') {
            currentDiscipline = 'portugues';
            explicitDisciplineChange = 'portugues';
            i++;
            continue;
        }
        if (t === 'matemática' || t === 'matematica') {
            currentDiscipline = 'matematica';
            explicitDisciplineChange = 'matematica';
            i++;
            continue;
        }

        // Caso token seja compacto ex: '1a', '2b', '15c'
        const compactMatch = t.match(/^(\d{1,2})([abcd])$/i);
        if (compactMatch) {
            results.push({
                discipline: currentDiscipline,
                questao: parseInt(compactMatch[1], 10),
                letra: compactMatch[2].toUpperCase()
            });
            i++;
            continue;
        }

        // Padrão Inverso: Letra seguida de questão (ex: "letra A na questão 1", "A na 1")
        if (/^[abcd]$/i.test(t)) {
            let nextIdx = i + 1;
            while (nextIdx < tokens.length && ['na', 'no', 'em', 'questão', 'questao', 'pergunta', 'número', 'numero'].includes(tokens[nextIdx])) {
                nextIdx++;
            }
            if (nextIdx < tokens.length) {
                const nextToken = tokens[nextIdx];
                let qNum = null;
                if (/^\d{1,2}$/.test(nextToken)) {
                    qNum = parseInt(nextToken, 10);
                } else if (numeroMap[nextToken] !== undefined) {
                    qNum = numeroMap[nextToken];
                }
                if (qNum !== null && qNum >= 1 && qNum <= 32) {
                    results.push({
                        discipline: currentDiscipline,
                        questao: qNum,
                        letra: t.toUpperCase()
                    });
                    i = nextIdx + 1;
                    continue;
                }
            }
        }

        // Tenta achar número da questão seguido de letra (ex: "questão 1 letra D", "1 D", "um A")
        let qNum = null;
        if (/^\d{1,2}$/.test(t)) {
            qNum = parseInt(t, 10);
        } else if (numeroMap[t] !== undefined) {
            qNum = numeroMap[t];
        }

        if (qNum !== null && qNum >= 1 && qNum <= 32) {
            let nextIdx = i + 1;
            while (nextIdx < tokens.length && ['letra', 'opcao', 'opção', 'na', 'no', 'é', 'e', 'questão', 'questao', 'pergunta'].includes(tokens[nextIdx])) {
                nextIdx++;
            }

            if (nextIdx < tokens.length) {
                const nextToken = tokens[nextIdx];
                let letra = null;
                if (/^[abcd]$/i.test(nextToken)) {
                    letra = nextToken.toUpperCase();
                } else if (nextToken === 'de' || nextToken === 'dê' || nextToken === 'd') {
                    letra = 'D';
                }

                if (letra) {
                    results.push({
                        discipline: currentDiscipline,
                        questao: qNum,
                        letra: letra
                    });
                    i = nextIdx + 1;
                    continue;
                }
            }
        }

        i++;
    }

    return { results, text, explicitDisciplineChange };
}

const tests = [
    'questão 1 letra a questão 2 letra b questão 3 letra c 4 d 5 a 6 b 7 c 8 d 9 a 10 b 11 c 12 d 13 a 14 b 15 c 16 d',
    '1 a 2 b 3 c 4 d 5 a meia b sete c oito d nove a dez b décima primeira c doze d treze a quatorze b quinze c dezesseis d',
    '1a 2b 3c 4d 5b 6a 7d 8c 9b 10a 11d 12c 13b 14a 15d 16c',
    'mudar para português 1 a 2 b 3 c mudar para matemática 1 d 2 a 3 c',
    'primeira a segunda b terceira c quarta d quinta a sexta b sétima c oitava d nona a décima b',
    'a na questão 1, b na questão 2, c na 3, d na 4',
    'mudar para matemática'
];

tests.forEach((t, idx) => {
    console.log(`--- TEST ${idx + 1} ---`);
    const { results, text, explicitDisciplineChange } = parseMultipleCommands(t);
    console.log('Normalized:', text);
    console.log(`Found ${results.length} answers, discipline change: ${explicitDisciplineChange}`);
    console.log(results.map(r => (r.discipline ? `[${r.discipline}] ` : '') + `Q${r.questao}=${r.letra}`).join(', '));
});
