let fontScaleLevel = 1; 
const fontScaleClasses = ['scale-sm', 'scale-md', 'scale-lg', 'scale-xl'];
document.getElementById('textSizeBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    slideContent.classList.remove(fontScaleClasses[fontScaleLevel]);
    fontScaleLevel = (fontScaleLevel + 1) % fontScaleClasses.length;
    slideContent.classList.add(fontScaleClasses[fontScaleLevel]);
});