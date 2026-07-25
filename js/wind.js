const audioBtn = document.getElementById('audioBtn');
const audioOffIcon = document.getElementById('audioOffIcon');
const audioOnIcon = document.getElementById('audioOnIcon');
const audioLabel = document.getElementById('audioLabel');
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
        audioLabel.textContent = "Mute";
    } else {
        windGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.2);
        audioOffIcon.classList.remove('hidden');
        audioOnIcon.classList.add('hidden');
        audioLabel.textContent = "Ambience";
    }
});