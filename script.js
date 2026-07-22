const RAW_STORY_DATA = {
    title: "A Fragging in Texas",
    paragraphs: [
        "An opposum on the other side of the fire coughed into her paw. A dark viscous substance splattered, consisting of a wet mixture of saliva and tar from many years tobacco use.",
        "Harry's eyes were directed at the broken fragments of wood and kindling. The dog rubbed their curled paws to maintain some semblance of warmth. The scrapping of skin against skin, fur against fur. None of it... none of it got rid of a dead cold feeling that rose from his ribs to his chest. He could not feel warm in such a way as Lady Macbeth could not feel clean.",
        "His breaths were scattered. A few wisps of cold air fluttered from underneath his nostrils.",
        "Bringing his paws closer to his face, as if he had come to prayer, he had not noticed his disposition had been noticed by Annie.",
        "She spoke to Roman.",
        "\"I'll keep watch.\"",
        "There was a grunt of approval, before the cloth of his tent shut.",
        "Annie adjusted the dark brim of her hat before sitting next to Harry. She wore glasses due to her poor eyesight, and as such it wasn't the lifeless look in Harry's eyes that caught her attention- but the quiet whimpers that erupted from his neck.",
        "She was sympathetic to Mr. Bleeding Heart. A man as young as him would see many things in their life, but not many were as unfortunate to bare witness such depths of depravity.",
        "Wrapping her arm around his back, she watched as the dog silently cried into their wrist. Tear's cleaning nothing, except blurring the stain smudges of impurities left from weeks of travel on horse back.",
        "As the lantern light faded from Romans tent, she looked into the distance at some suspicious sounds of foliage snapping. But since that was where the horses were, there was not much to amount to concern.",
        "Nevertheless, the silence was deafening.",
        "She reached into her satchel with her other hand. Inside was a bundle of dynamite, and a thread that required only the warmth provided from the dancing flames to be ignited.",
        "It wasn't noticed immediately. But, after she had brought it closer to her lap so that she could inspect it, it was as if the dogs whimpers had been silenced.",
        "His heart beat had changed, fluttering like a farm chickens wings while caught in the mouth of a wild fox. She was prescient to know he would ruin everything if he yelped. The oppossum's comforting grip over the dogs back changed to her sinking her non-retractable claws deep into his shoulder.",
        "Unlike the folktale of a vampire that took pleasure in biting her victims, Annie took no sadistic enjoyment in feeling Harry's warm blood coursing over her sickly fingers.",
        "Annie could see the change in his breath through how the puffs of cold air were in staggered twos, coming out of his nostrils like that of a train exhaust.",
        "She stared at him.",
        "They were of the same mind. She could read it in his eyes, the wobbling of the highlights of his eye like a constellation in the night sky. There was a name to those thoughts, even if he was too scared to be thinking them. But he did not have the will to act on them.",
        "Epilogue",
        "The sound of an ignited piece of fuse hisses through the air.",
        "It is daybreak, the opossum brings a lit stick of tobacco to their mouth. She stares at the road ahead, and the trail from yesterday. The next town was only a few miles from here.",
        "Behind Annie, the dog led two horses out of the bush. Roman's, and his own.",
        "They would go on to continue their journey.",
        "The clopping sound of hooves against dirt fading into a blur. The bandits left the bush, with one less in their company."
    ]
};

const MAX_WORDS_PER_SLIDE = 16;

