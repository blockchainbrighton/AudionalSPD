// contentHandlers.js

const samplePlayer = new AudioSamplePlayer();


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
    console.log("Preparing audio data for pad:", pad.dataset.pad);

    // Store base64Data on the pad for later access
    pad.dataset.base64Audio = base64Data;

    // Update pad's onclick to create and play a new audio element each time
    pad.onclick = function() {
        // Create a new audio element for each playback
        const audioPlayer = document.createElement('audio');
        audioPlayer.src = pad.dataset.base64Audio;
        audioPlayer.controls = false; // Set to true if you want controls for each instance (not recommended for multiple playbacks)

        // Automatically play when loaded, not waiting for the entire buffer if possible
        audioPlayer.onloadeddata = () => audioPlayer.play();

        audioPlayer.onerror = (e) => {
            console.error("Error playing audio for pad:", pad.dataset.pad, e);
        };

        // Optionally, remove the audio element after playback is finished to clean up
        audioPlayer.onended = () => {
            audioPlayer.parentNode.removeChild(audioPlayer);
        };

        document.body.appendChild(audioPlayer); // Append to body or an off-screen container if controls are not needed
    };

    // Indicate that the pad is ready for playback
    console.log("Audio ready for playback on pad:", pad.dataset.pad);
    pad.dataset.loaded = 'true';
}


function setImageToPad(imgSrc, pad) {
    // Clear existing content
    pad.innerHTML = '';

    const img = new Image();
    img.onload = () => {
        pad.appendChild(img);
        img.style.display = 'block';
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        addDeleteButton(pad); // Assuming this function adds a delete button
        pad.dataset.loaded = 'true';
    };
    img.onerror = () => {
        console.error("Error loading image");
        pad.innerHTML = 'Error loading image';
    };

    // Check if imgSrc is base64 data and use it directly if so
    if (imgSrc.startsWith('data:image')) {
        img.src = imgSrc;
    } else {
        // If not base64, prepend the domain if necessary
        const updatedImgSrc = imgSrc.startsWith('http') ? imgSrc : `https://ordinals.com${imgSrc.startsWith('/') ? '' : '/'}${imgSrc}`;
        img.src = updatedImgSrc;
    }
}


function processHTMLContent(htmlContent, pad) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const imgSrc = doc.querySelector('img') ? doc.querySelector('img').src : '';
    // Update to use just the audio element if source is nested within
    const audioSrc = (doc.querySelector('audio source') ? doc.querySelector('audio source').src : '') || (doc.querySelector('audio') ? doc.querySelector('audio').src : '');

    clearPad(pad); // Assuming this function clears the pad of previous content

    if (imgSrc) {
        setImageToPad(imgSrc, pad); // Reuse setImageToPad function if applicable
    }

    if (audioSrc) {
        // Store the audio source for later access
        pad.dataset.audioSrc = audioSrc;

        // Update pad's onclick to dynamically create and play audio
        pad.onclick = () => {
            // Dynamically create a new audio element for playback
            const audioPlayer = document.createElement('audio');
            audioPlayer.src = pad.dataset.audioSrc;
            audioPlayer.controls = false; // Set false to not show controls for each playback instance

            audioPlayer.onloadeddata = () => audioPlayer.play();

            audioPlayer.onerror = (e) => {
                console.error("Error playing audio for pad:", pad.dataset.pad, e);
            };

            // Optionally, remove the audio element after playback to clean up
            audioPlayer.onended = () => {
                audioPlayer.parentNode.removeChild(audioPlayer);
            };

            // Append to the document body or a specific off-screen container to play without adding to the visible UI
            document.body.appendChild(audioPlayer);
        };

        // Mark the pad as ready for audio playback
        pad.dataset.loaded = 'true';
        addDeleteButton(pad); // Add a delete button to the pad
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
