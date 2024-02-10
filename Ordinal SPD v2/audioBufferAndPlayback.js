// audioBufferAndPlayback.js

class AudioSamplePlayer {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sampleBuffers = {}; // Object to store loaded audio buffers
    }

    loadSample(key, url) {
        fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
            .then(decodedAudio => {
                this.sampleBuffers[key] = decodedAudio;
            })
            .catch(error => console.error("Error loading audio sample:", error));
    }

    playSample(key) {
        const buffer = this.sampleBuffers[key];
        if (buffer) {
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(this.audioContext.destination);
            source.start(0); // Start playback immediately
        } else {
            console.error("Sample not loaded:", key);
        }
    }
}
