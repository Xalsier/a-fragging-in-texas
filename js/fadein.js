const unityFrame = document.getElementById('emberCanvas');
unityFrame.addEventListener('load', () => {
    setTimeout(() => { revealUI(); }, 4000);
});
function hideUI() {
    const uiElements = document.querySelectorAll('.app-header, .story-container, .app-footer');
    uiElements.forEach(el => {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none'; 
    });
}
function revealUI() {
    const uiElements = document.querySelectorAll('.app-header, .story-container, .app-footer');
    uiElements.forEach(el => {
        el.style.transition = 'opacity 2s ease-in-out'; 
        el.style.opacity = '1';
        el.style.pointerEvents = 'auto'; 
    });
}
hideUI();