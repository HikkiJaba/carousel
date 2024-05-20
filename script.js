document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector('.burger-menu');
    const aside = document.querySelector('aside');
    const iconButtons = document.querySelectorAll('.icon-btn');
    const optionsPanel = document.querySelector('.options-panel');

    burgerMenu.addEventListener('click', function() {
        this.classList.toggle('open');
        aside.classList.toggle('open');
        optionsPanel.classList.remove('show');
        iconButtons.forEach(btn => {
            btn.classList.remove('active-icon-btn');
        });
    });

    iconButtons.forEach(button => {
        button.addEventListener('click', function() {
            iconButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                optionsPanel.classList.remove('show');
            } else {
                this.classList.add('active');
                optionsPanel.classList.add('show');
            }
        });
    });
});


function toggleOptionsPanel(panelId) {
    var panel = document.getElementById('options-' + panelId);
    var isOpen = panel.classList.contains('show');

    var allPanels = document.querySelectorAll('.options-panel');
    allPanels.forEach(function(panel) {
        panel.classList.remove('show');
    });

    if (isOpen) {
        panel.classList.remove('show');
    } else {
        panel.classList.add('show');
    }
}


const iconBtns = document.querySelectorAll('.icon-btn');


iconBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        iconBtns.forEach(b => b.classList.remove('active-icon-btn'));
        this.classList.add('active-icon-btn');
    });
});
