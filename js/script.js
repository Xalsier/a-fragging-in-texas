function generateSlides(storyData) {
    const slides = [];
    slides.push({
        type: 'title',
        text: storyData.title,
        subtitle: storyData.intro || ""
    });
    storyData.paragraphs.forEach(entry => {
        const [slideNum, text] = Array.isArray(entry) ? entry : [null, entry];
        const cleanText = text ? text.trim() : "";
        if (!cleanText) return;
        if (cleanText === "Epilogue") { slides.push({ type: 'header', text: "Epilogue", slideNumber: slideNum });
        } else { slides.push({ type: 'text', text: cleanText, slideNumber: slideNum });}
    });
    slides.push({ type: 'end', text: "(If you liked this short story, please leave a rating!)" });
    return slides;
}
let slides = [];
let currentIndex = 0;
const tapArea = document.getElementById('tapArea');
const slideBox = document.getElementById('slideBox');
const slideTitle = document.getElementById('slideTitle');
const slideContent = document.getElementById('slideContent');
const slideSubtitle = document.getElementById('slideSubtitle');
const slideCounter = document.getElementById('slideCounter');
const progressBar = document.getElementById('progressBar');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const tapHint = document.getElementById('tapHint');
const endControls = document.getElementById('endControls');
const restartBtn = document.getElementById('restartBtn');
async function initStory() {
    const response = await fetch('./lang/en.json');
    if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
    const storyData = await response.json();
    slides = generateSlides(storyData);
    renderSlide(currentIndex, false);
}
function renderSlide(index, animate = true) {
    if (!slides.length) return;
    const slide = slides[index];
    if (animate) {
        slideBox.classList.remove('fade-enter-active');
        slideBox.classList.add('fade-exit-active');
        setTimeout(() => {
            updateSlideDOM(slide, index);
            slideBox.classList.remove('fade-exit-active');
            slideBox.classList.add('fade-enter-active');
        }, 180);
    } else { updateSlideDOM(slide, index); }
}
function updateSlideDOM(slide, index) {
    slideCounter.textContent = `${index + 1} / ${slides.length}`;
    const pct = ((index + 1) / slides.length) * 100;
    progressBar.style.width = `${pct}%`;
    slideTitle.classList.add('hidden');
    slideSubtitle.classList.add('hidden');
    endControls.classList.add('hidden');
    endControls.classList.remove('flex');
    tapHint.classList.remove('hidden');
    if (slide.type === 'title') {
        slideTitle.textContent = slide.text;
        slideTitle.classList.remove('hidden');
        slideContent.textContent = "";
        slideSubtitle.textContent = slide.subtitle;
        slideSubtitle.classList.remove('hidden');
    } else if (slide.type === 'header') { slideContent.innerHTML = `<span></span>`;
    } else if (slide.type === 'end') {
        slideContent.innerHTML = `<span>${slide.text}</span>`;
        tapHint.classList.add('hidden');
        endControls.classList.remove('hidden');
        endControls.classList.add('flex');
    } else { slideContent.textContent = slide.text; }
    prevBtn.disabled = (index === 0);
    nextBtn.disabled = (index === slides.length - 1);
}
function goToNext() { if (currentIndex < slides.length - 1) { currentIndex++; renderSlide(currentIndex); }}
function goToPrev() { if (currentIndex > 0) { currentIndex--; renderSlide(currentIndex); }}
tapArea.addEventListener('click', (e) => { if (e.target.closest('#endControls') || e.target.closest('button')) return; goToNext(); });
prevBtn.addEventListener('click', (e) => { goToPrev(); });
nextBtn.addEventListener('click', (e) => { goToNext(); });
restartBtn.addEventListener('click', (e) => {
    currentIndex = 0;
    renderSlide(currentIndex);
});
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        goToNext();
    } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault();
        goToPrev();
    }
});
let touchStartX = 0;
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });
window.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    if (Math.abs(diffX) > 50 && Math.abs(diffY) < 60) { diffX < 0 ? goToNext() : goToPrev(); }
}, { passive: true });
initStory();