// bpm-display.js
export class BPMDisplay {
    constructor(defaultBPM = 78) {
      this.bpm = defaultBPM;
      this.displayElement = document.querySelector('[canvas="BPM Display"]');
      if (!this.displayElement) {
        console.error('BPM Display canvas element not found!');
        return;
      }
      this.setupDisplayElement();
      this.setupEventListeners();
    }
  
    setupDisplayElement() {
      this.displayElement.innerHTML = '';
      this.displayElement.className = 'bpm-display'; // Assign a class for styling
      
      const displayInput = document.createElement('input');
      displayInput.type = 'text'; // Changed to 'text' to restrict format
      displayInput.readOnly = true; // Optional: Makes the field read-only
      displayInput.value = `${this.bpm} BPM`; // Display BPM with text
      this.displayElement.appendChild(displayInput);
      this.displayInput = displayInput;
      
      // Add buttons to increase and decrease BPM
      const increaseButton = document.createElement('button');
      increaseButton.textContent = '+';
      increaseButton.className = 'bpm-button';
      this.displayElement.appendChild(increaseButton);
      
      const decreaseButton = document.createElement('button');
      decreaseButton.textContent = '-';
      decreaseButton.className = 'bpm-button';
      this.displayElement.appendChild(decreaseButton);
      
      // Wrap the buttons in a container
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'bpm-button-container';
      buttonContainer.appendChild(increaseButton);
      buttonContainer.appendChild(decreaseButton);
      this.displayElement.appendChild(buttonContainer);
    }
  
    setupEventListeners() {
      this.displayInput.addEventListener('change', (e) => {
        this.updateBPM(e.target.value);
      });
      
      // Event listener for increasing BPM
      const increaseButton = this.displayElement.querySelector('.bpm-button:nth-of-type(1)');
      increaseButton.addEventListener('click', () => {
        this.updateBPM(this.bpm + 1);
      });
      
      // Event listener for decreasing BPM
      const decreaseButton = this.displayElement.querySelector('.bpm-button:nth-of-type(2)');
      decreaseButton.addEventListener('click', () => {
        this.updateBPM(Math.max(1, this.bpm - 1));
      });
    }
  
    updateBPM(newBPM) {
      this.bpm = Math.max(1, newBPM);
      this.displayInput.value = `${this.bpm} BPM`;
    }
}
