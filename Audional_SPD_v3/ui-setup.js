// File: ui-setup.js

// Importing the BPMDisplay class from bpm-display.js
import { BPMDisplay } from './bpm-display.js';

// Initializing the BPM display upon DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Ensure the 'control-panel' element is present in your HTML
    new BPMDisplay(78); // Initializes the BPM display with a default value of 78 BPM

});

/**
 * Sets up the trigger pads in the UI.
 */
function setupTriggerPads() {
    const padContainer = document.getElementById('pad-container');
    if (!padContainer) return; // Exit if pad container doesn't exist

    // Assuming 9 pads for a 3x3 grid
    for (let i = 1; i <= 9; i++) {
        const pad = document.createElement('div');
        pad.className = 'pad';
        pad.dataset.pad = i; // Assigning a unique identifier
        pad.textContent = `Pad ${i}`; // Text content for visual representation
        pad.addEventListener('click', () => {
            console.log(`Pad ${i} clicked`); // Placeholder for pad click functionality
        });
        padContainer.appendChild(pad);
    }
}

/**
 * Initializes the step sequencer for each pad.
 */
function setupStepSequencer() {
    // Placeholder for step sequencer setup logic
    // This could involve creating a sequence of steps for each pad and enabling
    // the user to activate or deactivate steps as part of a loop sequence.
    console.log('Step sequencer initialized');
}

/**
 * Sets up the play/stop and record buttons in the UI.
 */
function setupControlButtons() {
    const controlPanel = document.getElementById('control-panel');
    if (!controlPanel) return; // Exit if control panel doesn't exist

    // Setup Play button
    const playButton = document.createElement('div');
    playButton.className = 'playBtn';
    playButton.textContent = 'PLAY';
    playButton.addEventListener('click', () => {
        console.log('Play button clicked');
        // Placeholder for play functionality
    });

    // Create a placeholder for the BPM display
    const bpmDisplayPlaceholder = document.createElement('div');
    bpmDisplayPlaceholder.className = 'bpm-display';

    // Setup Record button
    const recordButton = document.createElement('div');
    recordButton.className = 'recordBtn';
    recordButton.textContent = 'REC';
    recordButton.addEventListener('click', () => {
        console.log('Record button clicked');
        // Placeholder for record functionality
    });

    // Append buttons and BPM display to the control panel in the correct order
    controlPanel.appendChild(playButton);
    controlPanel.appendChild(bpmDisplayPlaceholder); // The BPM display will replace this placeholder
    controlPanel.appendChild(recordButton);
}


// Exporting setup functions for potential use elsewhere
export { setupTriggerPads, setupStepSequencer, setupControlButtons };