function generateSlides(storyData) {
    const slides = [];

    slides.push({
        type: 'title',
        text: storyData.title,
        subtitle: storyData.intro
    });

    storyData.paragraphs.forEach(para => {
        const cleanPara = para.trim();
        if (!cleanPara) return;

        if (cleanPara === "Epilogue") {
            slides.push({ type: 'header', text: "Epilogue" });
            return;
        }

        const sentences = cleanPara.match(/[^.!?]+[.!?]+["’']?|[^.!?]+$/g) || [cleanPara];

        sentences.forEach(sentence => {
            let trimmed = sentence.trim();
            if (!trimmed) return;

            const words = trimmed.split(/\s+/);
            
            if (words.length > MAX_WORDS_PER_SLIDE) {
                const clauses = trimmed.split(/(?<=[,;:\-—])\s+/);
                let currentChunk = [];

                clauses.forEach(clause => {
                    const clauseWords = clause.split(/\s+/);
                    if (currentChunk.length + clauseWords.length <= MAX_WORDS_PER_SLIDE) {
                        currentChunk.push(clause);
                    } else {
                        if (currentChunk.length > 0) {
                            slides.push({ type: 'text', text: currentChunk.join(' ') });
                        }
                        if (clauseWords.length > MAX_WORDS_PER_SLIDE) {
                            for (let i = 0; i < clauseWords.length; i += MAX_WORDS_PER_SLIDE) {
                                const sub = clauseWords.slice(i, i + MAX_WORDS_PER_SLIDE).join(' ');
                                slides.push({ type: 'text', text: sub });
                            }
                            currentChunk = [];
                        } else {
                            currentChunk = [clause];
                        }
                    }
                });

                if (currentChunk.length > 0) {
                    slides.push({ type: 'text', text: currentChunk.join(' ') });
                }
            } else {
                slides.push({ type: 'text', text: trimmed });
            }
        });
    });

    slides.push({
        type: 'end',
        text: "The End"
    });

    return slides;
}

const slides = generateSlides(RAW_STORY_DATA);
let currentIndex = 0;
let fontScaleLevel = 1; 
const fontScaleClasses = ['text-lg sm:text-xl md:text-2xl', 'text-xl sm:text-2xl md:text-3xl', 'text-2xl sm:text-3xl md:text-4xl'];

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
const textSizeBtn = document.getElementById('textSizeBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

function renderSlide(index, animate = true) {
    const slide = slides[index];

    if (animate) {
        slideBox.classList.remove('fade-enter-active');
        slideBox.classList.add('fade-exit-active');
        
        setTimeout(() => {
            updateSlideDOM(slide, index);
            slideBox.classList.remove('fade-exit-active');
            slideBox.classList.add('fade-enter-active');
        }, 180);
    } else {
        updateSlideDOM(slide, index);
    }
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
    } else if (slide.type === 'header') {
        slideContent.innerHTML = `<span class="title-font text-3xl sm:text-4xl text-amber-600 uppercase tracking-widest font-bold">${slide.text}</span>`;
    } else if (slide.type === 'end') {
        slideContent.innerHTML = `<span class="title-font text-4xl sm:text-5xl md:text-6xl text-amber-500 font-extrabold tracking-widest text-glow">${slide.text}</span>`;
        tapHint.classList.add('hidden');
        endControls.classList.remove('hidden');
        endControls.classList.add('flex');
    } else {
        slideContent.textContent = slide.text;
    }

    prevBtn.disabled = (index === 0);
    nextBtn.disabled = (index === slides.length - 1);
}

function goToNext() {
    if (currentIndex < slides.length - 1) {
        currentIndex++;
        renderSlide(currentIndex);
    }
}

function goToPrev() {
    if (currentIndex > 0) {
        currentIndex--;
        renderSlide(currentIndex);
    }
}

tapArea.addEventListener('click', (e) => {
    if (e.target.closest('#endControls') || e.target.closest('button')) return;
    goToNext();
});

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    goToPrev();
});

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    goToNext();
});

restartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
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

    if (Math.abs(diffX) > 50 && Math.abs(diffY) < 60) {
        if (diffX < 0) {
            goToNext(); 
        } else {
            goToPrev(); 
        }
    }
}, { passive: true });

textSizeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fontScaleLevel = (fontScaleLevel + 1) % fontScaleClasses.length;
    slideContent.className = `text-center leading-relaxed sm:leading-loose text-stone-200 font-serif tracking-wide select-none ${fontScaleClasses[fontScaleLevel]}`;
});

fullscreenBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
    }
});

let audioCtx = null;
let isAudioPlaying = false;
let windGain = null;

function initAudio() {
    if (audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
        let white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
    }

    const windNoise = audioCtx.createBufferSource();
    windNoise.buffer = noiseBuffer;
    windNoise.loop = true;

    const windFilter = audioCtx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.value = 280;

    windGain = audioCtx.createGain();
    windGain.gain.value = 0.14;

    windNoise.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(audioCtx.destination);
    windNoise.start();
}

const audioBtn = document.getElementById('audioBtn');
const audioOffIcon = document.getElementById('audioOffIcon');
const audioOnIcon = document.getElementById('audioOnIcon');
const audioLabel = document.getElementById('audioLabel');

audioBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!audioCtx) initAudio();

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    isAudioPlaying = !isAudioPlaying;

    if (isAudioPlaying) {
        windGain.gain.setTargetAtTime(0.14, audioCtx.currentTime, 0.2);
        audioOffIcon.classList.add('hidden');
        audioOnIcon.classList.remove('hidden');
        audioLabel.textContent = "Sound On";
    } else {
        windGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.2);
        audioOffIcon.classList.remove('hidden');
        audioOnIcon.classList.add('hidden');
        audioLabel.textContent = "Ambience";
    }
});

const canvas = document.getElementById('emberCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

class Ember {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = width / 2 + (Math.random() - 0.5) * (width * 0.6);
        this.y = height + 10;
        this.size = Math.random() * 2.2 + 0.8;
        this.speedY = Math.random() * 0.8 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.opacity = Math.random() * 0.7 + 0.3;
        this.fadeRate = Math.random() * 0.003 + 0.001;
        const colors = ['#f97316', '#ea580c', '#c2410c', '#fef08a', '#dc2626'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.02) * 0.3;
        this.opacity -= this.fadeRate;

        if (this.opacity <= 0 || this.y < -10) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

const embers = Array.from({ length: 45 }, () => new Ember());

function animateEmbers() {
    ctx.clearRect(0, 0, width, height);
    embers.forEach(ember => {
        ember.update();
        ember.draw();
    });
    requestAnimationFrame(animateEmbers);
}

window.onload = () => {
    renderSlide(currentIndex, false);
    animateEmbers();
};