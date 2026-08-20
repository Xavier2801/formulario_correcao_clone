document.addEventListener('DOMContentLoaded', () => {
    const escolaSelect = document.getElementById('escola');
    const turmaSelect = document.getElementById('turma');
    const alunoSelect = document.getElementById('aluno');

    const getBaseUrl = () => {
        return window.location.pathname.includes('/app/views/') ? '../../' : '';
    };

    if (escolaSelect) {
        escolaSelect.addEventListener('change', function() {
            const escolaId = this.value;
            turmaSelect.innerHTML = '<option value="">Carregando...</option>';
            alunoSelect.innerHTML = '<option value="">Selecione a Turma primeiro</option>';

            if (!escolaId) {
                turmaSelect.innerHTML = '<option value="">Selecione a Escola primeiro</option>';
                return;
            }

            fetch(`${getBaseUrl()}app/controllers/SelecaoController.php?escola_id=${encodeURIComponent(escolaId)}`)
                .then(res => res.json())
                .then(data => {
                    turmaSelect.innerHTML = '<option value="">Selecione a Turma</option>';
                    data.forEach(t => {
                        const opt = document.createElement('option');
                        opt.value = t.id;
                        opt.textContent = t.nome;
                        turmaSelect.appendChild(opt);
                    });
                })
                .catch(err => {
                    console.error('Erro ao carregar turmas:', err);
                    turmaSelect.innerHTML = '<option value="">Erro ao carregar turmas</option>';
                });
        });
    }

    if (turmaSelect) {
        turmaSelect.addEventListener('change', function() {
            const turmaId = this.value;
            alunoSelect.innerHTML = '<option value="">Carregando...</option>';

            if (!turmaId) {
                alunoSelect.innerHTML = '<option value="">Selecione a Turma primeiro</option>';
                return;
            }

            fetch(`${getBaseUrl()}app/controllers/SelecaoController.php?turma_id=${encodeURIComponent(turmaId)}`)
                .then(res => res.json())
                .then(data => {
                    alunoSelect.innerHTML = '<option value="">Selecione o Aluno</option>';
                    data.forEach(a => {
                        const opt = document.createElement('option');
                        opt.value = a.id;
                        opt.textContent = a.nome;
                        alunoSelect.appendChild(opt);
                    });
                })
                .catch(err => {
                    console.error('Erro ao carregar alunos:', err);
                    alunoSelect.innerHTML = '<option value="">Erro ao carregar alunos</option>';
                });
        });
    }
});
