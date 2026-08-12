document.getElementById('emberCanvas').addEventListener('load', () => {
    setTimeout(() => { 
        document.querySelectorAll('.app-header, .story-container, .app-footer').forEach(el => {
            el.classList.add('fadein-ui')
        });
    }, 4000);
});