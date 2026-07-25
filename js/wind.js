const audioBtn = document.getElementById('audioBtn');
const audioOffIcon = document.getElementById('audioOffIcon');
const audioOnIcon = document.getElementById('audioOnIcon');
const audioLabel = document.getElementById('audioLabel');
let audioCtx = null;
let isAudioPlaying = false;
let audioGain = null;
let audioSource = null;
let isLoaded = false;
async function initAudio() {
    if (audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    audioGain = audioCtx.createGain();
    audioGain.gain.value = 0; 
    audioGain.connect(audioCtx.destination);
    try {
        const response = await fetch('wind.ogg');
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        audioSource = audioCtx.createBufferSource();
        audioSource.buffer = audioBuffer;
        audioSource.loop = true; 
        audioSource.connect(audioGain);
        audioSource.start(0);
        isLoaded = true;
        if (isAudioPlaying) {
            audioGain.gain.setTargetAtTime(0.5, audioCtx.currentTime, 0.2);
        }
    } catch (err) {
        console.error("Failed to load wind.ogg:", err);
    }
}
audioBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (!audioCtx) {
        initAudio();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        await audioCtx.resume();
    }
    isAudioPlaying = !isAudioPlaying;
    if (isAudioPlaying) {
        if (audioGain && isLoaded) {
            audioGain.gain.setTargetAtTime(0.5, audioCtx.currentTime, 0.2); 
        }
        audioOffIcon.classList.add('hidden');
        audioOnIcon.classList.remove('hidden');
        audioLabel.textContent = "Mute";
    } else {
        if (audioGain) {
            audioGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.2);
        }
        audioOffIcon.classList.remove('hidden');
        audioOnIcon.classList.add('hidden');
        audioLabel.textContent = "Ambience";
    }
});