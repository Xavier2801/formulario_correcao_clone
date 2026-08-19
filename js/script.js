document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');
    const submitBtn = document.getElementById('submit-btn');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // desativa todas
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // ativa a clicada
            tab.classList.add('active');
            document.getElementById(tab.dataset.target).classList.add('active');

            // muda cor do botão Corrigir conforme aba
            if (tab.dataset.target === 'portugues') {
                submitBtn.style.background = '#38a169';
                submitBtn.onmouseover = () => submitBtn.style.background = '#2f855a';
                submitBtn.onmouseout = () => submitBtn.style.background = '#38a169';
            } else {
                submitBtn.style.background = '#3182ce';
                submitBtn.onmouseover = () => submitBtn.style.background = '#2b6cb0';
                submitBtn.onmouseout = () => submitBtn.style.background = '#3182ce';
            }
        });
    });
});