// contentHandlers.js

function handleFileSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            try {
                const json = JSON.parse(content);
                listJSONFields(json); // List fields if it's JSON
                processJSONContent(json, currentPad); // Process JSON content
            } catch (err) {
                processHTMLContent(content, currentPad); // Process HTML content
            }
        };
        reader.readAsText(files[0]);
        document.getElementById('modal').style.display = 'none';
    }
}

function loadFromURL(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Assume the response is JSON and parse it
        })
        .then(json => {
            processJSONContent(json, currentPad); // Process the JSON content
        })
        .catch(error => {
            console.error('Error loading or parsing URL:', error);
            alert('Failed to load or parse from URL. Make sure it is a valid JSON.');
        });
}

function listJSONFields(json) {
    const fields = Object.keys(json);
    console.log('Fields in JSON:', fields);
    alert('Fields found in JSON: ' + fields.join(', '));
}

function processJSONContent(json, pad) {
    console.log("Processing JSON content for pad", pad.dataset.pad);

    const audionalArtUrl = json.metadata?.recursiveURLs?.audionalArt;
    if (audionalArtUrl) {
        console.log("Found audionalArt URL:", audionalArtUrl);
        setImageToPad(audionalArtUrl, pad);
    } else {
        console.log("No audionalArt URL found in JSON");
    }

    const base64AudioData = json.audioData;
    if (base64AudioData) {
        console.log("Found base64AudioData, attaching to pad");
        attachBase64Audio(base64AudioData, pad);
    } else {
        console.log("No base64AudioData found in JSON");
    }
}

function attachBase64Audio(base64Data, pad) {
    console.log("Attaching base64 audio data to pad:", pad.dataset.pad);

    const audioPlayer = document.createElement('audio');
    audioPlayer.src = base64Data;
    audioPlayer.controls = true;
    audioPlayer.onloadeddata = () => {
        console.log("Audio data loaded for pad:", pad.dataset.pad);
    };
    audioPlayer.onerror = (e) => {
        console.error("Error loading audio for pad:", pad.dataset.pad, e);
    };

    pad.innerHTML = ''; // Clear the pad
    pad.appendChild(audioPlayer);
    addDeleteButton(pad);
    pad.dataset.loaded = 'true';

    // Adjust the pad's onclick to play the newly attached audio
    pad.onclick = () => {
        console.log("Attempting to play audio for pad:", pad.dataset.pad);
        audioPlayer.play().then(() => {
            console.log("Audio playback started for pad:", pad.dataset.pad);
        }).catch((error) => {
            console.error("Error playing audio for pad:", pad.dataset.pad, error);
        });
    };
}

function setImageToPad(imgUrl, pad) {
    const updatedImgUrl = imgUrl.startsWith('https') ? imgUrl : `https://ordinals.com${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;

    const img = new Image();
    img.onload = () => {
        pad.innerHTML = '';
        pad.appendChild(img);
        img.style.display = 'block';
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        addDeleteButton(pad);
        pad.dataset.loaded = 'true';
    };
    img.onerror = () => {
        pad.innerHTML = 'Error loading image';
        pad.style.pointerEvents = 'auto';
    };
    img.src = updatedImgUrl;
}

function processHTMLContent(htmlContent, pad) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const imgSrc = doc.querySelector('img') ? doc.querySelector('img').src : '';
    const audioSrc = doc.querySelector('audio source') ? doc.querySelector('audio source').src : '';

    clearPad(pad); // Clear existing content

    if (imgSrc) {
        const img = new Image();
        img.onload = () => {
        currentPad.innerHTML = ''; // Clear the pad
        currentPad.appendChild(img); // Add the image to the pad
        img.style.display = 'block';
        img.style.maxWidth = '100%'; // Ensure the image does not exceed the pad's width
        img.style.maxHeight = '100%'; // Ensure the image does not exceed the pad's height
        
        // Add the delete button after loading the image
        addDeleteButton(currentPad);
        currentPad.dataset.loaded = 'true'; // Mark pad as loaded
    };
        img.onerror = () => currentPad.innerHTML = 'Error loading image';
        img.src = imgSrc;
    }

    if (audioSrc) {
        const audioPlayer = document.createElement('audio');
        audioPlayer.src = audioSrc;
        currentPad.appendChild(audioPlayer); // Append the audio player to the current pad
        currentPad.onclick = () => audioPlayer.play(); // Adjust to play audio from the current pad's player
        addDeleteButton(currentPad);
        currentPad.dataset.loaded = 'true'; // Mark pad as loaded
    }
}


function attachAudio(audioSrc, pad) {
    const updatedAudioSrc = audioSrc.startsWith('http') ? audioSrc : `https://ordinals.com${audioSrc.startsWith('/') ? '' : '/'}${audioSrc}`;

    const audioPlayer = document.createElement('audio');
    audioPlayer.src = updatedAudioSrc;
    audioPlayer.controls = true;
    pad.appendChild(audioPlayer);
    pad.dataset.loaded = 'true';
    addDeleteButton(pad);
}
